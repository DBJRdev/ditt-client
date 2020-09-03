import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import WorkLogCalendar from '../../components/WorkLogCalendar';
import Layout from '../../components/Layout';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../resources/workMonth';
import {
  getWorkingDays,
  localizedMoment,
} from '../../services/dateTimeService';
import { getWorkMonthByMonth } from '../../services/workLogService';

class WorkLogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: localizedMoment(),
    };

    this.addBusinessTripWorkLog = this.addBusinessTripWorkLog.bind(this);
    this.addHomeOfficeWorkLog = this.addHomeOfficeWorkLog.bind(this);
    this.addOvertimeWorkLog = this.addOvertimeWorkLog.bind(this);
    this.addSickDayWorkLog = this.addSickDayWorkLog.bind(this);
    this.addSpecialLeaveWorkLog = this.addSpecialLeaveWorkLog.bind(this);
    this.addTimeOffWorkLog = this.addTimeOffWorkLog.bind(this);
    this.addVacationWorkLog = this.addVacationWorkLog.bind(this);
    this.addMultipleBusinessTripWorkLog = this.addMultipleBusinessTripWorkLog.bind(this);
    this.addMultipleHomeOfficeWorkLog = this.addMultipleHomeOfficeWorkLog.bind(this);
    this.addMultipleSickDayWorkLog = this.addMultipleSickDayWorkLog.bind(this);
    this.addMultipleSpecialLeaveWorkLog = this.addMultipleSpecialLeaveWorkLog.bind(this);
    this.addMultipleTimeOffWorkLog = this.addMultipleTimeOffWorkLog.bind(this);
    this.addMultipleVacationWorkLog = this.addMultipleVacationWorkLog.bind(this);
    this.addWorkLog = this.addWorkLog.bind(this);
    this.deleteBusinessTripWorkLog = this.deleteBusinessTripWorkLog.bind(this);
    this.deleteHomeOfficeWorkLog = this.deleteHomeOfficeWorkLog.bind(this);
    this.deleteOvertimeWorkLog = this.deleteOvertimeWorkLog.bind(this);
    this.deleteSickDayWorkLog = this.deleteSickDayWorkLog.bind(this);
    this.deleteSpecialLeaveWorkLog = this.deleteSpecialLeaveWorkLog.bind(this);
    this.deleteTimeOffWorkLog = this.deleteTimeOffWorkLog.bind(this);
    this.deleteVacationWorkLog = this.deleteVacationWorkLog.bind(this);
    this.deleteWorkLog = this.deleteWorkLog.bind(this);
    this.editBusinessTripWorkLog = this.editBusinessTripWorkLog.bind(this);
    this.editHomeOfficeWorkLog = this.editHomeOfficeWorkLog.bind(this);
    this.editOvertimeWorkLog = this.editOvertimeWorkLog.bind(this);
    this.editSickDayWorkLog = this.editSickDayWorkLog.bind(this);
    this.editSpecialLeaveWorkLog = this.editSpecialLeaveWorkLog.bind(this);
    this.editTimeOffWorkLog = this.editTimeOffWorkLog.bind(this);
    this.editVacationWorkLog = this.editVacationWorkLog.bind(this);
    this.editWorkLog = this.editWorkLog.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
  }

  componentDidMount() {
    this.props.fetchConfig();
    this.props.fetchWorkHoursList(this.props.uid);
    this.props.fetchWorkMonthList(this.props.uid).then(() => {
      this.fetchWorkMonth(this.state.selectedDate);
    });
  }

  addBusinessTripWorkLog(data) {
    return this.props.addBusinessTripWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  addHomeOfficeWorkLog(data) {
    return this.props.addHomeOfficeWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  addOvertimeWorkLog(data) {
    return this.props.addOvertimeWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  addSickDayWorkLog(data) {
    return this.props.addSickDayWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  addSpecialLeaveWorkLog(data) {
    return this.props.addSpecialLeaveWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  addTimeOffWorkLog(data) {
    return this.props.addTimeOffWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addVacationWorkLog(data) {
    return this.props.addVacationWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addMultipleBusinessTripWorkLog(data) {
    const workingDays = getWorkingDays(data.date, data.dateTo, this.props.config.get('supportedHolidays'));
    const workLogs = workingDays.map((workingDay) => ({
      ...data,
      date: workingDay,
      dateTo: undefined,
    }));

    return this.props.addMultipleBusinessTripWorkLog(workLogs).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addMultipleHomeOfficeWorkLog(data) {
    const workingDays = getWorkingDays(data.date, data.dateTo, this.props.config.get('supportedHolidays'));
    const workLogs = workingDays.map((workingDay) => ({
      ...data,
      date: workingDay,
      dateTo: undefined,
    }));

    return this.props.addMultipleHomeOfficeWorkLog(workLogs).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addMultipleSickDayWorkLog(data) {
    const workingDays = getWorkingDays(data.date, data.dateTo, this.props.config.get('supportedHolidays'));
    const workLogs = workingDays.map((workingDay) => ({
      ...data,
      date: workingDay,
      dateTo: undefined,
    }));

    return this.props.addMultipleSickDayWorkLog(workLogs).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addMultipleSpecialLeaveWorkLog(data) {
    const workingDays = getWorkingDays(data.date, data.dateTo, this.props.config.get('supportedHolidays'));
    const workLogs = workingDays.map((workingDay) => ({ date: workingDay }));

    return this.props.addMultipleSpecialLeaveWorkLog(workLogs).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addMultipleTimeOffWorkLog(data) {
    const workingDays = getWorkingDays(data.date, data.dateTo, this.props.config.get('supportedHolidays'));
    const workLogs = workingDays.map((workingDay) => ({
      comment: data.comment,
      date: workingDay,
    }));

    return this.props.addMultipleTimeOffWorkLog(workLogs).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addMultipleVacationWorkLog(data) {
    const workingDays = getWorkingDays(data.date, data.dateTo, this.props.config.get('supportedHolidays'));
    const workLogs = workingDays.map((workingDay) => ({ date: workingDay }));

    return this.props.addMultipleVacationWorkLog(workLogs).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }
      return response;
    });
  }

  addWorkLog(data) {
    return this.props.addWorkLog(data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteBusinessTripWorkLog(id) {
    return this.props.deleteBusinessTripWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteHomeOfficeWorkLog(id) {
    return this.props.deleteHomeOfficeWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteOvertimeWorkLog(id) {
    return this.props.deleteOvertimeWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteSickDayWorkLog(id) {
    return this.props.deleteSickDayWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteSpecialLeaveWorkLog(id) {
    return this.props.deleteSpecialLeaveWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteTimeOffWorkLog(id) {
    return this.props.deleteTimeOffWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteVacationWorkLog(id) {
    return this.props.deleteVacationWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  deleteWorkLog(id) {
    return this.props.deleteWorkLog(id).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editBusinessTripWorkLog(id, data) {
    const { editBusinessTripWorkLog } = this.props;

    return editBusinessTripWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editHomeOfficeWorkLog(id, data) {
    const { editHomeOfficeWorkLog } = this.props;

    return editHomeOfficeWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editOvertimeWorkLog(id, data) {
    const { editOvertimeWorkLog } = this.props;

    return editOvertimeWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editSickDayWorkLog(id, data) {
    const { editSickDayWorkLog } = this.props;

    return editSickDayWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editSpecialLeaveWorkLog(id, data) {
    const { editSpecialLeaveWorkLog } = this.props;

    return editSpecialLeaveWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editTimeOffWorkLog(id, data) {
    const { editTimeOffWorkLog } = this.props;

    return editTimeOffWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editVacationWorkLog(id, data) {
    const { editVacationWorkLog } = this.props;

    return editVacationWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  editWorkLog(id, data) {
    const { editWorkLog } = this.props;

    return editWorkLog(id, data).then((response) => {
      if (!response.error) {
        this.fetchWorkMonth(this.state.selectedDate);
      }

      return response;
    });
  }

  fetchWorkMonth(selectedDate) {
    const workMonth = getWorkMonthByMonth(selectedDate, this.props.workMonthList.toJS());

    if (workMonth) {
      return this.props.fetchWorkMonth(workMonth.id);
    }

    return null;
  }

  changeSelectedDate(selectedDate) {
    this.fetchWorkMonth(selectedDate).then(() => this.setState({ selectedDate }));
  }

  render() {
    return (
      <Layout title={this.props.t('workLog:title.workLogs')} loading={this.props.isFetching}>
        {this.props.config && (
          <WorkLogCalendar
            addBusinessTripWorkLog={this.addBusinessTripWorkLog}
            addHomeOfficeWorkLog={this.addHomeOfficeWorkLog}
            addOvertimeWorkLog={this.addOvertimeWorkLog}
            addSickDayWorkLog={this.addSickDayWorkLog}
            addSpecialLeaveWorkLog={this.addSpecialLeaveWorkLog}
            addTimeOffWorkLog={this.addTimeOffWorkLog}
            addVacationWorkLog={this.addVacationWorkLog}
            addMultipleBanWorkLogs={() => {}}
            addMultipleMaternityProtectionWorkLogs={() => {}}
            addMultipleParentalLeaveWorkLogs={() => {}}
            addMultipleSickDayUnpaidWorkLogs={() => {}}
            addMultipleBusinessTripWorkLog={this.addMultipleBusinessTripWorkLog}
            addMultipleHomeOfficeWorkLog={this.addMultipleHomeOfficeWorkLog}
            addMultipleSickDayWorkLog={this.addMultipleSickDayWorkLog}
            addMultipleSpecialLeaveWorkLog={this.addMultipleSpecialLeaveWorkLog}
            addMultipleTimeOffWorkLog={this.addMultipleTimeOffWorkLog}
            addMultipleVacationWorkLog={this.addMultipleVacationWorkLog}
            addWorkLog={this.addWorkLog}
            banWorkLog={this.props.banWorkLog}
            businessTripWorkLog={this.props.businessTripWorkLog}
            changeSelectedDate={this.changeSelectedDate}
            config={this.props.config}
            deleteBanWorkLog={() => {}}
            deleteBusinessTripWorkLog={this.deleteBusinessTripWorkLog}
            deleteHomeOfficeWorkLog={this.deleteHomeOfficeWorkLog}
            deleteMaternityProtectionWorkLog={() => {}}
            deleteOvertimeWorkLog={this.deleteOvertimeWorkLog}
            deleteParentalLeaveWorkLog={() => {}}
            deleteSickDayUnpaidWorkLog={() => {}}
            deleteSickDayWorkLog={this.deleteSickDayWorkLog}
            deleteSpecialLeaveWorkLog={this.deleteSpecialLeaveWorkLog}
            deleteTimeOffWorkLog={this.deleteTimeOffWorkLog}
            deleteVacationWorkLog={this.deleteVacationWorkLog}
            deleteWorkLog={this.deleteWorkLog}
            editBanWorkLog={() => {}}
            editBusinessTripWorkLog={this.editBusinessTripWorkLog}
            editHomeOfficeWorkLog={this.editHomeOfficeWorkLog}
            editMaternityProtectionWorkLog={() => {}}
            editOvertimeWorkLog={this.editOvertimeWorkLog}
            editParentalLeaveWorkLog={() => {}}
            editSickDayUnpaidWorkLog={() => {}}
            editSickDayWorkLog={this.editSickDayWorkLog}
            editSpecialLeaveWorkLog={this.editSpecialLeaveWorkLog}
            editTimeOffWorkLog={this.editTimeOffWorkLog}
            editVacationWorkLog={this.editVacationWorkLog}
            editWorkLog={this.editWorkLog}
            fetchBanWorkLog={this.props.fetchBanWorkLog}
            fetchBusinessTripWorkLog={this.props.fetchBusinessTripWorkLog}
            fetchHomeOfficeWorkLog={this.props.fetchHomeOfficeWorkLog}
            fetchMaternityProtectionWorkLog={this.props.fetchMaternityProtectionWorkLog}
            fetchOvertimeWorkLog={this.props.fetchOvertimeWorkLog}
            fetchParentalLeaveWorkLog={this.props.fetchParentalLeaveWorkLog}
            fetchSickDayUnpaidWorkLog={this.props.fetchSickDayUnpaidWorkLog}
            fetchSickDayWorkLog={this.props.fetchSickDayWorkLog}
            fetchSpecialLeaveWorkLog={this.props.fetchSpecialLeaveWorkLog}
            fetchTimeOffWorkLog={this.props.fetchTimeOffWorkLog}
            fetchVacationWorkLog={this.props.fetchVacationWorkLog}
            fetchWorkLog={this.props.fetchWorkLog}
            homeOfficeWorkLog={this.props.homeOfficeWorkLog}
            isPosting={this.props.isPosting}
            markApproved={() => {}}
            markWaitingForApproval={this.props.markWaitingForApproval}
            maternityProtectionWorkLog={this.props.maternityProtectionWorkLog}
            overtimeWorkLog={this.props.overtimeWorkLog}
            parentalLeaveWorkLog={this.props.parentalLeaveWorkLog}
            selectedDate={this.state.selectedDate}
            sickDayUnpaidWorkLog={this.props.sickDayUnpaidWorkLog}
            sickDayWorkLog={this.props.sickDayWorkLog}
            specialLeaveWorkLog={this.props.specialLeaveWorkLog}
            timeOffWorkLog={this.props.timeOffWorkLog}
            uid={this.props.uid}
            vacationWorkLog={this.props.vacationWorkLog}
            workHoursList={this.props.workHoursList}
            workLog={this.props.workLog}
            workMonth={this.props.workMonth}
            workMonthList={this.props.workMonthList}
          />
        )}
      </Layout>
    );
  }
}

WorkLogComponent.defaultProps = {
  banWorkLog: null,
  businessTripWorkLog: null,
  config: {},
  homeOfficeWorkLog: null,
  maternityProtectionWorkLog: null,
  overtimeWorkLog: null,
  parentalLeaveWorkLog: null,
  sickDayUnpaidWorkLog: null,
  sickDayWorkLog: null,
  specialLeaveWorkLog: null,
  timeOffWorkLog: null,
  uid: null,
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogComponent.propTypes = {
  addBusinessTripWorkLog: PropTypes.func.isRequired,
  addHomeOfficeWorkLog: PropTypes.func.isRequired,
  addMultipleBusinessTripWorkLog: PropTypes.func.isRequired,
  addMultipleHomeOfficeWorkLog: PropTypes.func.isRequired,
  addMultipleSickDayWorkLog: PropTypes.func.isRequired,
  addMultipleSpecialLeaveWorkLog: PropTypes.func.isRequired,
  addMultipleTimeOffWorkLog: PropTypes.func.isRequired,
  addMultipleVacationWorkLog: PropTypes.func.isRequired,
  addOvertimeWorkLog: PropTypes.func.isRequired,
  addSickDayWorkLog: PropTypes.func.isRequired,
  addSpecialLeaveWorkLog: PropTypes.func.isRequired,
  addTimeOffWorkLog: PropTypes.func.isRequired,
  addVacationWorkLog: PropTypes.func.isRequired,
  addWorkLog: PropTypes.func.isRequired,
  banWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    workTimeLimit: PropTypes.number.isRequired,
  }),
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
  config: ImmutablePropTypes.mapContains({}),
  deleteBusinessTripWorkLog: PropTypes.func.isRequired,
  deleteHomeOfficeWorkLog: PropTypes.func.isRequired,
  deleteOvertimeWorkLog: PropTypes.func.isRequired,
  deleteSickDayWorkLog: PropTypes.func.isRequired,
  deleteSpecialLeaveWorkLog: PropTypes.func.isRequired,
  deleteTimeOffWorkLog: PropTypes.func.isRequired,
  deleteVacationWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  editBusinessTripWorkLog: PropTypes.func.isRequired,
  editHomeOfficeWorkLog: PropTypes.func.isRequired,
  editOvertimeWorkLog: PropTypes.func.isRequired,
  editSickDayWorkLog: PropTypes.func.isRequired,
  editSpecialLeaveWorkLog: PropTypes.func.isRequired,
  editTimeOffWorkLog: PropTypes.func.isRequired,
  editVacationWorkLog: PropTypes.func.isRequired,
  editWorkLog: PropTypes.func.isRequired,
  fetchBanWorkLog: PropTypes.func.isRequired,
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
  fetchMaternityProtectionWorkLog: PropTypes.func.isRequired,
  fetchOvertimeWorkLog: PropTypes.func.isRequired,
  fetchParentalLeaveWorkLog: PropTypes.func.isRequired,
  fetchSickDayUnpaidWorkLog: PropTypes.func.isRequired,
  fetchSickDayWorkLog: PropTypes.func.isRequired,
  fetchSpecialLeaveWorkLog: PropTypes.func.isRequired,
  fetchTimeOffWorkLog: PropTypes.func.isRequired,
  fetchVacationWorkLog: PropTypes.func.isRequired,
  fetchWorkHoursList: PropTypes.func.isRequired,
  fetchWorkLog: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  homeOfficeWorkLog: ImmutablePropTypes.mapContains({
    comment: PropTypes.string,
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
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
  sickDayUnpaidWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
  }),
  sickDayWorkLog: ImmutablePropTypes.mapContains({
    childDateOfBirth: PropTypes.object,
    childName: PropTypes.string,
    date: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
  }),
  specialLeaveWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  t: PropTypes.func.isRequired,
  timeOffWorkLog: ImmutablePropTypes.mapContains({
    comment: PropTypes.string,
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

export default withTranslation()(WorkLogComponent);
