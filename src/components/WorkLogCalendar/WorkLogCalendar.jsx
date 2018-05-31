import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Modal,
} from 'react-ui';
import WorkLogForm from '../WorkLogForm';
import {
  isWeekend,
  localizedMoment,
  toDayFormat,
  toDayMonthYearFormat,
  toHourMinuteFormat,
  toMonthYearFormat,
} from '../../services/dateTimeService';

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

    this.headerContainer = {
      textAlign: 'center',
    };

    this.previousMonthButtonStyle = {
      display: 'inline-block',
      float: 'left',
    };

    this.selectedDateStyle = {
      display: 'inline-block',
      margin: '0 auto',
    };

    this.nextMonthButtonStyle = {
      display: 'inline-block',
      float: 'right',
    };

    this.tableStyle = {
      borderCollapse: 'collapse',
      marginTop: '0.5em',
      width: '100%',
    };

    this.tableCellStyle = {
      borderBottom: '1px solid black',
      padding: '0.25em',
    };

    this.tableCellWeekendStyle = {
      borderBottom: '1px solid black',
      color: 'gray',
      padding: '0.25em',
    };

    this.tableCellDateStyle = {
      width: '7em',
    };

    this.dateStyle = {
      display: 'block',
    };

    this.dayStyle = {
      display: 'block',
      fontSize: '0.75em',
    };

    this.workLogButtonWrapperStyle = {
      float: 'left',
      paddingLeft: '0.5em',
    };

    this.addWorkLogButtonWrapperStyle = {
      float: 'right',
    };

    this.tableCellWorkTimeStyle = {
      textAlign: 'right',
      width: '5em',
    };
  }

  getDaysOfSelectedMonth() {
    const { selectedDate } = this.state;
    const { workLogList } = this.props;
    const lastDayOfMonth = selectedDate.clone().endOf('month');
    const renderingDay = selectedDate.clone().startOf('month');

    const days = [];

    while (renderingDay <= lastDayOfMonth) {
      const workLogListForRenderingDay = workLogList.filter(workLog => (
        renderingDay.isSame(workLog.get('startTime'), 'day')
      ));
      const workedSeconds = workLogListForRenderingDay.reduce((total, workLog) => (
        (workLog.get('endTime').diff(workLog.get('startTime')) / 1000) + total
      ), 0);

      days.push({
        date: renderingDay.clone(),
        workLogList: workLogListForRenderingDay.toJS(),
        workTime: moment.duration({ seconds: workedSeconds }),
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

    const workedSeconds = workLogList
      .filter(workLog => (
        selectedDate.isSame(workLog.get('startTime'), 'month')
      ))
      .reduce((total, workLog) => (
        (workLog.get('endTime').diff(workLog.get('startTime')) / 1000) + total
      ), 0);
    const workedTime = moment.duration({ seconds: workedSeconds });

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
        <div style={this.headerContainer}>
          <div style={this.previousMonthButtonStyle}>
            <Button
              clickHandler={this.selectPreviousMonth}
              icon="keyboard_arrow_left"
              label="Previous"
              priority="primary"
            />
          </div>
          <span style={this.selectedDateStyle}>
            {toMonthYearFormat(this.state.selectedDate)} ({this.renderWorkHoursInfo()})
          </span>
          <div style={this.nextMonthButtonStyle}>
            <Button
              clickHandler={this.selectNextMonth}
              icon="keyboard_arrow_right"
              iconPosition="after"
              label="Next"
              priority="primary"
            />
          </div>
        </div>
        <div>
          <table style={this.tableStyle}>
            <tbody>
              {this.getDaysOfSelectedMonth().map((day) => {
                const cellStyle = isWeekend(day.date)
                  ? this.tableCellWeekendStyle
                  : this.tableCellStyle;

                return (
                  <tr key={day.date.date()}>
                    <td style={Object.assign({}, cellStyle, this.tableCellDateStyle)}>
                      <span style={this.dateStyle}>
                        {toDayMonthYearFormat(day.date)}
                      </span>
                      <span style={this.dayStyle}>
                        {toDayFormat(day.date)}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      {day.workLogList.map(workLog => (
                        <div
                          key={workLog.id}
                          style={this.workLogButtonWrapperStyle}
                        >
                          <Button
                            clickHandler={() => this.openDeleteWorkLogDialog(workLog.id)}
                            icon="work"
                            label={`${toHourMinuteFormat(workLog.startTime)} - ${toHourMinuteFormat(workLog.endTime)}`}
                          />
                        </div>
                      ))}
                    </td>
                    <td style={cellStyle}>
                      <div style={this.addWorkLogButtonWrapperStyle}>
                        <Button
                          clickHandler={() => this.openWorkLogForm(day.date)}
                          icon="add"
                          label="Add work log"
                          priority="primary"
                        />
                      </div>
                    </td>
                    <td style={Object.assign({}, cellStyle, this.tableCellWorkTimeStyle)}>
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
