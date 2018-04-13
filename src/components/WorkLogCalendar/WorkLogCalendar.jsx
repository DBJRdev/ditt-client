import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-ui';
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
      showWorkLogForm: false,
      showWorkLogFormDate: localizedMoment(),
    };

    this.getDaysOfSelectedMonth = this.getDaysOfSelectedMonth.bind(this);
    this.selectPreviousMonth = this.selectPreviousMonth.bind(this);
    this.selectNextMonth = this.selectNextMonth.bind(this);
    this.openWorkLogForm = this.openWorkLogForm.bind(this);
    this.saveWorkLogForm = this.saveWorkLogForm.bind(this);
    this.closeWorkLogForm = this.closeWorkLogForm.bind(this);
    this.renderWorkLogForm = this.renderWorkLogForm.bind(this);

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
            {toMonthYearFormat(this.state.selectedDate)}
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
  isPostingWorkLog: PropTypes.bool.isRequired,
  onSelectedDateChanged: PropTypes.func,
  workLogList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default WorkLogCalendar;
