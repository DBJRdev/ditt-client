import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { Table } from 'react-ui';
import Layout from '../../components/Layout';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  TIME_OFF_WORK_LOG,
} from '../../resources/workMonth';
import {
  toDayMonthYearFormat,
} from '../../services/dateTimeService';

class ListComponent extends React.Component {
  componentDidMount() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        this.props.fetchSpecialApprovalList(decodedToken.uid);
      }
    }
  }

  getFilteredSpecialApprovals() {
    let specialApprovalList = Immutable.List();

    specialApprovalList = specialApprovalList.concat((
      this.props.specialApprovalList.get('businessTripWorkLogs').map((
        workLog => workLog
          .set('id', `BT-${workLog.get('id')}`)
          .set('type', BUSINESS_TRIP_WORK_LOG)
      ))
    ));
    specialApprovalList = specialApprovalList.concat((
      this.props.specialApprovalList.get('homeOfficeWorkLogs').map((
        workLog => workLog
          .set('id', `HO-${workLog.get('id')}`)
          .set('type', HOME_OFFICE_WORK_LOG)
      ))
    ));
    specialApprovalList = specialApprovalList.concat((
      this.props.specialApprovalList.get('timeOffWorkLogs').map((
        workLog => workLog
          .set('id', `TO-${workLog.get('id')}`)
          .set('type', TIME_OFF_WORK_LOG)
      ))
    ));
    specialApprovalList = specialApprovalList.sortBy(workLog => -workLog.get('date'));

    return specialApprovalList;
  }

  render() {
    const specialApprovals = this.getFilteredSpecialApprovals();

    return (
      <Layout title="Special approvals" loading={this.props.isFetching}>
        {specialApprovals.count() > 0 ? (
          <Table
            columns={[
              {
                format: row => `${row.workMonth.user.firstName} ${row.workMonth.user.lastName}`,
                label: 'Name',
                name: 'lastName',
              },
              {
                format: row => toDayMonthYearFormat(row.date),
                label: 'Date',
                name: 'date',
              },
              {
                format: (row) => {
                  switch (row.type) {
                    case BUSINESS_TRIP_WORK_LOG:
                      return 'Business trip';
                    case HOME_OFFICE_WORK_LOG:
                      return 'Home office';
                    case TIME_OFF_WORK_LOG:
                      return 'Time off';
                    default:
                      return '-';
                  }
                },
                label: 'Type',
                name: 'type',
              },
              {
                format: () => (
                  <div>
                    <span>Approved</span>
                    <span>Rejected</span>
                  </div>
                ),
                label: 'Actions',
                name: 'actions',
              },
            ]}
            rows={specialApprovals.toJS()}
          />
        ) : (
          <div>
            You do not seem to have any pending special approvals.
          </div>
        )}
      </Layout>
    );
  }
}

ListComponent.propTypes = {
  fetchSpecialApprovalList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  specialApprovalList: ImmutablePropTypes.mapContains({
    businessTripWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    homeOfficeWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    timeOffWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

export default ListComponent;
