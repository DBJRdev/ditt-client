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

    this.addBusinessTripWorkLog = this.addBusinessTripWorkLog.bind(this);
    this.addHomeOfficeWorkLog = this.addHomeOfficeWorkLog.bind(this);
    this.addTimeOffWorkLog = this.addTimeOffWorkLog.bind(this);
    this.addVacationWorkLog = this.addVacationWorkLog.bind(this);
    this.addWorkLog = this.addWorkLog.bind(this);
    this.deleteBusinessTripWorkLog = this.deleteBusinessTripWorkLog.bind(this);
    this.deleteHomeOfficeWorkLog = this.deleteHomeOfficeWorkLog.bind(this);
    this.deleteTimeOffWorkLog = this.deleteTimeOffWorkLog.bind(this);
    this.deleteVacationWorkLog = this.deleteVacationWorkLog.bind(this);
    this.deleteWorkLog = this.deleteWorkLog.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
  }

  componentDidMount() {
    this.props.fetchWorkHoursList(this.props.uid);
    this.props.fetchWorkMonthList(this.props.uid).then(() => {
      this.fetchWorkMonth(this.state.selectedDate);
    });
  }

  addBusinessTripWorkLog(data) {
    return this.props.addBusinessTripWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  addHomeOfficeWorkLog(data) {
    return this.props.addHomeOfficeWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  addTimeOffWorkLog(data) {
    return this.props.addTimeOffWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addVacationWorkLog(data) {
    return this.props.addVacationWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addWorkLog(data) {
    return this.props.addWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteBusinessTripWorkLog(id) {
    return this.props.deleteBusinessTripWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteHomeOfficeWorkLog(id) {
    return this.props.deleteHomeOfficeWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteTimeOffWorkLog(id) {
    return this.props.deleteTimeOffWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteVacationWorkLog(id) {
    return this.props.deleteVacationWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteWorkLog(id) {
    return this.props.deleteWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
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
          addBusinessTripWorkLog={this.addBusinessTripWorkLog}
          addHomeOfficeWorkLog={this.addHomeOfficeWorkLog}
          addTimeOffWorkLog={this.addTimeOffWorkLog}
          addVacationWorkLog={this.addVacationWorkLog}
          addWorkLog={this.addWorkLog}
          deleteBusinessTripWorkLog={this.deleteBusinessTripWorkLog}
          deleteHomeOfficeWorkLog={this.deleteHomeOfficeWorkLog}
          deleteTimeOffWorkLog={this.deleteTimeOffWorkLog}
          deleteVacationWorkLog={this.deleteVacationWorkLog}
          deleteWorkLog={this.deleteWorkLog}
          changeSelectedDate={this.changeSelectedDate}
          isPosting={this.props.isPosting}
          markApproved={() => {}}
          markWaitingForApproval={this.props.markWaitingForApproval}
          selectedDate={this.state.selectedDate}
          workHoursList={this.props.workHoursList}
          workMonth={this.props.workMonth}
          workMonthList={this.props.workMonthList}
        />
      </Layout>
    );
  }
}

WorkLogComponent.defaultProps = {
  uid: null,
  workMonth: null,
};

WorkLogComponent.propTypes = {
  addBusinessTripWorkLog: PropTypes.func.isRequired,
  addHomeOfficeWorkLog: PropTypes.func.isRequired,
  addTimeOffWorkLog: PropTypes.func.isRequired,
  addVacationWorkLog: PropTypes.func.isRequired,
  addWorkLog: PropTypes.func.isRequired,
  deleteBusinessTripWorkLog: PropTypes.func.isRequired,
  deleteHomeOfficeWorkLog: PropTypes.func.isRequired,
  deleteTimeOffWorkLog: PropTypes.func.isRequired,
  deleteVacationWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  fetchWorkHoursList: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  markWaitingForApproval: PropTypes.func.isRequired,
  uid: PropTypes.number,
  workHoursList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
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
