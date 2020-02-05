import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Icon } from 'react-ui';
import WorkLogForm from '../../components/WorkLogForm';
import { ROLE_EMPLOYEE } from '../../resources/user';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../resources/workMonth';
import {
  getWorkingDays,
  localizedMoment,
} from '../../services/dateTimeService';
import {
  getWorkLogsByDay,
  getWorkMonthByMonth,
} from '../../services/workLogService';
import styles from './workLog.scss';

class FastAccessAddWorkLogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClosed: false,
      isSaved: false,
      selectedDate: localizedMoment(),
    };

    this.handleSaveWorkLog = this.handleSaveWorkLog.bind(this);
    this.saveWorkLogForm = this.saveWorkLogForm.bind(this);
  }

  componentDidMount() {
    const {
      fetchConfig,
      fetchUserByApiToken,
      fetchWorkMonth,
      fetchWorkMonthList,
      match,
    } = this.props;
    const { selectedDate } = this.state;

    fetchUserByApiToken(match.params.apiToken).then((userResponse) => {
      if (userResponse.error || !userResponse.payload.roles.includes(ROLE_EMPLOYEE)) {
        this.setState({ isClosed: true });
      }

      fetchConfig();
      fetchWorkMonthList(userResponse.payload.id).then((workMonthListResponse) => {
        const filterWorkMonth = (data) => ({
          id: data.id,
          month: parseInt(data.month, 10),
          status: data.status,
          user: data.user,
          year: parseInt(data.year.year, 10),
        });
        const workMonth = getWorkMonthByMonth(
          selectedDate,
          workMonthListResponse.payload.map(filterWorkMonth),
        );

        if (workMonth) {
          fetchWorkMonth(workMonth.id);
        }
      });
    });
  }

  handleSaveWorkLog() {
    this.setState({ isSaved: true });
  }

  saveWorkLogForm(data) {
    if (BUSINESS_TRIP_WORK_LOG === data.type) {
      return this.props.addBusinessTripWorkLog({
        date: data.date,
        destination: data.destination,
        expectedArrival: data.expectedArrival,
        expectedDeparture: data.expectedDeparture,
        purpose: data.purpose,
        transport: data.transport,
      }).then(this.handleSaveWorkLog);
    }

    if (HOME_OFFICE_WORK_LOG === data.type) {
      return this.props.addHomeOfficeWorkLog({
        comment: data.comment,
        date: data.date,
      }).then(this.handleSaveWorkLog);
    }

    if (OVERTIME_WORK_LOG === data.type) {
      return this.props.addOvertimeWorkLog({
        date: data.date,
        reason: data.reason,
      }).then(this.handleSaveWorkLog);
    }

    if (SICK_DAY_WORK_LOG === data.type) {
      return this.props.addSickDayWorkLog({
        childDateOfBirth: data.childDateOfBirth,
        childName: data.childName,
        date: data.date,
        variant: data.variant,
      }).then(this.handleSaveWorkLog);
    }

    if (TIME_OFF_WORK_LOG === data.type) {
      return this.props.addTimeOffWorkLog({
        comment: data.comment,
        date: data.date,
      }).then(this.handleSaveWorkLog);
    }

    if (VACATION_WORK_LOG === data.type) {
      const workingDays = getWorkingDays(data.date, data.dateTo, this.props.config.get('supportedHolidays'));
      const workLogs = workingDays.map((workingDay) => ({ date: workingDay }));

      return this.props.addMultipleVacationWorkLog(workLogs).then(this.handleSaveWorkLog);
    }

    if (WORK_LOG === data.type) {
      return this.props.addWorkLog({
        endTime: data.endTime,
        startTime: data.startTime,
      }).then(this.handleSaveWorkLog);
    }

    throw new Error(`Unknown type ${data.type}`);
  }

  render() {
    const {
      config,
      isFetching,
      isPosting,
      t,
      workMonth,
      workMonthList,
    } = this.props;
    const {
      isClosed,
      isSaved,
      selectedDate,
    } = this.state;

    if (!config || !workMonthList || !workMonth || isFetching) {
      return (
        <div className={styles.centeredText}>
          {t('general:text.loading')}
        </div>
      );
    }

    if (isSaved) {
      return (
        <div className={styles.savedIcon}>
          <Icon icon="check_circle" size="larger" />
        </div>
      );
    }

    if (isClosed) {
      return (
        <div className={styles.closeIcon}>
          <Icon icon="cancel" size="larger" />
        </div>
      );
    }

    return (
      <WorkLogForm
        closeHandler={() => {
          this.setState({ isClosed: true });
        }}
        config={config}
        date={selectedDate}
        isPosting={isPosting}
        saveHandler={this.saveWorkLogForm}
        showWorkLogTimer
        user={workMonth.get('user')}
        workLogsOfDay={workMonth ? getWorkLogsByDay(selectedDate, workMonth.get('workLogs')) : []}
        showInfoText={false}
      />
    );
  }
}

FastAccessAddWorkLogComponent.defaultProps = {
  config: {},
  workMonth: null,
  workMonthList: null,
};

FastAccessAddWorkLogComponent.propTypes = {
  addBusinessTripWorkLog: PropTypes.func.isRequired,
  addHomeOfficeWorkLog: PropTypes.func.isRequired,
  addMultipleVacationWorkLog: PropTypes.func.isRequired,
  addOvertimeWorkLog: PropTypes.func.isRequired,
  addSickDayWorkLog: PropTypes.func.isRequired,
  addTimeOffWorkLog: PropTypes.func.isRequired,
  addWorkLog: PropTypes.func.isRequired,
  config: ImmutablePropTypes.mapContains({}),
  fetchConfig: PropTypes.func.isRequired,
  fetchUserByApiToken: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      apiToken: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
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
  })),
};

export default withTranslation()(FastAccessAddWorkLogComponent);
