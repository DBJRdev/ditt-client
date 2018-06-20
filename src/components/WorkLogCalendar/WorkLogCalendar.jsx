import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Modal,
} from 'react-ui';
import WorkLogForm from '../WorkLogForm';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
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
      let workLogListForRenderingDay = [];

      if (workMonth) {
        workLogListForRenderingDay = getWorkLogsByDay(renderingDay, workMonth.get('workLogs')).toJS();
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

  openDeleteWorkLogDialog(id) {
    this.setState({
      showDeleteWorkLogDialog: true,
      showDeleteWorkLogDialogId: id,
    });
  }

  deleteWorkLog(id) {
    return this.props.deleteWorkLog(id).then(this.closeDeleteWorkLogDialog);
  }

  closeDeleteWorkLogDialog() {
    this.setState({
      showDeleteWorkLogDialog: false,
      showDeleteWorkLogDialogId: null,
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
    return this.props.addWorkLog(data);
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
            clickHandler: () => this.deleteWorkLog(this.state.showDeleteWorkLogDialogId),
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
                      {day.workLogList.map(workLog => (
                        <div
                          key={workLog.id}
                          className={styles.workLogButtonWrapper}
                        >
                          <Button
                            clickHandler={() => this.openDeleteWorkLogDialog(workLog.id)}
                            disabled={this.props.supervisorView || status === STATUS_APPROVED}
                            icon="work"
                            label={`${toHourMinuteFormat(workLog.startTime)} - ${toHourMinuteFormat(workLog.endTime)}`}
                          />
                        </div>
                      ))}
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

export default WorkLogCalendar;
