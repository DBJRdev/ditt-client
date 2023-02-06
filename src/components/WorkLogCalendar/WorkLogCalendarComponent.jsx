import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { WorkLogFormModal } from '../WorkLogFormModal';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../../resources/sickDayWorkLog';
import { ROLE_SUPER_ADMIN } from '../../resources/user';
import {
  BAN_WORK_LOG,
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  MATERNITY_PROTECTION_WORK_LOG,
  OVERTIME_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG,
  SICK_DAY_UNPAID_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../resources/workMonth';
import { localizedMoment } from '../../services/dateTimeService';
import { SupervisorWorkLogFormModal } from './components/SupervisorWorkLogFormModal';
import { SupervisorWorkTimeCorrectionModal } from './components/SupervisorWorkTimeCorrectionModal';
import { WorkLogDetailModal } from './components/WorkLogDetailModal';
import { canAddWorkLog } from './helpers/canAddWorkLog';
import { canAddSupervisorWorkLog } from './helpers/canAddSupervisorWorkLog';
import { exportData } from './helpers/exportData';
import { getDaysOfSelectedMonth } from './helpers/getDaysOfSelectedMonth';
import { getWorkHoursInfo } from './helpers/getWorkHoursInfo';
import { WorkLogCalendarContent } from './parts/WorkLogCalendarContent';
import { WorkLogCalendarLowerStatusBar } from './parts/WorkLogCalendarLowerStatusBar';
import { WorkLogCalendarLowerToolbar } from './parts/WorkLogCalendarLowerToolbar';
import { WorkLogCalendarNavigation } from './parts/WorkLogCalendarNavigation';
import { WorkLogCalendarUpperStatusBar } from './parts/WorkLogCalendarUpperStatusBar';
import { WorkLogCalendarUpperToolbar } from './parts/WorkLogCalendarUpperToolbar';

class WorkLogCalendarComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSupervisorWorkLogFormModal: false,
      showSupervisorWorkLogFormModalData: false,
      showSupervisorWorkLogFormModalDate: localizedMoment(),
      showSupervisorWorkTimeCorrectionModal: false,
      showWorkLogDetailModal: false,
      showWorkLogDetailModalId: null,
      showWorkLogDetailModalType: null,
      showWorkLogFormModal: false,
      showWorkLogFormModalData: null,
      showWorkLogFormModalDate: localizedMoment(),
    };

    this.countWaitingForApprovalWorkLogs = this.countWaitingForApprovalWorkLogs.bind(this);

    this.selectPreviousMonth = this.selectPreviousMonth.bind(this);
    this.selectNextMonth = this.selectNextMonth.bind(this);

    this.openWorkLogFormModal = this.openWorkLogFormModal.bind(this);
    this.openEditWorkLogFormModal = this.openEditWorkLogFormModal.bind(this);
    this.closeWorkLogFormModal = this.closeWorkLogFormModal.bind(this);

    this.openSupervisorWorkLogFormModal = this.openSupervisorWorkLogFormModal.bind(this);
    this.closeSupervisorWorkLogFormModal = this.closeSupervisorWorkLogFormModal.bind(this);

    this.openWorkLogDetailModal = this.openWorkLogDetailModal.bind(this);
    this.closeWorkLogDetailModal = this.closeWorkLogDetailModal.bind(this);

    this.openSupervisorWorkTimeCorrectionModal = this.openSupervisorWorkTimeCorrectionModal.bind(this);
    this.closeSupervisorWorkTimeCorrectionModal = this.closeSupervisorWorkTimeCorrectionModal.bind(this);

    this.exportData = this.exportData.bind(this);
  }

  selectNextMonth() {
    const {
      changeSelectedDate,
      selectedDate,
    } = this.props;

    changeSelectedDate(selectedDate.clone().add(1, 'month'));
  }

  selectPreviousMonth() {
    const {
      changeSelectedDate,
      selectedDate,
    } = this.props;

    changeSelectedDate(selectedDate.clone().subtract(1, 'month'));
  }

  async openWorkLogDetailModal(e, id, type) {
    e.stopPropagation();
    const { onWorkLogFetch } = this.props;

    const response = await onWorkLogFetch(id, type);
    if (response === null || response.type.endsWith('FAILURE')) {
      return;
    }

    this.setState({
      showWorkLogDetailModal: true,
      showWorkLogDetailModalId: id,
      showWorkLogDetailModalType: type,
    });
  }

  closeWorkLogDetailModal() {
    this.setState({
      showWorkLogDetailModal: false,
      showWorkLogDetailModalId: null,
      showWorkLogDetailModalType: null,
    });
  }

  openWorkLogFormModal(date, type = null) {
    const {
      businessTripWorkLog,
      homeOfficeWorkLog,
      overtimeWorkLog,
      sickDayWorkLog,
      specialLeaveWorkLog,
      timeOffWorkLog,
      trainingWorkLog,
      vacationWorkLog,
      workLog,
    } = this.props;

    let showWorkLogFormModalData;
    if (type === null) {
      showWorkLogFormModalData = null;
    } else if (type === BUSINESS_TRIP_WORK_LOG) {
      showWorkLogFormModalData = businessTripWorkLog;
    } else if (type === HOME_OFFICE_WORK_LOG) {
      showWorkLogFormModalData = homeOfficeWorkLog;
    } else if (type === OVERTIME_WORK_LOG) {
      showWorkLogFormModalData = overtimeWorkLog;
    } else if (type === SICK_DAY_WORK_LOG) {
      showWorkLogFormModalData = sickDayWorkLog;
    } else if (type === SPECIAL_LEAVE_WORK_LOG) {
      showWorkLogFormModalData = specialLeaveWorkLog;
    } else if (type === TIME_OFF_WORK_LOG) {
      showWorkLogFormModalData = timeOffWorkLog;
    } else if (type === TRAINING_WORK_LOG) {
      showWorkLogFormModalData = trainingWorkLog;
    } else if (type === VACATION_WORK_LOG) {
      showWorkLogFormModalData = vacationWorkLog;
    } else if (type === WORK_LOG) {
      showWorkLogFormModalData = workLog;
    }

    let showWorkLogFormModalDate;
    if (
      date === null
      && showWorkLogFormModalData !== null
      && showWorkLogFormModalData.date
    ) {
      showWorkLogFormModalDate = showWorkLogFormModalData.date;
    } else if (
      date === null
      && showWorkLogFormModalData !== null
      && showWorkLogFormModalData.startTime
    ) {
      showWorkLogFormModalDate = showWorkLogFormModalData.startTime;
    } else {
      const todayDate = localizedMoment();
      showWorkLogFormModalDate = date;
      showWorkLogFormModalDate.hour(todayDate.hour()).minute(todayDate.minute());
    }

    this.setState({
      showWorkLogFormModal: true,
      showWorkLogFormModalData: showWorkLogFormModalData
        ? {
          ...showWorkLogFormModalData,
          type,
        }
        : null,
      showWorkLogFormModalDate,
    });
  }

  async openEditWorkLogFormModal(e, id, type) {
    e.stopPropagation();
    const { onWorkLogFetch } = this.props;

    const response = await onWorkLogFetch(id, type);
    if (response === null || response.type.endsWith('FAILURE')) {
      return;
    }

    if ([
      BAN_WORK_LOG,
      MATERNITY_PROTECTION_WORK_LOG,
      PARENTAL_LEAVE_WORK_LOG,
      SICK_DAY_UNPAID_WORK_LOG,
    ].includes(type)) {
      this.openSupervisorWorkLogFormModal(null, type);

      return;
    }

    this.openWorkLogFormModal(null, type);
  }

  closeWorkLogFormModal() {
    this.setState({
      showWorkLogFormModal: false,
      showWorkLogFormModalData: null,
      showWorkLogFormModalDate: null,
    });
  }

  openSupervisorWorkLogFormModal(date, type = null) {
    const {
      banWorkLog,
      maternityProtectionWorkLog,
      parentalLeaveWorkLog,
      sickDayUnpaidWorkLog,
    } = this.props;

    let showSupervisorWorkLogFormModalData;
    if (type === null) {
      showSupervisorWorkLogFormModalData = null;
    } else if (type === BAN_WORK_LOG) {
      showSupervisorWorkLogFormModalData = banWorkLog;
    } else if (type === MATERNITY_PROTECTION_WORK_LOG) {
      showSupervisorWorkLogFormModalData = maternityProtectionWorkLog;
    } else if (type === PARENTAL_LEAVE_WORK_LOG) {
      showSupervisorWorkLogFormModalData = parentalLeaveWorkLog;
    } else if (type === SICK_DAY_UNPAID_WORK_LOG) {
      showSupervisorWorkLogFormModalData = sickDayUnpaidWorkLog;
    }

    let showSupervisorWorkLogFormModalDate;
    if (
      date === null
      && showSupervisorWorkLogFormModalData !== null
      && showSupervisorWorkLogFormModalData.date
    ) {
      showSupervisorWorkLogFormModalDate = showSupervisorWorkLogFormModalData.date;
    } else {
      showSupervisorWorkLogFormModalDate = date.hour(0).minute(0);
    }

    this.setState({
      showSupervisorWorkLogFormModal: true,
      showSupervisorWorkLogFormModalData: showSupervisorWorkLogFormModalData
        ? {
          ...showSupervisorWorkLogFormModalData,
          type,
        }
        : null,
      showSupervisorWorkLogFormModalDate,
    });
  }

  closeSupervisorWorkLogFormModal() {
    this.setState({
      showSupervisorWorkLogFormModal: false,
      showSupervisorWorkLogFormModalData: null,
      showSupervisorWorkLogFormModalDate: null,
    });
  }

  openSupervisorWorkTimeCorrectionModal() {
    this.setState({
      showSupervisorWorkTimeCorrectionModal: true,
    });
  }

  closeSupervisorWorkTimeCorrectionModal() {
    this.setState({ showSupervisorWorkTimeCorrectionModal: false });
  }

  exportData() {
    const {
      t,
      workMonth,
    } = this.props;

    exportData(workMonth, t);
  }

  countWaitingForApprovalWorkLogs() {
    const { workMonth } = this.props;

    if (workMonth) {
      let count = 0;

      [
        'businessTripWorkLogs',
        'homeOfficeWorkLogs',
        'overtimeWorkLogs',
        'specialLeaveWorkLogs',
        'timeOffWorkLogs',
        'trainingWorkLogs',
        'vacationWorkLogs',
      ].forEach((key) => {
        workMonth[key].forEach((workLog) => {
          if (STATUS_WAITING_FOR_APPROVAL === workLog.status) {
            count += 1;
          }
        });
      });

      return count;
    }

    return 0;
  }

  render() {
    const {
      config,
      fetchWorkMonth,
      fetchWorkMonthList,
      selectedDate,
      supervisorView,
      user,
      workHoursList,
      workMonth,
      workMonthList,
    } = this.props;
    const {
      showWorkLogDetailModal,
      showWorkLogDetailModalId,
      showWorkLogDetailModalType,
      showWorkLogFormModal,
      showWorkLogFormModalData,
      showWorkLogFormModalDate,
      showSupervisorWorkLogFormModal,
      showSupervisorWorkLogFormModalData,
      showSupervisorWorkLogFormModalDate,
      showSupervisorWorkTimeCorrectionModal,
    } = this.state;

    if (
      !workMonth
      || !workMonthList
      || !workHoursList
    ) {
      return null;
    }

    const daysOfSelectedMonth = getDaysOfSelectedMonth(
      config,
      selectedDate,
      workMonth,
      workHoursList,
    );
    const workHoursInfo = getWorkHoursInfo(
      daysOfSelectedMonth,
      config,
      selectedDate,
      workMonth,
      workHoursList,
      workMonthList,
    );

    return (
      <div>
        <WorkLogCalendarNavigation
          fetchWorkMonthList={fetchWorkMonthList}
          selectedDate={selectedDate}
          selectPreviousMonth={this.selectPreviousMonth}
          selectNextMonth={this.selectNextMonth}
          supervisorView={supervisorView}
          workHoursInfo={workHoursInfo}
          workMonth={workMonth}
          workMonthList={workMonthList}
        />
        <WorkLogCalendarUpperStatusBar
          supervisorView={supervisorView}
          status={workMonth.status}
        />
        <WorkLogCalendarUpperToolbar
          exportData={this.exportData}
          openSupervisorWorkTimeCorrectionModal={this.openSupervisorWorkTimeCorrectionModal}
          supervisorView={supervisorView}
          user={user}
          workMonth={workMonth}
        />
        <WorkLogCalendarContent
          config={config}
          canAddSupervisorWorkLog={canAddSupervisorWorkLog(workMonth, supervisorView, user)}
          canAddWorkLog={canAddWorkLog(workMonth, supervisorView)}
          daysOfSelectedMonth={daysOfSelectedMonth}
          fetchWorkMonth={fetchWorkMonth}
          openWorkLogDetailModal={this.openWorkLogDetailModal}
          openSupervisorWorkLogFormModal={this.openSupervisorWorkLogFormModal}
          openWorkLogFormModal={this.openWorkLogFormModal}
          openEditWorkLogFormModal={this.openEditWorkLogFormModal}
          supervisorView={supervisorView}
          user={user}
          workHoursInfo={workHoursInfo}
          workMonth={workMonth}
        />
        <WorkLogCalendarLowerStatusBar
          status={workMonth.status}
          workHoursInfo={workHoursInfo}
        />
        <WorkLogCalendarLowerToolbar
          countWaitingForApprovalWorkLogs={this.countWaitingForApprovalWorkLogs}
          supervisorView={supervisorView}
          workMonth={workMonth}
        />
        {showWorkLogDetailModal && (
          <WorkLogDetailModal
            id={showWorkLogDetailModalId}
            isInSupervisorMode={supervisorView && user.roles.includes(ROLE_SUPER_ADMIN)}
            onAfterDelete={fetchWorkMonth}
            onClose={this.closeWorkLogDetailModal}
            type={showWorkLogDetailModalType}
            uid={user.uid}
            workMonth={workMonth}
          />
        )}
        {showWorkLogFormModal && (
          <WorkLogFormModal
            data={showWorkLogFormModalData}
            date={showWorkLogFormModalDate}
            onAfterSave={fetchWorkMonth}
            onClose={this.closeWorkLogFormModal}
          />
        )}
        {showSupervisorWorkLogFormModal && (
          <SupervisorWorkLogFormModal
            data={showSupervisorWorkLogFormModalData}
            date={showSupervisorWorkLogFormModalDate}
            onAfterSave={fetchWorkMonth}
            onClose={this.closeSupervisorWorkLogFormModal}
          />
        )}
        {showSupervisorWorkTimeCorrectionModal && (
          <SupervisorWorkTimeCorrectionModal onClose={this.closeSupervisorWorkTimeCorrectionModal} />
        )}
      </div>
    );
  }
}

WorkLogCalendarComponent.defaultProps = {
  banWorkLog: null,
  businessTripWorkLog: null,
  config: {},
  fetchWorkMonth: null,
  fetchWorkMonthList: null,
  homeOfficeWorkLog: null,
  maternityProtectionWorkLog: null,
  overtimeWorkLog: null,
  parentalLeaveWorkLog: null,
  sickDayUnpaidWorkLog: null,
  sickDayWorkLog: null,
  specialLeaveWorkLog: null,
  supervisorView: false,
  timeOffWorkLog: null,
  trainingWorkLog: null,
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogCalendarComponent.propTypes = {
  banWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    workTimeLimit: PropTypes.number.isRequired,
  }),
  businessTripWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    destination: PropTypes.string.isRequired,
    expectedArrival: PropTypes.string.isRequired,
    expectedDeparture: PropTypes.string.isRequired,
    plannedEndHour: PropTypes.string.isRequired,
    plannedEndMinute: PropTypes.string.isRequired,
    plannedStartHour: PropTypes.string.isRequired,
    plannedStartMinute: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
    transport: PropTypes.string.isRequired,
  }),
  changeSelectedDate: PropTypes.func.isRequired,
  config: PropTypes.shape({}),
  fetchWorkMonth: PropTypes.func,
  fetchWorkMonthList: PropTypes.func,
  homeOfficeWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    plannedEndHour: PropTypes.string.isRequired,
    plannedEndMinute: PropTypes.string.isRequired,
    plannedStartHour: PropTypes.string.isRequired,
    plannedStartMinute: PropTypes.string.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  maternityProtectionWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
  }),
  onWorkLogFetch: PropTypes.func.isRequired,
  overtimeWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    reason: PropTypes.string,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  parentalLeaveWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
  }),
  selectedDate: PropTypes.shape({
    clone: PropTypes.func.isRequired,
    isSameOrAfter: PropTypes.func.isRequired,
    month: PropTypes.func,
    year: PropTypes.func,
  }).isRequired,
  sickDayUnpaidWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
  }),
  sickDayWorkLog: PropTypes.shape({
    childDateOfBirth: PropTypes.instanceOf(moment),
    childName: PropTypes.string,
    date: PropTypes.instanceOf(moment).isRequired,
    variant: PropTypes.string.isRequired,
  }),
  specialLeaveWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    reason: PropTypes.string,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  supervisorView: PropTypes.bool,
  t: PropTypes.func.isRequired,
  timeOffWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  token: PropTypes.shape({
    exp: PropTypes.number.isRequired,
  }).isRequired,
  trainingWorkLog: PropTypes.shape({
    comment: PropTypes.string,
    date: PropTypes.instanceOf(moment).isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    uid: PropTypes.number.isRequired,
  }).isRequired,
  vacationWorkLog: PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  workHoursList: PropTypes.arrayOf(PropTypes.shape({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
  workLog: PropTypes.shape({
    endTime: PropTypes.instanceOf(moment).isRequired,
    startTime: PropTypes.instanceOf(moment).isRequired,
  }),
  workMonth: PropTypes.shape({
    banWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      workTimeLimit: PropTypes.number.isRequired,
    })).isRequired,
    businessTripWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    homeOfficeWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    id: PropTypes.number.isRequired,
    maternityProtectionWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
    month: PropTypes.shape.isRequired,
    overtimeWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    parentalLeaveWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
    sickDayUnpaidWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
    sickDayWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      variant: PropTypes.oneOf([
        VARIANT_SICK_CHILD,
        VARIANT_WITH_NOTE,
        VARIANT_WITHOUT_NOTE,
      ]).isRequired,
    })).isRequired,
    specialLeaveWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_OPENED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
    timeOffWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    trainingWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    user: PropTypes.shape({
      vacations: PropTypes.arrayOf(PropTypes.shape({
        remainingVacationDays: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired,
      })).isRequired,
    }).isRequired,
    vacationWorkLogs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    workLogs: PropTypes.arrayOf(PropTypes.shape({
      endTime: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      startTime: PropTypes.shape.isRequired,
    })).isRequired,
    year: PropTypes.number,
  }),
  workMonthList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default withTranslation()(WorkLogCalendarComponent);
