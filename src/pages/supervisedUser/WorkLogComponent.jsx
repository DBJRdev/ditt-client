import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLogCalendar from '../../components/WorkLogCalendar';
import Layout from '../../components/Layout';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../resources/workMonth';
import { localizedMoment } from '../../services/dateTimeService';
import { getWorkMonthByMonth } from '../../services/workLogService';

class WorkLogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: localizedMoment(),
    };

    this.changeSelectedDate = this.changeSelectedDate.bind(this);
  }

  componentDidMount() {
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

  render() {
    return (
      <Layout title="Work logs" loading={this.props.isFetching}>
        <WorkLogCalendar
          addBusinessTripWorkLog={() => {}}
          addHomeOfficeWorkLog={() => {}}
          addSickDayWorkLog={() => {}}
          addTimeOffWorkLog={() => {}}
          addVacationWorkLog={() => {}}
          addWorkLog={() => {}}
          businessTripWorkLog={this.props.businessTripWorkLog}
          changeSelectedDate={this.changeSelectedDate}
          deleteBusinessTripWorkLog={() => {}}
          deleteHomeOfficeWorkLog={() => {}}
          deleteSickDayWorkLog={() => {}}
          deleteTimeOffWorkLog={() => {}}
          deleteVacationWorkLog={() => {}}
          deleteWorkLog={() => {}}
          fetchBusinessTripWorkLog={this.props.fetchBusinessTripWorkLog}
          fetchHomeOfficeWorkLog={this.props.fetchHomeOfficeWorkLog}
          fetchSickDayWorkLog={this.props.fetchSickDayWorkLog}
          fetchTimeOffWorkLog={this.props.fetchTimeOffWorkLog}
          fetchVacationWorkLog={this.props.fetchVacationWorkLog}
          fetchWorkLog={this.props.fetchWorkLog}
          homeOfficeWorkLog={this.props.homeOfficeWorkLog}
          isPosting={this.props.isPosting}
          markApproved={this.props.markApproved}
          markWaitingForApproval={() => {}}
          selectedDate={this.state.selectedDate}
          supervisorView
          sickDayWorkLog={this.props.sickDayWorkLog}
          timeOffWorkLog={this.props.timeOffWorkLog}
          vacationWorkLog={this.props.vacationWorkLog}
          workHoursList={this.props.workHoursList}
          workLog={this.props.workLog}
          workMonth={this.props.workMonth}
          workMonthList={this.props.workMonthList}
        />
      </Layout>
    );
  }
}

WorkLogComponent.defaultProps = {
  businessTripWorkLog: null,
  homeOfficeWorkLog: null,
  sickDayWorkLog: null,
  timeOffWorkLog: null,
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogComponent.propTypes = {
  businessTripWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
  fetchSickDayWorkLog: PropTypes.func.isRequired,
  fetchTimeOffWorkLog: PropTypes.func.isRequired,
  fetchVacationWorkLog: PropTypes.func.isRequired,
  fetchWorkHoursList: PropTypes.func.isRequired,
  fetchWorkLog: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  homeOfficeWorkLog: ImmutablePropTypes.mapContains({
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
    }).isRequired,
  }).isRequired,
  sickDayWorkLog: ImmutablePropTypes.mapContains({
    childDateOfBirth: PropTypes.object,
    childName: PropTypes.string,
    date: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
  }),
  timeOffWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
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

export default WorkLogComponent;
