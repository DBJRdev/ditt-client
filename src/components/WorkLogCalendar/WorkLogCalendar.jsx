import moment from 'moment';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Icon,
} from '@react-ui-org/react-ui';
import WorkLogForm from '../WorkLogForm';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../../resources/sickDayWorkLog';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  MATERNITY_PROTECTION_WORK_LOG,
  OVERTIME_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG,
  SICK_DAY_UNPAID_WORK_LOG,
  SICK_DAY_WORK_LOG,
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../resources/workMonth';
import {
  getNumberOfWorkingDays,
  includesSameDate,
  isWeekend,
  localizedMoment,
  toDayFormat,
  toDayMonthYearFormat,
  toHourMinuteFormatFromInt,
  toMonthYearFormat,
  toJson,
  toMomentDateTime,
} from '../../services/dateTimeService';
import {
  getWorkLogTimer,
  removeWorkLogTimer,
  setWorkLogTimer,
} from '../../services/storageService';
import {
  getWorkedTime,
  getWorkLogsByDay,
  getWorkMonthByMonth,
} from '../../services/workLogService';
import { AddSupervisorWorkLogModal } from './components/AddSupervisorWorkLogModal';
import { WorkLogDetailButton } from './components/WorkLogDetailButton';
import { WorkLogDetailModal } from './components/WorkLogDetailModal';

import styles from './WorkLogCalendar.scss';

class WorkLogCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteWorkLogDialog: false,
      showDeleteWorkLogDialogId: null,
      showDeleteWorkLogDialogType: null,
      showSupervisorWorkLogForm: false,
      showSupervisorWorkLogFormDate: localizedMoment(),
      showWorkLogForm: false,
      showWorkLogFormDate: localizedMoment(),
      workLogTimer: getWorkLogTimer() ? toMomentDateTime(getWorkLogTimer()) : null,
      workLogTimerInterval: '00:00:00',
    };

    this.openDeleteWorkLogDialog = this.openDeleteWorkLogDialog.bind(this);
    this.selectPreviousMonth = this.selectPreviousMonth.bind(this);
    this.selectNextMonth = this.selectNextMonth.bind(this);
    this.saveWorkLogForm = this.saveWorkLogForm.bind(this);
    this.closeWorkLogForm = this.closeWorkLogForm.bind(this);
    this.closeDeleteWorkLogDialog = this.closeDeleteWorkLogDialog.bind(this);
    this.initAndStartWorkLogTimer = this.initAndStartWorkLogTimer.bind(this);
    this.stopWorkLogTimer = this.stopWorkLogTimer.bind(this);

    this.openSupervisorWorkLogForm = this.openSupervisorWorkLogForm.bind(this);
    this.closeSupervisorWorkLogForm = this.closeSupervisorWorkLogForm.bind(this);
    this.saveSupervisorWorkLogForm = this.saveSupervisorWorkLogForm.bind(this);

    this.workLogTimer = null;

    if (this.state.workLogTimer) {
      this.startWorkLogTimer();
    }
  }

  getDaysOfSelectedMonth() {
    const {
      selectedDate,
      workHoursList,
      workMonth,
    } = this.props;
    const lastDayOfMonth = selectedDate.clone().endOf('month');
    const renderingDay = selectedDate.clone().startOf('month');

    const days = [];

    while (renderingDay <= lastDayOfMonth) {
      let workLogListForRenderingDay = Immutable.List();

      if (workMonth) {
        [
          'workLogs',
          'businessTripWorkLogs',
          'homeOfficeWorkLogs',
          'maternityProtectionWorkLogs',
          'overtimeWorkLogs',
          'parentalLeaveWorkLogs',
          'sickDayWorkLogs',
          'sickDayUnpaidWorkLogs',
          'timeOffWorkLogs',
          'vacationWorkLogs',
        ].forEach((key) => {
          workLogListForRenderingDay = workLogListForRenderingDay.concat((
            getWorkLogsByDay(renderingDay, workMonth.get(key))
          ));
        });

        workLogListForRenderingDay = workLogListForRenderingDay.toJS();
      }

      days.push({
        date: renderingDay.clone(),
        workLogList: workLogListForRenderingDay,
        workTime: getWorkedTime(
          workLogListForRenderingDay,
          workHoursList.find((
            (workHour) => workHour.get('month') === (renderingDay.clone().month() + 1)
              && workHour.get('year') === renderingDay.clone().year()
          )).toJS(),
          this.props.config.get('workedHoursLimits').toJS(),
        ),
      });

      renderingDay.add(1, 'day');
    }

    return days;
  }

  selectNextMonth() {
    this.props.changeSelectedDate(this.props.selectedDate.clone().add(1, 'month'));
  }

  selectPreviousMonth() {
    this.props.changeSelectedDate(this.props.selectedDate.clone().subtract(1, 'month'));
  }

  openDeleteWorkLogDialog(e, id, type) {
    e.stopPropagation();

    if (BUSINESS_TRIP_WORK_LOG === type) {
      this.props.fetchBusinessTripWorkLog(id);
    } else if (HOME_OFFICE_WORK_LOG === type) {
      this.props.fetchHomeOfficeWorkLog(id);
    } else if (MATERNITY_PROTECTION_WORK_LOG === type) {
      this.props.fetchMaternityProtectionWorkLog(id);
    } else if (OVERTIME_WORK_LOG === type) {
      this.props.fetchOvertimeWorkLog(id);
    } else if (PARENTAL_LEAVE_WORK_LOG === type) {
      this.props.fetchParentalLeaveWorkLog(id);
    } else if (SICK_DAY_UNPAID_WORK_LOG === type) {
      this.props.fetchSickDayUnpaidWorkLog(id);
    } else if (SICK_DAY_WORK_LOG === type) {
      this.props.fetchSickDayWorkLog(id);
    } else if (TIME_OFF_WORK_LOG === type) {
      this.props.fetchTimeOffWorkLog(id);
    } else if (VACATION_WORK_LOG === type) {
      this.props.fetchVacationWorkLog(id);
    } else if (WORK_LOG === type) {
      this.props.fetchWorkLog(id);
    }

    this.setState({
      showDeleteWorkLogDialog: true,
      showDeleteWorkLogDialogId: id,
      showDeleteWorkLogDialogType: type,
    });
  }

  deleteWorkLog(id, type) {
    if (BUSINESS_TRIP_WORK_LOG === type) {
      return this.props.deleteBusinessTripWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (HOME_OFFICE_WORK_LOG === type) {
      return this.props.deleteHomeOfficeWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (MATERNITY_PROTECTION_WORK_LOG === type) {
      return this.props.deleteMaternityProtectionWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (OVERTIME_WORK_LOG === type) {
      return this.props.deleteOvertimeWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (PARENTAL_LEAVE_WORK_LOG === type) {
      return this.props.deleteParentalLeaveWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (SICK_DAY_UNPAID_WORK_LOG === type) {
      return this.props.deleteSickDayUnpaidWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (SICK_DAY_WORK_LOG === type) {
      return this.props.deleteSickDayWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (TIME_OFF_WORK_LOG === type) {
      return this.props.deleteTimeOffWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (VACATION_WORK_LOG === type) {
      return this.props.deleteVacationWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (WORK_LOG === type) {
      return this.props.deleteWorkLog(id).then(this.closeDeleteWorkLogDialog);
    }

    throw new Error(`Unknown type ${type}`);
  }

  closeDeleteWorkLogDialog() {
    this.setState({
      showDeleteWorkLogDialog: false,
      showDeleteWorkLogDialogId: null,
      showDeleteWorkLogDialogType: null,
    });
  }

  openWorkLogForm(date) {
    const todayDate = localizedMoment();
    date.hour(todayDate.hour()).minute(todayDate.minute());

    this.setState({
      showWorkLogForm: true,
      showWorkLogFormDate: date,
    });
  }

  openSupervisorWorkLogForm(date) {
    date.hour(0).minute(0);

    this.setState({
      showSupervisorWorkLogForm: true,
      showSupervisorWorkLogFormDate: date,
    });
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
      });
    }

    if (HOME_OFFICE_WORK_LOG === data.type) {
      return this.props.addHomeOfficeWorkLog({
        comment: data.comment,
        date: data.date,
      });
    }

    if (OVERTIME_WORK_LOG === data.type) {
      return this.props.addOvertimeWorkLog({
        date: data.date,
        reason: data.reason,
      });
    }

    if (SICK_DAY_WORK_LOG === data.type) {
      return this.props.addSickDayWorkLog({
        childDateOfBirth: data.childDateOfBirth,
        childName: data.childName,
        date: data.date,
        variant: data.variant,
      });
    }

    if (TIME_OFF_WORK_LOG === data.type) {
      return this.props.addTimeOffWorkLog({
        comment: data.comment,
        date: data.date,
      });
    }

    if (VACATION_WORK_LOG === data.type) {
      return this.props.addMultipleVacationWorkLog({
        date: data.date,
        dateTo: data.dateTo,
      });
    }

    if (WORK_LOG === data.type) {
      return this.props.addWorkLog({
        endTime: data.endTime,
        startTime: data.startTime,
      });
    }

    throw new Error(`Unknown type ${data.type}`);
  }

  saveSupervisorWorkLogForm(data) {
    const {
      addMultipleMaternityProtectionWorkLogs,
      addMultipleParentalLeaveWorkLogs,
      addMultipleSickDayUnpaidWorkLogs,
      workMonth,
    } = this.props;

    const requestData = {
      date: data.date,
      dateTo: data.dateTo,
      user: {
        id: workMonth.get('user').get('id'),
      },
    };

    if (MATERNITY_PROTECTION_WORK_LOG === data.type) {
      return addMultipleMaternityProtectionWorkLogs(requestData);
    }

    if (PARENTAL_LEAVE_WORK_LOG === data.type) {
      return addMultipleParentalLeaveWorkLogs(requestData);
    }

    if (SICK_DAY_UNPAID_WORK_LOG === data.type) {
      return addMultipleSickDayUnpaidWorkLogs(requestData);
    }

    throw new Error(`Unknown type ${data.type}`);
  }

  closeWorkLogForm() {
    this.setState({ showWorkLogForm: false });
  }

  closeSupervisorWorkLogForm() {
    this.setState({ showSupervisorWorkLogForm: false });
  }

  countWaitingForApprovalWorkLogs() {
    if (this.props.workMonth) {
      let count = 0;

      [
        'businessTripWorkLogs',
        'homeOfficeWorkLogs',
        'overtimeWorkLogs',
        'timeOffWorkLogs',
        'vacationWorkLogs',
      ].forEach((key) => {
        this.props.workMonth.get(key).forEach((workLog) => {
          if (STATUS_WAITING_FOR_APPROVAL === workLog.get('status')) {
            count += 1;
          }
        });
      });

      return count;
    }

    return 0;
  }

  initAndStartWorkLogTimer() {
    const startTime = localizedMoment();

    this.setState({ workLogTimer: startTime });
    setWorkLogTimer(toJson(startTime));

    this.startWorkLogTimer();
  }

  startWorkLogTimer() {
    this.workLogTimer = setInterval(() => {
      const intervalMiliseconds = localizedMoment().diff(this.state.workLogTimer);
      const interval = moment.utc(intervalMiliseconds);

      this.setState({ workLogTimerInterval: interval.format('HH:mm:ss') });
    }, 1000);
  }

  stopWorkLogTimer() {
    const startTime = toMomentDateTime(getWorkLogTimer());
    const endTime = localizedMoment();
    const intervalMiliseconds = localizedMoment().diff(this.state.workLogTimer);

    clearInterval(this.workLogTimer);

    this.setState({
      workLogTimer: null,
      workLogTimerInterval: '00:00:00',
    });
    removeWorkLogTimer();

    if (intervalMiliseconds >= 30000) {
      this.props.addWorkLog({
        endTime,
        startTime,
      });
    }
  }

  renderWorkHoursInfo(daysOfSelectedMonth) {
    const {
      selectedDate,
      t,
      workHoursList,
    } = this.props;
    let requiredHours = 0;
    let requiredHoursLeft = 0;
    const workedTime = moment.duration();

    const workHours = workHoursList.find((item) => (
      item.get('year') === selectedDate.year()
      && item.get('month') === selectedDate.month() + 1
    ));

    if (workHours) {
      const workingDays = getNumberOfWorkingDays(
        selectedDate.clone().startOf('month'),
        selectedDate.clone().endOf('month'),
        this.props.config.get('supportedHolidays'),
      );
      requiredHours = workHours.get('requiredHours') * workingDays;
    }

    daysOfSelectedMonth.forEach((day) => {
      workedTime.add(day.workTime.workTime);
    });

    if (this.props.workMonth && this.props.workMonth.get('status') !== STATUS_APPROVED) {
      const userYearStats = this.props.workMonth.getIn(['user', 'yearStats']).toJS();
      const requiredHoursTotal = userYearStats.reduce(
        (total, userYearStat) => total + userYearStat.requiredHours,
        0,
      );
      const workedHoursTotal = userYearStats.reduce(
        (total, userYearStat) => total + userYearStat.workedHours,
        0,
      );

      requiredHoursLeft = requiredHoursTotal - workedHoursTotal;

      if (requiredHoursLeft > 0) {
        return t(
          'workLog:text.workedAndRequiredHoursPlusLeft',
          {
            requiredHours: toHourMinuteFormatFromInt(
              Math.max(0, requiredHours + requiredHoursLeft),
            ),
            requiredHoursLeft: toHourMinuteFormatFromInt(requiredHoursLeft),
            requiredHoursWithoutLeft: toHourMinuteFormatFromInt(requiredHours),
            workedHours: `${workedTime.hours() + (workedTime.days() * 24)}:${(workedTime.minutes()) < 10 ? '0' : ''}${workedTime.minutes()}`,
          },
        );
      }

      if (requiredHoursLeft < 0) {
        return t(
          'workLog:text.workedAndRequiredHoursMinusLeft',
          {
            requiredHours: toHourMinuteFormatFromInt(
              Math.max(0, requiredHours + requiredHoursLeft),
            ),
            requiredHoursLeft: toHourMinuteFormatFromInt(requiredHoursLeft),
            requiredHoursWithoutLeft: toHourMinuteFormatFromInt(requiredHours),
            workedHours: `${workedTime.hours() + (workedTime.days() * 24)}:${(workedTime.minutes()) < 10 ? '0' : ''}${workedTime.minutes()}`,
          },
        );
      }
    }

    return t(
      'workLog:text.workedAndRequiredHours',
      {
        requiredHours: toHourMinuteFormatFromInt(requiredHours),
        workedHours: `${workedTime.hours() + (workedTime.days() * 24)}:${(workedTime.minutes()) < 10 ? '0' : ''}${workedTime.minutes()}`,
      },
    );
  }

  renderWorkLogForm() {
    return (
      <WorkLogForm
        closeHandler={this.closeWorkLogForm}
        config={this.props.config}
        date={this.state.showWorkLogFormDate}
        isPosting={this.props.isPosting}
        saveHandler={this.saveWorkLogForm}
        user={this.props.workMonth.get('user')}
        workLogsOfDay={
          this.props.workMonth
            ? getWorkLogsByDay(this.state.showWorkLogFormDate, this.props.workMonth.get('workLogs'))
            : []
        }
        showInfoText={STATUS_WAITING_FOR_APPROVAL === this.props.workMonth.get('status')}
      />
    );
  }

  renderSupervisorWorkLogForm() {
    const { isPosting } = this.props;
    const { showSupervisorWorkLogFormDate } = this.state;

    return (
      <AddSupervisorWorkLogModal
        date={showSupervisorWorkLogFormDate}
        isPosting={isPosting}
        onClose={this.closeSupervisorWorkLogForm}
        onSave={this.saveSupervisorWorkLogForm}
      />
    );
  }

  renderDeleteWorkLogModal() {
    const {
      businessTripWorkLog,
      homeOfficeWorkLog,
      isPosting,
      maternityProtectionWorkLog,
      overtimeWorkLog,
      parentalLeaveWorkLog,
      sickDayUnpaidWorkLog,
      sickDayWorkLog,
      supervisorView,
      timeOffWorkLog,
      uid,
      vacationWorkLog,
      workLog,
      workMonth,
    } = this.props;
    const {
      showDeleteWorkLogDialogId,
      showDeleteWorkLogDialogType,
    } = this.state;

    return (
      <WorkLogDetailModal
        businessTripWorkLog={businessTripWorkLog ? businessTripWorkLog.toJS() : null}
        homeOfficeWorkLog={homeOfficeWorkLog ? homeOfficeWorkLog.toJS() : null}
        isInSupervisorMode={supervisorView}
        isPosting={isPosting}
        maternityProtectionWorkLog={
          maternityProtectionWorkLog ? maternityProtectionWorkLog.toJS() : null
        }
        onClose={this.closeDeleteWorkLogDialog}
        onDelete={() => this.deleteWorkLog(
          showDeleteWorkLogDialogId,
          showDeleteWorkLogDialogType,
        )}
        overtimeWorkLog={overtimeWorkLog ? overtimeWorkLog.toJS() : null}
        parentalLeaveWorkLog={parentalLeaveWorkLog ? parentalLeaveWorkLog.toJS() : null}
        sickDayUnpaidWorkLog={sickDayUnpaidWorkLog ? sickDayUnpaidWorkLog.toJS() : null}
        sickDayWorkLog={sickDayWorkLog ? sickDayWorkLog.toJS() : null}
        timeOffWorkLog={timeOffWorkLog ? timeOffWorkLog.toJS() : null}
        type={showDeleteWorkLogDialogType}
        uid={uid}
        vacationWorkLog={vacationWorkLog ? vacationWorkLog.toJS() : null}
        workLog={workLog ? workLog.toJS() : null}
        workMonth={workMonth ? workMonth.toJS() : null}
      />
    );
  }

  render() {
    const { t } = this.props;
    const date = localizedMoment();
    let status = null;
    let userId = null;

    if (this.props.workMonth) {
      status = this.props.workMonth.get('status');
      userId = this.props.workMonth.get('user').get('id');
    }

    const daysOfSelectedMonth = this.getDaysOfSelectedMonth();

    return (
      <div>
        <nav className={styles.navigation}>
          <div className={styles.navigationPrevious}>
            <Button
              beforeLabel={<Icon icon="keyboard_arrow_left" />}
              clickHandler={this.selectPreviousMonth}
              disabled={
                !getWorkMonthByMonth(
                  this.props.selectedDate.clone().subtract(1, 'month'),
                  this.props.workMonthList.toJS(),
                )
              }
              label={t('workLog:action.previousMonth')}
            />
          </div>
          <div>
            <div className={styles.navigationWrap}>
              <h2 className={styles.navigationTitle}>
                {toMonthYearFormat(this.props.selectedDate)}
              </h2>
              <span className={styles.navigationSubtitle}>
                {this.renderWorkHoursInfo(daysOfSelectedMonth)}
              </span>
            </div>
            {
              this.props.supervisorView
              && status === STATUS_WAITING_FOR_APPROVAL
              && (
                <div className="mt-2">
                  <Button
                    clickHandler={() => {
                      if (this.props.workMonth) {
                        this.props.markApproved(this.props.workMonth.get('id'));
                      }
                    }}
                    label={t('workLog:action.approveMonth')}
                    variant="success"
                  />
                </div>
              )
            }
            {
              !this.props.supervisorView
              && status === STATUS_WAITING_FOR_APPROVAL
              && <p>{t('workMonth:constant.status.waitingForApproval')}</p>
            }
            {
              status === STATUS_APPROVED
              && <p>{t('workMonth:constant.status.approved')}</p>
            }
          </div>
          <div className={styles.navigationNext}>
            <Button
              afterLabel={<Icon icon="keyboard_arrow_right" />}
              clickHandler={this.selectNextMonth}
              disabled={
                !getWorkMonthByMonth(
                  this.props.selectedDate.clone().add(1, 'month'),
                  this.props.workMonthList.toJS(),
                )
              }
              label={t('workLog:action.nextMonth')}
            />
          </div>
        </nav>
        {(this.props.supervisorView && status === STATUS_OPENED) && (
          <p>
            {t('workLog:text.openedWorkMonth')}
          </p>
        )}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              {daysOfSelectedMonth.map((day) => {
                let rowClassName = (
                  isWeekend(day.date)
                || includesSameDate(day.date, this.props.config.get('supportedHolidays'))
                ) ? styles.tableRowWeekend
                  : styles.tableRow;

                const canAddWorkLog = !this.props.supervisorView
                  && (status === STATUS_OPENED || status === STATUS_WAITING_FOR_APPROVAL);
                const canAddSupervisorWorkLog = this.props.supervisorView
                  && (this.props.uid !== userId)
                  && (status === STATUS_OPENED || status === STATUS_WAITING_FOR_APPROVAL);

                if (canAddWorkLog || canAddSupervisorWorkLog) {
                  rowClassName = `${rowClassName} ${styles.tableRowAddWorkLog}`;
                }

                let onRowClick;
                if (canAddWorkLog) {
                  onRowClick = () => this.openWorkLogForm(day.date);
                } else if (canAddSupervisorWorkLog) {
                  onRowClick = () => this.openSupervisorWorkLogForm(day.date);
                }

                return (
                  <tr
                    className={rowClassName}
                    key={day.date.date()}
                    onClick={onRowClick}
                  >
                    <td className={styles.tableCell}>
                      <div className={styles.date}>
                        {toDayMonthYearFormat(day.date)}
                      </div>
                      <div className={styles.dayInWeek}>
                        {toDayFormat(day.date)}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {day.workLogList.map((workLog) => (
                        <WorkLogDetailButton
                          key={`${workLog.type}_${workLog.id}`}
                          onClick={this.openDeleteWorkLogDialog}
                          workLog={workLog}
                        />
                      ))}

                      {
                      day.date.isSame(date, 'day')
                      && canAddWorkLog
                      && (
                        <div>
                          {
                            this.state.workLogTimer
                              ? (
                                <Button
                                  beforeLabel={<Icon icon="stop" />}
                                  clickHandler={this.stopWorkLogTimer}
                                  label={`${t('workLog:action.endWork')} | ${this.state.workLogTimerInterval}`}
                                />
                              ) : (
                                <Button
                                  beforeLabel={<Icon icon="play_arrow" />}
                                  clickHandler={this.initAndStartWorkLogTimer}
                                  label={t('workLog:action.startWork')}
                                />
                              )
                          }
                        </div>
                      )
                    }
                    </td>
                    {
                      canAddWorkLog
                      && (
                        <td className={styles.tableCellRight}>
                          <div className={styles.addWorkLogButtonWrapper}>
                            <Button
                              clickHandler={() => this.openWorkLogForm(day.date)}
                              beforeLabel={<Icon icon="add" />}
                              label={t('workLog:action.addWorkLog')}
                              labelVisibility="none"
                            />
                          </div>
                        </td>
                      )
                    }
                    {
                      canAddSupervisorWorkLog
                      && (
                        <td className={styles.tableCellRight}>
                          <div className={styles.addWorkLogButtonWrapper}>
                            <Button
                              clickHandler={() => this.openSupervisorWorkLogForm(day.date)}
                              beforeLabel={<Icon icon="add" />}
                              label={t('workLog:action.addWorkLog')}
                              labelVisibility="none"
                            />
                          </div>
                        </td>
                      )
                    }
                    <td className={styles.tableCellRight}>
                      {day.workTime.workTime.hours()}
                      :
                      {day.workTime.workTime.minutes() < 10 && '0'}
                      {day.workTime.workTime.minutes()}
                    &nbsp;h
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {
          !this.props.supervisorView
          && status === STATUS_OPENED
          && (
            <div className={styles.sendForApprovalButtonWrapper}>
              <Button
                beforeLabel={<Icon icon="send" />}
                clickHandler={() => {
                  if (this.props.workMonth) {
                    this.props.markWaitingForApproval(this.props.workMonth.get('id'));
                  }
                }}
                disabled={!this.props.workMonth || !!this.countWaitingForApprovalWorkLogs()}
                label={t('workLog:action.sendWorkMonthForApproval')}
                loadingIcon={this.props.isPosting ? <Icon icon="sync" /> : null}
              />
            </div>
          )
        }
        {this.state.showDeleteWorkLogDialog ? this.renderDeleteWorkLogModal() : null}
        {this.state.showWorkLogForm ? this.renderWorkLogForm() : null}
        {this.state.showSupervisorWorkLogForm ? this.renderSupervisorWorkLogForm() : null}
      </div>
    );
  }
}

WorkLogCalendar.defaultProps = {
  businessTripWorkLog: null,
  config: {},
  homeOfficeWorkLog: null,
  maternityProtectionWorkLog: null,
  overtimeWorkLog: null,
  parentalLeaveWorkLog: null,
  sickDayUnpaidWorkLog: null,
  sickDayWorkLog: null,
  supervisorView: false,
  timeOffWorkLog: null,
  uid: null,
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogCalendar.propTypes = {
  addBusinessTripWorkLog: PropTypes.func.isRequired,
  addHomeOfficeWorkLog: PropTypes.func.isRequired,
  addMultipleMaternityProtectionWorkLogs: PropTypes.func.isRequired,
  addMultipleParentalLeaveWorkLogs: PropTypes.func.isRequired,
  addMultipleSickDayUnpaidWorkLogs: PropTypes.func.isRequired,
  addMultipleVacationWorkLog: PropTypes.func.isRequired,
  addOvertimeWorkLog: PropTypes.func.isRequired,
  addSickDayWorkLog: PropTypes.func.isRequired,
  addTimeOffWorkLog: PropTypes.func.isRequired,
  addWorkLog: PropTypes.func.isRequired,
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
  changeSelectedDate: PropTypes.func.isRequired,
  config: ImmutablePropTypes.mapContains({}),
  deleteBusinessTripWorkLog: PropTypes.func.isRequired,
  deleteHomeOfficeWorkLog: PropTypes.func.isRequired,
  deleteMaternityProtectionWorkLog: PropTypes.func.isRequired,
  deleteOvertimeWorkLog: PropTypes.func.isRequired,
  deleteParentalLeaveWorkLog: PropTypes.func.isRequired,
  deleteSickDayUnpaidWorkLog: PropTypes.func.isRequired,
  deleteSickDayWorkLog: PropTypes.func.isRequired,
  deleteTimeOffWorkLog: PropTypes.func.isRequired,
  deleteVacationWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
  fetchMaternityProtectionWorkLog: PropTypes.func.isRequired,
  fetchOvertimeWorkLog: PropTypes.func.isRequired,
  fetchParentalLeaveWorkLog: PropTypes.func.isRequired,
  fetchSickDayUnpaidWorkLog: PropTypes.func.isRequired,
  fetchSickDayWorkLog: PropTypes.func.isRequired,
  fetchTimeOffWorkLog: PropTypes.func.isRequired,
  fetchVacationWorkLog: PropTypes.func.isRequired,
  fetchWorkLog: PropTypes.func.isRequired,
  homeOfficeWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  isPosting: PropTypes.bool.isRequired,
  markApproved: PropTypes.func.isRequired,
  markWaitingForApproval: PropTypes.func.isRequired,
  maternityProtectionWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
  }),
  overtimeWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    reason: PropTypes.string,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  parentalLeaveWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
  }),
  selectedDate: PropTypes.shape({
    clone: PropTypes.func.isRequired,
    month: PropTypes.func,
    year: PropTypes.func,
  }).isRequired,
  sickDayUnpaidWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
  }),
  sickDayWorkLog: ImmutablePropTypes.mapContains({
    childDateOfBirth: PropTypes.object,
    childName: PropTypes.string,
    date: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
  }),
  supervisorView: PropTypes.bool,
  t: PropTypes.func.isRequired,
  timeOffWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  uid: PropTypes.number,
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
    businessTripWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    homeOfficeWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    id: PropTypes.number.isRequired,
    maternityProtectionWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
    month: PropTypes.shape.isRequired,
    overtimeWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    parentalLeaveWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
    sickDayUnpaidWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
    sickDayWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      variant: PropTypes.oneOf([
        VARIANT_SICK_CHILD,
        VARIANT_WITH_NOTE,
        VARIANT_WITHOUT_NOTE,
      ]).isRequired,
    })).isRequired,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_OPENED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
    timeOffWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    user: ImmutablePropTypes.mapContains({
      vacations: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
        remainingVacationDays: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired,
      })).isRequired,
    }).isRequired,
    vacationWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
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

export default withTranslation()(WorkLogCalendar);
