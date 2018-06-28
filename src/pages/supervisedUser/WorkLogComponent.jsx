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
          addTimeOffWorkLog={() => {}}
          addVacationWorkLog={() => {}}
          addWorkLog={() => {}}
          deleteBusinessTripWorkLog={() => {}}
          deleteHomeOfficeWorkLog={() => {}}
          deleteTimeOffWorkLog={() => {}}
          deleteVacationWorkLog={() => {}}
          deleteWorkLog={() => {}}
          changeSelectedDate={this.changeSelectedDate}
          isPosting={this.props.isPosting}
          markApproved={this.props.markApproved}
          markWaitingForApproval={() => {}}
          selectedDate={this.state.selectedDate}
          supervisorView
          workHoursList={this.props.workHoursList}
          workMonth={this.props.workMonth}
          workMonthList={this.props.workMonthList}
        />
      </Layout>
    );
  }
}

WorkLogComponent.defaultProps = {
  workMonth: null,
};

WorkLogComponent.propTypes = {
  fetchWorkHoursList: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  markApproved: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
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
