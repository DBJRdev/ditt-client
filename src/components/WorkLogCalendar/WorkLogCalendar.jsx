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
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
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
  getWorkedTime,
  getWorkLogsByDay,
  getWorkLogsByMonth,
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
      workMonth,
    } = this.props;
    const lastDayOfMonth = selectedDate.clone().endOf('month');
    const renderingDay = selectedDate.clone().startOf('month');

    const days = [];

    while (renderingDay <= lastDayOfMonth) {
      let workLogListForRenderingDay = Immutable.List();

      if (workMonth) {
        workLogListForRenderingDay = workLogListForRenderingDay.concat((
          getWorkLogsByDay(
            renderingDay,
            workMonth.get('workLogs')
          )
        ));
        workLogListForRenderingDay = workLogListForRenderingDay.concat((
          getWorkLogsByDay(
            renderingDay,
            workMonth.get('businessTripWorkLogs')
          )
        ));
        workLogListForRenderingDay = workLogListForRenderingDay.concat((
          getWorkLogsByDay(
            renderingDay,
            workMonth.get('homeOfficeWorkLogs')
          )
        ));
        workLogListForRenderingDay = workLogListForRenderingDay.concat((
          getWorkLogsByDay(
            renderingDay,
            workMonth.get('timeOffWorkLogs')
          )
        ));

        workLogListForRenderingDay = workLogListForRenderingDay.toJS();
      }

      days.push({
        date: renderingDay.clone(),
        workLogList: workLogListForRenderingDay,
        workTime: getWorkedTime(workLogListForRenderingDay),
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
    this.setState({
      showDeleteWorkLogDialog: true,
      showDeleteWorkLogDialogId: id,
      showDeleteWorkLogDialogType: type,
    });
  }

  deleteWorkLog(id, type) {
    console.log(type);

    return this.props.deleteWorkLog(id).then(this.closeDeleteWorkLogDialog);
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
    } else if (TIME_OFF_WORK_LOG === data.type) {
      return this.props.addTimeOffWorkLog({ date: data.date });
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

  renderWorkHoursInfo() {
    const {
      selectedDate,
      workHoursList,
      workMonth,
    } = this.props;
    let requiredHours = 0;

    const workHours = workHoursList.find(item => (
      item.get('year') === selectedDate.year()
      && item.get('month') === selectedDate.month() + 1
    ));

    if (workHours) {
      requiredHours = workHours.get('requiredHours');
    }

    const workedTime = getWorkedTime(getWorkLogsByMonth(
      selectedDate,
      workMonth ? workMonth.get('workLogs').toJS() : []
    ));

    return `${workedTime.hours()}:${workedTime.minutes() < 10 ? '0' : ''}${workedTime.minutes()} h out of ${requiredHours} h`;
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
    return (
      <Modal
        actions={[
          {
            clickHandler: () => this.deleteWorkLog(
              this.state.showDeleteWorkLogDialogId,
              this.state.showDeleteWorkLogDialogType
            ),
            label: 'Delete',
            loading: this.props.isPosting,
          },
        ]}
        closeHandler={this.closeDeleteWorkLogDialog}
        title="Delete work log"
      >
        Are you sure that you want to delete this work log?
      </Modal>
    );
  }

  render() {
    let status = null;

    if (this.props.workMonth) {
      status = this.props.workMonth.get('status');
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
                {this.renderWorkHoursInfo()}
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
              {this.getDaysOfSelectedMonth().map((day) => {
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
                          } else if (TIME_OFF_WORK_LOG === workLogData.type) {
                            label = 'Time off';
                          } else {
                            throw new Error(`Unknown type ${workLog.type}`);
                          }

                          if (STATUS_WAITING_FOR_APPROVAL === workLogData.status) {
                            label += ' (Waiting)';
                          } else if (STATUS_WAITING_FOR_APPROVAL === workLogData.status) {
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
                                disabled={this.props.supervisorView || status === STATUS_APPROVED}
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
                                disabled={this.props.supervisorView || status === STATUS_APPROVED}
                                icon="home"
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
                                disabled={this.props.supervisorView || status === STATUS_APPROVED}
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
                              disabled={this.props.supervisorView || status === STATUS_APPROVED}
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
  supervisorView: false,
  workMonth: null,
};

WorkLogCalendar.propTypes = {
  addBusinessTripWorkLog: PropTypes.func.isRequired,
  addHomeOfficeWorkLog: PropTypes.func.isRequired,
  addTimeOffWorkLog: PropTypes.func.isRequired,
  addWorkLog: PropTypes.func.isRequired,
  changeSelectedDate: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  isPosting: PropTypes.bool.isRequired,
  markApproved: PropTypes.func.isRequired,
  markWaitingForApproval: PropTypes.func.isRequired,
  selectedDate: PropTypes.shape({
    clone: PropTypes.func.isRequired,
  }).isRequired,
  supervisorView: PropTypes.bool,
  workHoursList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
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
