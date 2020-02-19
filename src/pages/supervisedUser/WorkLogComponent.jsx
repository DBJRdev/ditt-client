import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import jwt from 'jsonwebtoken';
import WorkLogCalendar from '../../components/WorkLogCalendar';
import Layout from '../../components/Layout';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../resources/workMonth';
import {
  createDate,
  getAllDays,
  localizedMoment,
} from '../../services/dateTimeService';
import { getWorkMonthByMonth } from '../../services/workLogService';

class WorkLogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: localizedMoment(),
    };

    if (this.props.match.params.year && this.props.match.params.month) {
      this.state = {
        selectedDate: createDate(
          this.props.match.params.year,
          this.props.match.params.month - 1,
          1,
        ),
      };
    }

    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.addMultipleMaternityProtectionWorkLogs = this.addMultipleMaternityProtectionWorkLogs
      .bind(this);
    this.deleteMultipleMaternityProtectionWorkLogs = this.deleteMultipleMaternityProtectionWorkLogs
      .bind(this);
  }

  componentDidMount() {
    this.props.fetchConfig();
    this.props.fetchWorkHoursList(this.props.match.params.id);
    this.props.fetchWorkMonthList(this.props.match.params.id).then(() => {
      this.fetchWorkMonth(this.state.selectedDate);
    });
  }

  fetchWorkMonth(selectedDate) {
    const workMonth = getWorkMonthByMonth(selectedDate, this.props.workMonthList.toJS());

    if (workMonth) {
      return this.props.fetchWorkMonth(workMonth.id);
    }

    return null;
  }

  changeSelectedDate(selectedDate) {
    this.fetchWorkMonth(selectedDate).then(() => this.setState({ selectedDate }));
  }

  addMultipleMaternityProtectionWorkLogs(data) {
    const { addMultipleMaternityProtectionWorkLogs } = this.props;
    const workingDays = getAllDays(data.date, data.dateTo);
    const workLogs = workingDays.map((workingDay) => ({ date: workingDay }));

    return addMultipleMaternityProtectionWorkLogs({
      user: data.user,
      workLogs,
    }).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteMultipleMaternityProtectionWorkLogs(id) {
    return this.props.deleteMaternityProtectionWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  render() {
    let title = this.props.t('workLog:title.workLogs');

    if (this.props.workMonth) {
      const user = this.props.workMonth.get('user');
      const name = `${user.get('firstName')} ${user.get('lastName')}`;
      title = this.props.t('workLog:title.supervisedUserWorkLogs', { name });
    }

    let uid = null;

    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        // eslint-disable-next-line prefer-destructuring
        uid = decodedToken.uid;
      }
    }

    return (
      <Layout title={title} loading={this.props.isFetching}>
        {this.props.config && (
          <WorkLogCalendar
            addBusinessTripWorkLog={() => {}}
            addHomeOfficeWorkLog={() => {}}
            addOvertimeWorkLog={() => {}}
            addSickDayWorkLog={() => {}}
            addTimeOffWorkLog={() => {}}
            addMultipleMaternityProtectionWorkLogs={this.addMultipleMaternityProtectionWorkLogs}
            addMultipleVacationWorkLog={() => {}}
            addWorkLog={() => {}}
            businessTripWorkLog={this.props.businessTripWorkLog}
            changeSelectedDate={this.changeSelectedDate}
            config={this.props.config}
            deleteBusinessTripWorkLog={() => {}}
            deleteHomeOfficeWorkLog={() => {}}
            deleteMaternityProtectionWorkLog={this.deleteMultipleMaternityProtectionWorkLogs}
            deleteOvertimeWorkLog={() => {}}
            deleteSickDayWorkLog={() => {}}
            deleteTimeOffWorkLog={() => {}}
            deleteVacationWorkLog={() => {}}
            deleteWorkLog={() => {}}
            fetchBusinessTripWorkLog={this.props.fetchBusinessTripWorkLog}
            fetchHomeOfficeWorkLog={this.props.fetchHomeOfficeWorkLog}
            fetchMaternityProtectionWorkLog={this.props.fetchMaternityProtectionWorkLog}
            fetchOvertimeWorkLog={this.props.fetchOvertimeWorkLog}
            fetchSickDayWorkLog={this.props.fetchSickDayWorkLog}
            fetchTimeOffWorkLog={this.props.fetchTimeOffWorkLog}
            fetchVacationWorkLog={this.props.fetchVacationWorkLog}
            fetchWorkLog={this.props.fetchWorkLog}
            homeOfficeWorkLog={this.props.homeOfficeWorkLog}
            isPosting={this.props.isPosting}
            markApproved={this.props.markApproved}
            markWaitingForApproval={() => {}}
            maternityProtectionWorkLog={this.props.maternityProtectionWorkLog}
            overtimeWorkLog={this.props.overtimeWorkLog}
            selectedDate={this.state.selectedDate}
            supervisorView
            sickDayWorkLog={this.props.sickDayWorkLog}
            timeOffWorkLog={this.props.timeOffWorkLog}
            uid={uid}
            vacationWorkLog={this.props.vacationWorkLog}
            workHoursList={this.props.workHoursList}
            workLog={this.props.workLog}
            workMonth={this.props.workMonth}
            workMonthList={this.props.workMonthList}
          />
        )}
      </Layout>
    );
  }
}

WorkLogComponent.defaultProps = {
  businessTripWorkLog: null,
  config: {},
  homeOfficeWorkLog: null,
  maternityProtectionWorkLog: null,
  overtimeWorkLog: null,
  sickDayWorkLog: null,
  timeOffWorkLog: null,
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogComponent.propTypes = {
  addMultipleMaternityProtectionWorkLogs: PropTypes.func.isRequired,
  businessTripWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    destination: PropTypes.string.isRequired,
    expectedArrival: PropTypes.string.isRequired,
    expectedDeparture: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
    transport: PropTypes.string.isRequired,
  }),
  config: ImmutablePropTypes.mapContains({}),
  deleteMaternityProtectionWorkLog: PropTypes.func.isRequired,
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
  fetchMaternityProtectionWorkLog: PropTypes.func.isRequired,
  fetchOvertimeWorkLog: PropTypes.func.isRequired,
  fetchSickDayWorkLog: PropTypes.func.isRequired,
  fetchTimeOffWorkLog: PropTypes.func.isRequired,
  fetchVacationWorkLog: PropTypes.func.isRequired,
  fetchWorkHoursList: PropTypes.func.isRequired,
  fetchWorkLog: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  homeOfficeWorkLog: ImmutablePropTypes.mapContains({
    comment: PropTypes.string,
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  markApproved: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      month: PropTypes.string,
      year: PropTypes.string,
    }).isRequired,
  }).isRequired,
  maternityProtectionWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
  }),
  overtimeWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    reason: PropTypes.string,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  sickDayWorkLog: ImmutablePropTypes.mapContains({
    childDateOfBirth: PropTypes.object,
    childName: PropTypes.string,
    date: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
  }),
  t: PropTypes.func.isRequired,
  timeOffWorkLog: ImmutablePropTypes.mapContains({
    comment: PropTypes.string,
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  token: PropTypes.string.isRequired,
  vacationWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  workHoursList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
  workLog: ImmutablePropTypes.mapContains({
    endTime: PropTypes.object.isRequired,
    startTime: PropTypes.object.isRequired,
  }),
  workMonth: ImmutablePropTypes.mapContains({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_OPENED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
    user: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
    workLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      endTime: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      startTime: PropTypes.shape.isRequired,
    })).isRequired,
    year: PropTypes.number,
  }),
  workMonthList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default withTranslation()(WorkLogComponent);
