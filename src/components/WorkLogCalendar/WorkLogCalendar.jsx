import moment from 'moment';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
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
  includesSameDate,
  isWeekend,
  localizedMoment,
  toDayFormat,
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
import parameters from '../../../config/parameters';
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
        workTime: getWorkedTime(workLogListForRenderingDay, workHoursList),
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
      return this.props.addBusinessTripWorkLog({ date: data.date });
    } else if (HOME_OFFICE_WORK_LOG === data.type) {
      return this.props.addHomeOfficeWorkLog({ date: data.date });
    } else if (SICK_DAY_WORK_LOG === data.type) {
      return this.props.addSickDayWorkLog({
        childDateOfBirth: data.childDateOfBirth,
        childName: data.childName,
        date: data.date,
        variant: data.variant,
      });
    } else if (TIME_OFF_WORK_LOG === data.type) {
      return this.props.addTimeOffWorkLog({ date: data.date });
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

  renderWorkHoursInfo(daysOfSelectedMonth) {
    const {
      selectedDate,
      workHoursList,
    } = this.props;
    let requiredHours = 0;
    const workedTime = moment.duration();

    const workHours = workHoursList.find(item => (
      item.get('year') === selectedDate.year()
      && item.get('month') === selectedDate.month() + 1
    ));

    if (workHours) {
      requiredHours = workHours.get('requiredHours');
    }

    daysOfSelectedMonth.forEach((day) => {
      workedTime.add(day.workTime);
    });

    return `${workedTime.hours() + (workedTime.days() * 24)}:${workedTime.minutes() < 10 ? '0' : ''}${workedTime.minutes()} h out of ${requiredHours} h`;
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
      />
    );
  }

  renderDeleteWorkLogModal() {
    const type = this.state.showDeleteWorkLogDialogType;
    let content = 'Loading…';

    if (BUSINESS_TRIP_WORK_LOG === type && this.props.businessTripWorkLog) {
      content = (
        <p>
          Type: {getTypeLabel(type)}<br />
          Date: {toDayMonthYearFormat(this.props.businessTripWorkLog.get('date'))}<br />
          Status: {getStatusLabel(this.props.businessTripWorkLog.get('status'))}
        </p>
      );
    } else if (HOME_OFFICE_WORK_LOG === type && this.props.homeOfficeWorkLog) {
      content = (
        <p>
          Type: {getTypeLabel(type)}<br />
          Date: {toDayMonthYearFormat(this.props.homeOfficeWorkLog.get('date'))}<br />
          Status: {getStatusLabel(this.props.homeOfficeWorkLog.get('status'))}
        </p>
      );
    } else if (SICK_DAY_WORK_LOG === type && this.props.sickDayWorkLog) {
      content = (
        <p>
          Type: {getTypeLabel(type)}<br />
          Date: {toDayMonthYearFormat(this.props.sickDayWorkLog.get('date'))}<br />
          Variant: {getSickDayVariantLabel(this.props.sickDayWorkLog.get('variant'))}<br />
          {VARIANT_SICK_CHILD === this.props.sickDayWorkLog.get('variant') && (
            <React.Fragment>
              {`Child's name: ${this.props.sickDayWorkLog.get('childName')}`}<br />
              {`Child's date of birth: ${this.props.sickDayWorkLog.get('childDateOfBirth')}`}<br />
            </React.Fragment>
          )}
        </p>
      );
    } else if (TIME_OFF_WORK_LOG === type && this.props.timeOffWorkLog) {
      content = (
        <p>
          Type: {getTypeLabel(type)}<br />
          Date: {toDayMonthYearFormat(this.props.timeOffWorkLog.get('date'))}<br />
          Status: {getStatusLabel(this.props.timeOffWorkLog.get('status'))}
        </p>
      );
    } else if (VACATION_WORK_LOG === type && this.props.vacationWorkLog) {
      content = (
        <p>
          Type: {getTypeLabel(type)}<br />
          Date: {toDayMonthYearFormat(this.props.vacationWorkLog.get('date'))}<br />
          Status: {getStatusLabel(this.props.vacationWorkLog.get('status'))}
        </p>
      );
    } else if (WORK_LOG === type && this.props.workLog) {
      content = (
        <p>
          Type: {getTypeLabel(type)}<br />
          Date: {toDayMonthYearFormat(this.props.workLog.get('startTime'))}<br />
          Start time: {toHourMinuteFormat(this.props.workLog.get('startTime'))}<br />
          End time: {toHourMinuteFormat(this.props.workLog.get('endTime'))}
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
        label: 'Delete',
        loading: this.props.isPosting,
        variant: 'danger',
      });
    }

    return (
      <Modal
        actions={actions}
        closeHandler={this.closeDeleteWorkLogDialog}
        title="Work log"
      >
        {content}
      </Modal>
    );
  }

  render() {
    let status = null;

    if (this.props.workMonth) {
      status = this.props.workMonth.get('status');
    }

    const daysOfSelectedMonth = this.getDaysOfSelectedMonth();

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
              label="Previous"
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
                  label="Approve"
                  priority="primary"
                  variant="success"
                />
              )
            }
            {
              !this.props.supervisorView
              && status === STATUS_WAITING_FOR_APPROVAL
              && <p>Waiting for approval</p>
            }
            {
              status === STATUS_APPROVED
              && <p>Approved</p>
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
              label="Next"
              priority="primary"
            />
          </div>
        </nav>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              {daysOfSelectedMonth.map((day) => {
                const rowClassName = (isWeekend(day.date) || includesSameDate(day.date, parameters.get('supportedHolidays')))
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
                          let label = '';

                          if (BUSINESS_TRIP_WORK_LOG === workLogData.type) {
                            label = 'Business trip';
                          } else if (HOME_OFFICE_WORK_LOG === workLogData.type) {
                            label = 'Home office';
                          } else if (SICK_DAY_WORK_LOG === workLogData.type) {
                            label = 'Sick day';

                            if (VARIANT_WITH_NOTE === workLogData.variant) {
                              label += ' – With note';
                            } else if (VARIANT_WITHOUT_NOTE === workLogData.variant) {
                              label += ' – Without note';
                            } else if (VARIANT_SICK_CHILD === workLogData.variant) {
                              label += ' – Sick child';
                            }
                          } else if (TIME_OFF_WORK_LOG === workLogData.type) {
                            label = 'Time off';
                          } else if (VACATION_WORK_LOG === workLogData.type) {
                            label = 'Vacation';
                          } else {
                            throw new Error(`Unknown type ${workLog.type}`);
                          }

                          if (STATUS_WAITING_FOR_APPROVAL === workLogData.status) {
                            label += ' (Waiting)';
                          } else if (STATUS_REJECTED === workLogData.status) {
                            label += ' (Rejected)';
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
                              label="Add work log"
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
                disabled={!this.props.workMonth}
                icon="send"
                label="Send for approval"
                loading={this.props.isPosting}
                priority="primary"
              />
            </div>
          )
        }
        {this.state.showDeleteWorkLogDialog ? this.renderDeleteWorkLogModal() : null}
        {this.state.showWorkLogForm ? this.renderWorkLogForm() : null}
      </div>
    );
  }
}

WorkLogCalendar.defaultProps = {
  businessTripWorkLog: null,
  homeOfficeWorkLog: null,
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
  addSickDayWorkLog: PropTypes.func.isRequired,
  addTimeOffWorkLog: PropTypes.func.isRequired,
  addVacationWorkLog: PropTypes.func.isRequired,
  addWorkLog: PropTypes.func.isRequired,
  businessTripWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  changeSelectedDate: PropTypes.func.isRequired,
  deleteBusinessTripWorkLog: PropTypes.func.isRequired,
  deleteHomeOfficeWorkLog: PropTypes.func.isRequired,
  deleteSickDayWorkLog: PropTypes.func.isRequired,
  deleteTimeOffWorkLog: PropTypes.func.isRequired,
  deleteVacationWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
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

export default WorkLogCalendar;
