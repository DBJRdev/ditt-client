import PropTypes from 'prop-types';
import React from 'react';
import {
  isWeekend,
  localizedMoment,
  toDayFormat,
  toDayMonthYearFormat,
  toMonthYearFormat,
} from '../../services/dateTimeService';

class WorkLogCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: localizedMoment(),
    };

    this.getDaysOfSelectedMonth = this.getDaysOfSelectedMonth.bind(this);
    this.selectPreviousMonth = this.selectPreviousMonth.bind(this);
    this.selectNextMonth = this.selectNextMonth.bind(this);

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
      display: 'block',
    };

    this.tableCellDayStyle = {
      display: 'block',
      fontSize: '0.75em',
    };
  }

  getDaysOfSelectedMonth() {
    const { selectedDate } = this.state;
    const lastDayOfMonth = selectedDate.clone().endOf('month');
    const renderingDay = selectedDate.clone().startOf('month');

    const days = [];

    while (renderingDay <= lastDayOfMonth) {
      days.push({ date: renderingDay.clone() });
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

  render() {
    return (
      <div>
        <div style={this.headerContainer}>
          <button
            onClick={this.selectPreviousMonth}
            style={this.previousMonthButtonStyle}
          >
            Previous
          </button>
          <span style={this.selectedDateStyle}>
            {toMonthYearFormat(this.state.selectedDate)}
          </span>
          <button
            onClick={this.selectNextMonth}
            style={this.nextMonthButtonStyle}
          >
            Next
          </button>
        </div>
        <div>
          <table style={this.tableStyle}>
            <tbody>
              {this.getDaysOfSelectedMonth().map(day => (
                <tr key={day.date.date()}>
                  <td
                    style={isWeekend(day.date) ? this.tableCellWeekendStyle : this.tableCellStyle}
                  >
                    <span style={this.tableCellDateStyle}>
                      {toDayMonthYearFormat(day.date)}
                    </span>
                    <span style={this.tableCellDayStyle}>
                      {toDayFormat(day.date)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

WorkLogCalendar.defaultProps = {
  onSelectedDateChanged: () => {},
};

WorkLogCalendar.propTypes = {
  onSelectedDateChanged: PropTypes.func,
};

export default WorkLogCalendar;
