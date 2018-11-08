import moment from 'moment';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Modal,
} from 'react-ui';
import WorkLogForm from '../WorkLogForm';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../../resources/sickDayWorkLog';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
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
  toDayDayMonthYearFormat,
  toDayMonthYearFormat,
  toHourMinuteFormat,
  toMonthYearFormat,
} from '../../services/dateTimeService';
import {
  getSickDayVariantLabel,
  getStatusLabel,
  getTypeLabel,
  getWorkedTime,
  getWorkLogsByDay,
  getWorkMonthByMonth,
} from '../../services/workLogService';
import styles from './WorkLogCalendar.scss';

class WorkLogCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteWorkLogDialog: false,
      showDeleteWorkLogDialogId: null,
      showDeleteWorkLogDialogType: null,
      showWorkLogForm: false,
      showWorkLogFormDate: localizedMoment(),
    };

    this.selectPreviousMonth = this.selectPreviousMonth.bind(this);
    this.selectNextMonth = this.selectNextMonth.bind(this);
    this.saveWorkLogForm = this.saveWorkLogForm.bind(this);
    this.closeWorkLogForm = this.closeWorkLogForm.bind(this);
    this.closeDeleteWorkLogDialog = this.closeDeleteWorkLogDialog.bind(this);
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
          'overtimeWorkLogs',
          'sickDayWorkLogs',
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
          workHoursList,
          this.props.config.get('workedHoursLimits').toJS()
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

  openDeleteWorkLogDialog(id, type) {
    if (BUSINESS_TRIP_WORK_LOG === type) {
      this.props.fetchBusinessTripWorkLog(id);
    } else if (HOME_OFFICE_WORK_LOG === type) {
      this.props.fetchHomeOfficeWorkLog(id);
    } else if (OVERTIME_WORK_LOG === type) {
      this.props.fetchOvertimeWorkLog(id);
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
    } else if (HOME_OFFICE_WORK_LOG === type) {
      return this.props.deleteHomeOfficeWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } else if (OVERTIME_WORK_LOG === type) {
      return this.props.deleteOvertimeWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } else if (SICK_DAY_WORK_LOG === type) {
      return this.props.deleteSickDayWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } else if (TIME_OFF_WORK_LOG === type) {
      return this.props.deleteTimeOffWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } else if (VACATION_WORK_LOG === type) {
      return this.props.deleteVacationWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } else if (WORK_LOG === type) {
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
    } else if (HOME_OFFICE_WORK_LOG === data.type) {
      return this.props.addHomeOfficeWorkLog({
        comment: data.comment,
        date: data.date,
      });
    } else if (OVERTIME_WORK_LOG === data.type) {
      return this.props.addOvertimeWorkLog({
        date: data.date,
        reason: data.reason,
      });
    } else if (SICK_DAY_WORK_LOG === data.type) {
      return this.props.addSickDayWorkLog({
        childDateOfBirth: data.childDateOfBirth,
        childName: data.childName,
        date: data.date,
        variant: data.variant,
      });
    } else if (TIME_OFF_WORK_LOG === data.type) {
      return this.props.addTimeOffWorkLog({
        comment: data.comment,
        date: data.date,
      });
    } else if (VACATION_WORK_LOG === data.type) {
      return this.props.addVacationWorkLog({ date: data.date });
    } else if (WORK_LOG === data.type) {
      return this.props.addWorkLog({
        endTime: data.endTime,
        startTime: data.startTime,
      });
    }

    throw new Error(`Unknown type ${data.type}`);
  }

  closeWorkLogForm() {
    this.setState({ showWorkLogForm: false });
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

  renderWorkHoursInfo(daysOfSelectedMonth) {
    const {
      selectedDate,
      t,
      workHoursList,
    } = this.props;
    let requiredHours = 0;
    const workedTime = moment.duration();

    const workHours = workHoursList.find(item => (
      item.get('year') === selectedDate.year()
      && item.get('month') === selectedDate.month() + 1
    ));

    if (workHours) {
      const workingDays = getNumberOfWorkingDays(
        selectedDate.clone().startOf('month'),
        selectedDate.clone().endOf('month'),
        this.props.config.get('supportedHolidays')
      );
      requiredHours = workHours.get('requiredHours') * workingDays;
    }

    daysOfSelectedMonth.forEach((day) => {
      workedTime.add(day.workTime);
    });

    return t(
      'workLog:text.workedAndRequiredHours',
      {
        requiredHours,
        workedHours: `${workedTime.hours() + (workedTime.days() * 24)}:${workedTime.minutes() < 10 ? '0' : ''}${workedTime.minutes()}`,
      }
    );
  }

  renderWorkLogForm() {
    return (
      <WorkLogForm
        closeHandler={this.closeWorkLogForm}
        date={this.state.showWorkLogFormDate}
        isPosting={this.props.isPosting}
        saveHandler={this.saveWorkLogForm}
        workLogsOfDay={
          this.props.workMonth
            ? getWorkLogsByDay(this.state.showWorkLogFormDate, this.props.workMonth.get('workLogs'))
            : []
        }
        showInfoText={STATUS_WAITING_FOR_APPROVAL === this.props.workMonth.get('status')}
      />
    );
  }

  renderDeleteWorkLogModal() {
    const { t } = this.props;

    const type = this.state.showDeleteWorkLogDialogType;
    let content = t('general:text.loading');

    if (BUSINESS_TRIP_WORK_LOG === type && this.props.businessTripWorkLog) {
      content = (
        <p>
          {t('workLog:element.type')}: {getTypeLabel(t, type)}<br />
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.businessTripWorkLog.get('date'))}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.businessTripWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.businessTripWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.businessTripWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
          {t('businessTripWorkLog:element.purpose')}: {this.props.businessTripWorkLog.get('purpose')}<br />
          {t('businessTripWorkLog:element.destination')}: {this.props.businessTripWorkLog.get('destination')}<br />
          {t('businessTripWorkLog:element.transport')}: {this.props.businessTripWorkLog.get('transport')}<br />
          {t('businessTripWorkLog:element.expectedDeparture')}: {this.props.businessTripWorkLog.get('expectedDeparture')}<br />
          {t('businessTripWorkLog:element.expectedArrival')}: {this.props.businessTripWorkLog.get('expectedArrival')}
        </p>
      );
    } else if (HOME_OFFICE_WORK_LOG === type && this.props.homeOfficeWorkLog) {
      content = (
        <p>
          {t('workLog:element.type')}: {getTypeLabel(t, type)}<br />
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.homeOfficeWorkLog.get('date'))}<br />
          {t('homeOfficeWorkLog:element.comment')}: {this.props.homeOfficeWorkLog.get('comment')}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.homeOfficeWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.homeOfficeWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.homeOfficeWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
        </p>
      );
    } else if (OVERTIME_WORK_LOG === type && this.props.overtimeWorkLog) {
      content = (
        <p>
          {t('workLog:element.type')}: {getTypeLabel(t, type)}<br />
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.overtimeWorkLog.get('date'))}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.overtimeWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.overtimeWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.overtimeWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
          {t('overtimeWorkLog:element.reason')}: {this.props.overtimeWorkLog.get('reason')}<br />
        </p>
      );
    } else if (SICK_DAY_WORK_LOG === type && this.props.sickDayWorkLog) {
      content = (
        <p>
          {t('workLog:element.type')}: {getTypeLabel(t, type)}<br />
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.sickDayWorkLog.get('date'))}<br />
          {t('sickDayWorkLog:element.variant')}: {getSickDayVariantLabel(t, this.props.sickDayWorkLog.get('variant'))}<br />
          {VARIANT_SICK_CHILD === this.props.sickDayWorkLog.get('variant') && (
            <React.Fragment>
              {`${t('sickDayWorkLog:element.childName')}: ${this.props.sickDayWorkLog.get('childName')}`}<br />
              {`${t('sickDayWorkLog:element.childDateOfBirth')}: ${toDayMonthYearFormat(this.props.sickDayWorkLog.get('childDateOfBirth'))}`}<br />
            </React.Fragment>
          )}
        </p>
      );
    } else if (TIME_OFF_WORK_LOG === type && this.props.timeOffWorkLog) {
      content = (
        <p>
          {t('workLog:element.type')}: {getTypeLabel(t, type)}<br />
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.timeOffWorkLog.get('date'))}<br />
          {t('timeOffWorkLog:element.comment')}: {this.props.timeOffWorkLog.get('comment')}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.timeOffWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.timeOffWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.timeOffWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
        </p>
      );
    } else if (VACATION_WORK_LOG === type && this.props.vacationWorkLog) {
      content = (
        <p>
          {t('workLog:element.type')}: {getTypeLabel(t, type)}<br />
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.vacationWorkLog.get('date'))}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.vacationWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.vacationWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.vacationWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
        </p>
      );
    } else if (WORK_LOG === type && this.props.workLog) {
      content = (
        <p>
          {t('workLog:element.type')}: {getTypeLabel(t, type)}<br />
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.workLog.get('startTime'))}<br />
          {t('workLog:element.startTime')}: {toHourMinuteFormat(this.props.workLog.get('startTime'))}<br />
          {t('workLog:element.endTime')}: {toHourMinuteFormat(this.props.workLog.get('endTime'))}
        </p>
      );
    }

    const actions = [];
    let status = null;

    if (this.props.workMonth) {
      status = this.props.workMonth.get('status');
    }

    if (!this.props.supervisorView && status !== STATUS_APPROVED) {
      actions.push({
        clickHandler: () => this.deleteWorkLog(
          this.state.showDeleteWorkLogDialogId,
          this.state.showDeleteWorkLogDialogType
        ),
        label: t('general:action.delete'),
        loading: this.props.isPosting,
        variant: 'danger',
      });
    }

    return (
      <Modal
        actions={actions}
        closeHandler={this.closeDeleteWorkLogDialog}
        title={t('workLog:modal.detail.title')}
        translations={{ close: t('general:action.close') }}
      >
        {content}
      </Modal>
    );
  }

  render() {
    const { t } = this.props;
    let status = null;
    let workLogContent = null;

    if (this.props.workMonth) {
      status = this.props.workMonth.get('status');
    }

    const daysOfSelectedMonth = this.getDaysOfSelectedMonth();

    if (this.props.supervisorView && status === STATUS_OPENED) {
      workLogContent = t('workLog:text.openedWorkMonth');
    } else {
      workLogContent = (
        <React.Fragment>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                {daysOfSelectedMonth.map((day) => {
                  const rowClassName = (isWeekend(day.date) || includesSameDate(day.date, this.props.config.get('supportedHolidays')))
                    ? styles.tableRowWeekend
                    : styles.tableRow;

                  return (
                    <tr key={day.date.date()} className={rowClassName}>
                      <td className={styles.tableCell}>
                        <div className={styles.date}>
                          {toDayMonthYearFormat(day.date)}
                        </div>
                        <div className={styles.dayInWeek}>
                          {toDayFormat(day.date)}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        {day.workLogList.map((workLog) => {
                          const resolveLabel = (workLogData) => {
                            let label = getTypeLabel(t, workLogData.type);

                            if (STATUS_WAITING_FOR_APPROVAL === workLogData.status) {
                              label += ` (${t('workMonth:constant.status.waiting')})`;
                            } else if (STATUS_REJECTED === workLogData.status) {
                              label += ` (${t('workMonth:constant.status.rejected')})`;
                            }

                            return label;
                          };

                          if (workLog.type === BUSINESS_TRIP_WORK_LOG) {
                            return (
                              <div
                                key={`BT-${workLog.id}`}
                                className={styles.workLogButtonWrapper}
                              >
                                <Button
                                  clickHandler={
                                    () => this.openDeleteWorkLogDialog(
                                      workLog.id,
                                      BUSINESS_TRIP_WORK_LOG
                                    )
                                  }
                                  icon="directions_car"
                                  label={resolveLabel(workLog)}
                                />
                              </div>
                            );
                          }

                          if (workLog.type === HOME_OFFICE_WORK_LOG) {
                            return (
                              <div
                                key={`HO-${workLog.id}`}
                                className={styles.workLogButtonWrapper}
                              >
                                <Button
                                  clickHandler={
                                    () => this.openDeleteWorkLogDialog(
                                      workLog.id,
                                      HOME_OFFICE_WORK_LOG
                                    )
                                  }
                                  icon="home"
                                  label={resolveLabel(workLog)}
                                />
                              </div>
                            );
                          }

                          if (workLog.type === OVERTIME_WORK_LOG) {
                            return (
                              <div
                                key={`OT-${workLog.id}`}
                                className={styles.workLogButtonWrapper}
                              >
                                <Button
                                  clickHandler={
                                    () => this.openDeleteWorkLogDialog(
                                      workLog.id,
                                      OVERTIME_WORK_LOG
                                    )
                                  }
                                  icon="access_time"
                                  label={resolveLabel(workLog)}
                                />
                              </div>
                            );
                          }

                          if (workLog.type === SICK_DAY_WORK_LOG) {
                            return (
                              <div
                                key={`SD-${workLog.id}`}
                                className={styles.workLogButtonWrapper}
                              >
                                <Button
                                  clickHandler={
                                    () => this.openDeleteWorkLogDialog(
                                      workLog.id,
                                      SICK_DAY_WORK_LOG
                                    )
                                  }
                                  icon="pregnant_woman"
                                  label={resolveLabel(workLog)}
                                />
                              </div>
                            );
                          }

                          if (workLog.type === TIME_OFF_WORK_LOG) {
                            return (
                              <div
                                key={`TO-${workLog.id}`}
                                className={styles.workLogButtonWrapper}
                              >
                                <Button
                                  clickHandler={
                                    () => this.openDeleteWorkLogDialog(
                                      workLog.id,
                                      TIME_OFF_WORK_LOG
                                    )
                                  }
                                  icon="flag"
                                  label={resolveLabel(workLog)}
                                />
                              </div>
                            );
                          }

                          if (workLog.type === VACATION_WORK_LOG) {
                            return (
                              <div
                                key={`V-${workLog.id}`}
                                className={styles.workLogButtonWrapper}
                              >
                                <Button
                                  clickHandler={
                                    () => this.openDeleteWorkLogDialog(
                                      workLog.id,
                                      VACATION_WORK_LOG
                                    )
                                  }
                                  icon="flag"
                                  label={resolveLabel(workLog)}
                                />
                              </div>
                            );
                          }

                          return (
                            <div
                              key={`WL-${workLog.id}`}
                              className={styles.workLogButtonWrapper}
                            >
                              <Button
                                clickHandler={
                                  () => this.openDeleteWorkLogDialog(
                                    workLog.id,
                                    WORK_LOG
                                  )
                                }
                                icon="work"
                                label={`${toHourMinuteFormat(workLog.startTime)} - ${toHourMinuteFormat(workLog.endTime)}`}
                              />
                            </div>
                          );
                        })}
                      </td>
                      {
                        !this.props.supervisorView
                        && (status === STATUS_OPENED || status === STATUS_WAITING_FOR_APPROVAL)
                        && (
                          <td className={styles.tableCellRight}>
                            <div className={styles.addWorkLogButtonWrapper}>
                              <Button
                                clickHandler={() => this.openWorkLogForm(day.date)}
                                icon="add"
                                label={t('workLog:action.addWorkLog')}
                                isLabelVisible={false}
                                priority="default"
                              />
                            </div>
                          </td>
                        )
                      }
                      <td className={styles.tableCellRight}>
                        {day.workTime.hours()}:{day.workTime.minutes() < 10 && '0'}{day.workTime.minutes()}&nbsp;h
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
                  clickHandler={() => {
                    if (this.props.workMonth) {
                      this.props.markWaitingForApproval(this.props.workMonth.get('id'));
                    }
                  }}
                  disabled={!this.props.workMonth || !!this.countWaitingForApprovalWorkLogs()}
                  icon="send"
                  label={t('workLog:action.sendWorkMonthForApproval')}
                  loading={this.props.isPosting}
                  priority="primary"
                />
              </div>
            )
          }
          {this.state.showDeleteWorkLogDialog ? this.renderDeleteWorkLogModal() : null}
          {this.state.showWorkLogForm ? this.renderWorkLogForm() : null}
        </React.Fragment>
      );
    }

    return (
      <div>
        <nav className={styles.navigation}>
          <div className={styles.navigationPrevious}>
            <Button
              clickHandler={this.selectPreviousMonth}
              disabled={
                !getWorkMonthByMonth(
                  this.props.selectedDate.clone().subtract(1, 'month'),
                  this.props.workMonthList.toJS()
                )
              }
              icon="keyboard_arrow_left"
              label={t('workLog:action.previousMonth')}
              priority="primary"
            />
          </div>
          <div>
            <div>
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
                <Button
                  clickHandler={() => {
                    if (this.props.workMonth) {
                      this.props.markApproved(this.props.workMonth.get('id'));
                    }
                  }}
                  label={t('workLog:action.approveMonth')}
                  priority="primary"
                  variant="success"
                />
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
              clickHandler={this.selectNextMonth}
              disabled={
                !getWorkMonthByMonth(
                  this.props.selectedDate.clone().add(1, 'month'),
                  this.props.workMonthList.toJS()
                )
              }
              icon="keyboard_arrow_right"
              iconPosition="after"
              label={t('workLog:action.nextMonth')}
              priority="primary"
            />
          </div>
        </nav>
        {workLogContent}
      </div>
    );
  }
}

WorkLogCalendar.defaultProps = {
  businessTripWorkLog: null,
  config: {},
  homeOfficeWorkLog: null,
  overtimeWorkLog: null,
  sickDayWorkLog: null,
  supervisorView: false,
  timeOffWorkLog: null,
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogCalendar.propTypes = {
  addBusinessTripWorkLog: PropTypes.func.isRequired,
  addHomeOfficeWorkLog: PropTypes.func.isRequired,
  addOvertimeWorkLog: PropTypes.func.isRequired,
  addSickDayWorkLog: PropTypes.func.isRequired,
  addTimeOffWorkLog: PropTypes.func.isRequired,
  addVacationWorkLog: PropTypes.func.isRequired,
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
  deleteOvertimeWorkLog: PropTypes.func.isRequired,
  deleteSickDayWorkLog: PropTypes.func.isRequired,
  deleteTimeOffWorkLog: PropTypes.func.isRequired,
  deleteVacationWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
  fetchOvertimeWorkLog: PropTypes.func.isRequired,
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
  overtimeWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    reason: PropTypes.string,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  selectedDate: PropTypes.shape({
    clone: PropTypes.func.isRequired,
  }).isRequired,
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

export default withNamespaces()(WorkLogCalendar);
