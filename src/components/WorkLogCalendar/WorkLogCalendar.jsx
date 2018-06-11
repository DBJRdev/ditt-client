import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Modal,
} from 'react-ui';
import WorkLogForm from '../WorkLogForm';
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
} from '../../services/workLogService';
import parameters from '../../../config/parameters';
import styles from './WorkLogCalendar.scss';

class WorkLogCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: localizedMoment(),
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
    const { selectedDate } = this.state;
    const { workLogList } = this.props;
    const lastDayOfMonth = selectedDate.clone().endOf('month');
    const renderingDay = selectedDate.clone().startOf('month');

    const days = [];

    while (renderingDay <= lastDayOfMonth) {
      const workLogListForRenderingDay = getWorkLogsByDay(renderingDay, workLogList.toJS());

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
    this.setState(prevState => ({
      selectedDate: prevState.selectedDate.clone().add(1, 'month'),
    }), () => this.props.onSelectedDateChanged(this.state.selectedDate));
  }

  selectPreviousMonth() {
    this.setState(prevState => ({
      selectedDate: prevState.selectedDate.clone().subtract(1, 'month'),
    }), () => this.props.onSelectedDateChanged(this.state.selectedDate));
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
    const { selectedDate } = this.state;
    const {
      workHoursList,
      workLogList,
    } = this.props;
    let requiredHours = 0;

    const workHours = workHoursList.find(item => (
      item.get('year') === selectedDate.year()
      && item.get('month') === selectedDate.month() + 1
    ));

    if (workHours) {
      requiredHours = workHours.get('requiredHours');
    }

    const workedTime = getWorkedTime(getWorkLogsByMonth(selectedDate, workLogList.toJS()));

    return `${workedTime.hours()}:${workedTime.minutes() < 10 ? '0' : ''}${workedTime.minutes()} h out of ${requiredHours} h`;
  }

  renderWorkLogForm() {
    return (
      <WorkLogForm
        closeHandler={this.closeWorkLogForm}
        date={this.state.showWorkLogFormDate}
        isPosting={this.props.isPostingWorkLog}
        saveHandler={this.saveWorkLogForm}
        workLogsOfDay={this.props.workLogList.filter(workLog => (
          this.state.showWorkLogFormDate.isSame(workLog.get('startTime'), 'day')
        ))}
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
            loading: this.props.isPostingWorkLog,
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
    return (
      <div>
        <nav className={styles.navigation}>
          <div className={styles.navigationPrevious}>
            <Button
              clickHandler={this.selectPreviousMonth}
              icon="keyboard_arrow_left"
              label="Previous"
              priority="primary"
            />
          </div>
          <div>
            <h2 className={styles.navigationTitle}>{toMonthYearFormat(this.state.selectedDate)}</h2>
            <span className={styles.navigationSubtitle}>{this.renderWorkHoursInfo()}</span>
          </div>
          <div className={styles.navigationNext}>
            <Button
              clickHandler={this.selectNextMonth}
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
                            icon="work"
                            label={`${toHourMinuteFormat(workLog.startTime)} - ${toHourMinuteFormat(workLog.endTime)}`}
                          />
                        </div>
                      ))}
                    </td>
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
                    <td className={styles.tableCellRight}>
                      {day.workTime.hours()}:{day.workTime.minutes() < 10 && '0'}{day.workTime.minutes()}&nbsp;h
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {this.state.showDeleteWorkLogDialog ? this.renderDeleteWorkLogModal() : null}
        {this.state.showWorkLogForm ? this.renderWorkLogForm() : null}
      </div>
    );
  }
}

WorkLogCalendar.defaultProps = {
  onSelectedDateChanged: () => {},
};

WorkLogCalendar.propTypes = {
  addWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  isPostingWorkLog: PropTypes.bool.isRequired,
  onSelectedDateChanged: PropTypes.func,
  workHoursList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
  workLogList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default WorkLogCalendar;
