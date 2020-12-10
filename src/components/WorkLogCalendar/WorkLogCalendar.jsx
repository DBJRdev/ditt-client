import moment from 'moment';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Toolbar,
  ToolbarItem,
} from '@react-ui-org/react-ui';
import { Icon } from '../Icon';
import WorkLogForm from '../WorkLogForm';
import { transformBusinessTripWorkLog } from '../../resources/businessTripWorkLog';
import { transformHomeOfficeWorkLog } from '../../resources/homeOfficeWorkLog';
import { transformOvertimeWorkLog } from '../../resources/overtimeWorkLog';
import { transformSpecialLeaveWorkLog } from '../../resources/specialLeaveWorkLog';
import { transformTimeOffWorkLog } from '../../resources/timeOffWorkLog';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
  transformSickDayWorkLog,
} from '../../resources/sickDayWorkLog';
import { transformVacationWorkLog } from '../../resources/vacationWorkLog';
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
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../resources/workMonth';
import { transformWorkLog } from '../../resources/workLog';
import {
  getNumberOfWorkingDays,
  includesSameDate,
  isWeekend,
  localizedMoment,
  toDayFormat,
  toDayMonthYearFormat,
  toHourMinuteFormatFromInt,
  toMonthYearFormat,
  toJson,
  toMomentDateTime,
} from '../../services/dateTimeService';
import {
  getWorkLogTimer,
  removeWorkLogTimer,
  setWorkLogTimer,
} from '../../services/storageService';
import {
  getWorkedTime,
  getWorkLogsByDay,
  getWorkMonthByMonth,
} from '../../services/workLogService';
import { AddSupervisorWorkLogModal } from './components/AddSupervisorWorkLogModal';
import { SupervisorWorkTimeCorrectionModal } from './components/SupervisorWorkTimeCorrectionModal';
import { WorkLogDetailButton } from './components/WorkLogDetailButton';
import { WorkLogDetailModal } from './components/WorkLogDetailModal';

import styles from './WorkLogCalendar.scss';

class WorkLogCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteWorkLogDialog: false,
      showDeleteWorkLogDialogId: null,
      showDeleteWorkLogDialogType: null,
      showSupervisorWorkLogForm: false,
      showSupervisorWorkLogFormData: false,
      showSupervisorWorkLogFormDate: localizedMoment(),
      showSupervisorWorkTimeCorrectionModal: false,
      showWorkLogForm: false,
      showWorkLogFormData: null,
      showWorkLogFormDate: localizedMoment(),
      workLogTimer: getWorkLogTimer() ? toMomentDateTime(getWorkLogTimer()) : null,
      workLogTimerInterval: '00:00:00',
    };

    this.openDeleteWorkLogDialog = this.openDeleteWorkLogDialog.bind(this);
    this.selectPreviousMonth = this.selectPreviousMonth.bind(this);
    this.selectNextMonth = this.selectNextMonth.bind(this);
    this.saveWorkLogForm = this.saveWorkLogForm.bind(this);
    this.closeWorkLogForm = this.closeWorkLogForm.bind(this);
    this.closeDeleteWorkLogDialog = this.closeDeleteWorkLogDialog.bind(this);
    this.duplicateWorkLog = this.duplicateWorkLog.bind(this);
    this.initAndStartWorkLogTimer = this.initAndStartWorkLogTimer.bind(this);
    this.stopWorkLogTimer = this.stopWorkLogTimer.bind(this);

    this.openEditWorkLogDialog = this.openEditWorkLogDialog.bind(this);

    this.openSupervisorWorkLogForm = this.openSupervisorWorkLogForm.bind(this);
    this.closeSupervisorWorkLogForm = this.closeSupervisorWorkLogForm.bind(this);
    this.saveSupervisorWorkLogForm = this.saveSupervisorWorkLogForm.bind(this);

    this.openSupervisorWorkTimeCorrectionModal = this.openSupervisorWorkTimeCorrectionModal
      .bind(this);
    this.closeSupervisorWorkTimeCorrectionModal = this.closeSupervisorWorkTimeCorrectionModal
      .bind(this);

    this.workLogTimer = null;

    if (this.state.workLogTimer) {
      this.startWorkLogTimer();
    }
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
          'banWorkLogs',
          'businessTripWorkLogs',
          'homeOfficeWorkLogs',
          'maternityProtectionWorkLogs',
          'overtimeWorkLogs',
          'parentalLeaveWorkLogs',
          'sickDayWorkLogs',
          'sickDayUnpaidWorkLogs',
          'specialLeaveWorkLogs',
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
          renderingDay.clone(),
          workLogListForRenderingDay,
          workHoursList.find((
            (workHour) => workHour.get('month') === (renderingDay.clone().month() + 1)
              && workHour.get('year') === renderingDay.clone().year()
          )).toJS(),
          this.props.config.get('workedHoursLimits').toJS(),
          this.props.config.get('supportedHolidays').toJS(),
        ),
      });

      renderingDay.add(1, 'day');
    }

    return days;
  }

  getWorkHoursInfo(daysOfSelectedMonth) {
    const {
      selectedDate,
      workMonth,
      workHoursList,
    } = this.props;
    let requiredHours = 0;
    let requiredHoursLeft = 0;
    const workedTime = moment.duration();

    const workHours = workHoursList.find((item) => (
      item.get('year') === selectedDate.year()
      && item.get('month') === selectedDate.month() + 1
    ));

    if (!workHours) {
      throw new Error('Work hours missing');
    }

    if (!workMonth) {
      throw new Error('Work month missing');
    }

    const workingDays = getNumberOfWorkingDays(
      selectedDate.clone().startOf('month'),
      selectedDate.clone().endOf('month'),
      this.props.config.get('supportedHolidays'),
    );
    requiredHours = workHours.get('requiredHours') * workingDays;

    daysOfSelectedMonth.forEach((day) => {
      const isParentalLeavePresent = !!day.workLogList.find(
        (workLog) => workLog.type === PARENTAL_LEAVE_WORK_LOG,
      );

      if (isParentalLeavePresent) {
        requiredHours -= workHours.get('requiredHours');
      }

      workedTime.add(day.workTime.workTime);
    });

    workedTime.add(this.props.workMonth.get('workTimeCorrection'), 'seconds');

    if (workMonth.get('status') === STATUS_APPROVED) {
      const apiRequiredHours = workMonth.get('requiredTime');
      const apiWorkedTime = moment.duration();
      apiWorkedTime.add(workMonth.get('workedTime') * 1000);

      // eslint-disable-next-line no-underscore-dangle
      const areWorkTimesSame = workedTime._milliseconds === apiWorkedTime._milliseconds;

      return {
        areWorkTimesSame,
        requiredHours: apiRequiredHours,
        requiredHoursLeft: 0,
        requiredHoursWithoutLeft: 0,
        workedTime,
      };
    }

    if (workMonth.get('status') !== STATUS_APPROVED) {
      const userYearStats = workMonth.getIn(['user', 'yearStats']).toJS();
      const requiredHoursTotal = userYearStats.reduce(
        (total, userYearStat) => total + userYearStat.requiredHours,
        0,
      );
      const workedHoursTotal = userYearStats.reduce(
        (total, userYearStat) => total + userYearStat.workedHours,
        0,
      );

      requiredHoursLeft = requiredHoursTotal - workedHoursTotal;

      return {
        areWorkTimesSame: true,
        requiredHours: Math.max(0, requiredHours + requiredHoursLeft),
        requiredHoursLeft,
        requiredHoursWithoutLeft: requiredHours,
        workedTime,
      };
    }

    return {
      areWorkTimesSame: true,
      requiredHours,
      requiredHoursLeft: 0,
      requiredHoursWithoutLeft: 0,
      workedTime,
    };
  }

  selectNextMonth() {
    this.props.changeSelectedDate(this.props.selectedDate.clone().add(1, 'month'));
  }

  selectPreviousMonth() {
    this.props.changeSelectedDate(this.props.selectedDate.clone().subtract(1, 'month'));
  }

  async duplicateWorkLog(e, id, type) {
    const {
      addBusinessTripWorkLog,
      addHomeOfficeWorkLog,
      addOvertimeWorkLog,
      addSickDayWorkLog,
      addSpecialLeaveWorkLog,
      addTimeOffWorkLog,
      addVacationWorkLog,
      addWorkLog,
      fetchBusinessTripWorkLog,
      fetchHomeOfficeWorkLog,
      fetchOvertimeWorkLog,
      fetchSickDayWorkLog,
      fetchSpecialLeaveWorkLog,
      fetchTimeOffWorkLog,
      fetchVacationWorkLog,
      fetchWorkLog,
    } = this.props;

    e.stopPropagation();

    const getDupliciteWorkLogFunction = async (addFunction, fetchFunction, transformFunction) => {
      const response = await fetchFunction(id);
      const data = transformFunction(response.payload);
      data.id = null;
      data.date = data.date.add(1, 'days');
      data.timeApproved = null;
      data.timeRejected = null;
      data.rejectionMessage = null;

      return addFunction(data);
    };

    if (BUSINESS_TRIP_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addBusinessTripWorkLog,
        fetchBusinessTripWorkLog,
        transformBusinessTripWorkLog,
      );
    }

    if (HOME_OFFICE_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addHomeOfficeWorkLog,
        fetchHomeOfficeWorkLog,
        transformHomeOfficeWorkLog,
      );
    }

    if (OVERTIME_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addOvertimeWorkLog,
        fetchOvertimeWorkLog,
        transformOvertimeWorkLog,
      );
    }

    if (SICK_DAY_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addSickDayWorkLog,
        fetchSickDayWorkLog,
        transformSickDayWorkLog,
      );
    }

    if (SPECIAL_LEAVE_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addSpecialLeaveWorkLog,
        fetchSpecialLeaveWorkLog,
        transformSpecialLeaveWorkLog,
      );
    }

    if (TIME_OFF_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addTimeOffWorkLog,
        fetchTimeOffWorkLog,
        transformTimeOffWorkLog,
      );
    }

    if (VACATION_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addVacationWorkLog,
        fetchVacationWorkLog,
        transformVacationWorkLog,
      );
    }

    if (WORK_LOG === type) {
      const response = await fetchWorkLog(id);
      const data = transformWorkLog(response.payload);
      data.startTime = data.startTime.add(1, 'days');
      data.endTime = data.endTime.add(1, 'days');

      return addWorkLog(data);
    }

    return null;
  }

  async openDeleteWorkLogDialog(e, id, type) {
    e.stopPropagation();

    let response = null;
    if (BAN_WORK_LOG === type) {
      response = await this.props.fetchBanWorkLog(id);
    } else if (BUSINESS_TRIP_WORK_LOG === type) {
      response = await this.props.fetchBusinessTripWorkLog(id);
    } else if (HOME_OFFICE_WORK_LOG === type) {
      response = await this.props.fetchHomeOfficeWorkLog(id);
    } else if (MATERNITY_PROTECTION_WORK_LOG === type) {
      response = await this.props.fetchMaternityProtectionWorkLog(id);
    } else if (OVERTIME_WORK_LOG === type) {
      response = await this.props.fetchOvertimeWorkLog(id);
    } else if (PARENTAL_LEAVE_WORK_LOG === type) {
      response = await this.props.fetchParentalLeaveWorkLog(id);
    } else if (SICK_DAY_UNPAID_WORK_LOG === type) {
      response = await this.props.fetchSickDayUnpaidWorkLog(id);
    } else if (SICK_DAY_WORK_LOG === type) {
      response = await this.props.fetchSickDayWorkLog(id);
    } else if (SPECIAL_LEAVE_WORK_LOG === type) {
      response = await this.props.fetchSpecialLeaveWorkLog(id);
    } else if (TIME_OFF_WORK_LOG === type) {
      response = await this.props.fetchTimeOffWorkLog(id);
    } else if (VACATION_WORK_LOG === type) {
      response = await this.props.fetchVacationWorkLog(id);
    } else if (WORK_LOG === type) {
      response = await this.props.fetchWorkLog(id);
    }

    if (response === null || response.type.endsWith('FAILURE')) {
      return;
    }

    this.setState({
      showDeleteWorkLogDialog: true,
      showDeleteWorkLogDialogId: id,
      showDeleteWorkLogDialogType: type,
    });
  }

  deleteWorkLog(id, type) {
    if (BAN_WORK_LOG === type) {
      return this.props.deleteBanWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (BUSINESS_TRIP_WORK_LOG === type) {
      return this.props.deleteBusinessTripWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (HOME_OFFICE_WORK_LOG === type) {
      return this.props.deleteHomeOfficeWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (MATERNITY_PROTECTION_WORK_LOG === type) {
      return this.props.deleteMaternityProtectionWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (OVERTIME_WORK_LOG === type) {
      return this.props.deleteOvertimeWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (PARENTAL_LEAVE_WORK_LOG === type) {
      return this.props.deleteParentalLeaveWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (SICK_DAY_UNPAID_WORK_LOG === type) {
      return this.props.deleteSickDayUnpaidWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (SICK_DAY_WORK_LOG === type) {
      return this.props.deleteSickDayWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (SPECIAL_LEAVE_WORK_LOG === type) {
      return this.props.deleteSpecialLeaveWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (TIME_OFF_WORK_LOG === type) {
      return this.props.deleteTimeOffWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (VACATION_WORK_LOG === type) {
      return this.props.deleteVacationWorkLog(id).then(this.closeDeleteWorkLogDialog);
    } if (WORK_LOG === type) {
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

  openWorkLogForm(date, type = null) {
    const {
      businessTripWorkLog,
      homeOfficeWorkLog,
      overtimeWorkLog,
      sickDayWorkLog,
      specialLeaveWorkLog,
      timeOffWorkLog,
      vacationWorkLog,
      workLog,
    } = this.props;

    let showWorkLogFormData;
    if (type === null) {
      showWorkLogFormData = null;
    } else if (type === BUSINESS_TRIP_WORK_LOG) {
      showWorkLogFormData = businessTripWorkLog;
    } else if (type === HOME_OFFICE_WORK_LOG) {
      showWorkLogFormData = homeOfficeWorkLog;
    } else if (type === OVERTIME_WORK_LOG) {
      showWorkLogFormData = overtimeWorkLog;
    } else if (type === SICK_DAY_WORK_LOG) {
      showWorkLogFormData = sickDayWorkLog;
    } else if (type === SPECIAL_LEAVE_WORK_LOG) {
      showWorkLogFormData = specialLeaveWorkLog;
    } else if (type === TIME_OFF_WORK_LOG) {
      showWorkLogFormData = timeOffWorkLog;
    } else if (type === VACATION_WORK_LOG) {
      showWorkLogFormData = vacationWorkLog;
    } else if (type === WORK_LOG) {
      showWorkLogFormData = workLog;
    }

    let showWorkLogFormDate;
    if (date === null && showWorkLogFormData !== null && showWorkLogFormData.has('date')) {
      showWorkLogFormDate = showWorkLogFormData.get('date');
    } else if (date === null && showWorkLogFormData !== null && showWorkLogFormData.has('startTime')) {
      showWorkLogFormDate = showWorkLogFormData.get('startTime');
    } else {
      const todayDate = localizedMoment();
      showWorkLogFormDate = date;
      showWorkLogFormDate.hour(todayDate.hour()).minute(todayDate.minute());
    }

    this.setState({
      showWorkLogForm: true,
      showWorkLogFormData: showWorkLogFormData
        ? {
          ...showWorkLogFormData.toJS(),
          type,
        }
        : null,
      showWorkLogFormDate,
    });
  }

  openSupervisorWorkLogForm(date, type = null) {
    const {
      banWorkLog,
      maternityProtectionWorkLog,
      parentalLeaveWorkLog,
      sickDayUnpaidWorkLog,
    } = this.props;

    let showSupervisorWorkLogFormData;
    if (type === null) {
      showSupervisorWorkLogFormData = null;
    } else if (type === BAN_WORK_LOG) {
      showSupervisorWorkLogFormData = banWorkLog;
    } else if (type === MATERNITY_PROTECTION_WORK_LOG) {
      showSupervisorWorkLogFormData = maternityProtectionWorkLog;
    } else if (type === PARENTAL_LEAVE_WORK_LOG) {
      showSupervisorWorkLogFormData = parentalLeaveWorkLog;
    } else if (type === SICK_DAY_UNPAID_WORK_LOG) {
      showSupervisorWorkLogFormData = sickDayUnpaidWorkLog;
    }

    let showSupervisorWorkLogFormDate;
    if (date === null && showSupervisorWorkLogFormData !== null && showSupervisorWorkLogFormData.has('date')) {
      showSupervisorWorkLogFormDate = showSupervisorWorkLogFormData.get('date');
    } else {
      showSupervisorWorkLogFormDate = date.hour(0).minute(0);
    }

    this.setState({
      showSupervisorWorkLogForm: true,
      showSupervisorWorkLogFormData: showSupervisorWorkLogFormData
        ? {
          ...showSupervisorWorkLogFormData.toJS(),
          type,
        }
        : null,
      showSupervisorWorkLogFormDate,
    });
  }

  openSupervisorWorkTimeCorrectionModal() {
    this.setState({
      showSupervisorWorkTimeCorrectionModal: true,
    });
  }

  async openEditWorkLogDialog(e, id, type) {
    e.stopPropagation();

    let response = null;
    if (BAN_WORK_LOG === type) {
      response = await this.props.fetchBanWorkLog(id);
    } else if (BUSINESS_TRIP_WORK_LOG === type) {
      response = await this.props.fetchBusinessTripWorkLog(id);
    } else if (HOME_OFFICE_WORK_LOG === type) {
      response = await this.props.fetchHomeOfficeWorkLog(id);
    } else if (MATERNITY_PROTECTION_WORK_LOG === type) {
      response = await this.props.fetchMaternityProtectionWorkLog(id);
    } else if (OVERTIME_WORK_LOG === type) {
      response = await this.props.fetchOvertimeWorkLog(id);
    } else if (PARENTAL_LEAVE_WORK_LOG === type) {
      response = await this.props.fetchParentalLeaveWorkLog(id);
    } else if (SICK_DAY_UNPAID_WORK_LOG === type) {
      response = await this.props.fetchSickDayUnpaidWorkLog(id);
    } else if (SICK_DAY_WORK_LOG === type) {
      response = await this.props.fetchSickDayWorkLog(id);
    } else if (SPECIAL_LEAVE_WORK_LOG === type) {
      response = await this.props.fetchSpecialLeaveWorkLog(id);
    } else if (TIME_OFF_WORK_LOG === type) {
      response = await this.props.fetchTimeOffWorkLog(id);
    } else if (VACATION_WORK_LOG === type) {
      response = await this.props.fetchVacationWorkLog(id);
    } else if (WORK_LOG === type) {
      response = await this.props.fetchWorkLog(id);
    }

    if (response === null || response.type.endsWith('FAILURE')) {
      return;
    }

    if ([
      BAN_WORK_LOG,
      MATERNITY_PROTECTION_WORK_LOG,
      PARENTAL_LEAVE_WORK_LOG,
      SICK_DAY_UNPAID_WORK_LOG,
    ].includes(type)) {
      this.openSupervisorWorkLogForm(null, type);

      return;
    }

    this.openWorkLogForm(null, type);
  }

  saveWorkLogForm(data) {
    const {
      addMultipleBusinessTripWorkLog,
      addMultipleHomeOfficeWorkLog,
      addMultipleSickDayWorkLog,
      addMultipleSpecialLeaveWorkLog,
      addMultipleTimeOffWorkLog,
      addMultipleVacationWorkLog,
      addOvertimeWorkLog,
      addWorkLog,
      editBusinessTripWorkLog,
      editHomeOfficeWorkLog,
      editOvertimeWorkLog,
      editSickDayWorkLog,
      editSpecialLeaveWorkLog,
      editTimeOffWorkLog,
      editVacationWorkLog,
      editWorkLog,
    } = this.props;

    if (BUSINESS_TRIP_WORK_LOG === data.type) {
      const requestData = {
        date: data.date,
        dateTo: data.dateTo,
        destination: data.destination,
        expectedArrival: data.expectedArrival,
        expectedDeparture: data.expectedDeparture,
        purpose: data.purpose,
        transport: data.transport,
      };

      if (data.id) {
        return editBusinessTripWorkLog(data.id, requestData);
      }

      return addMultipleBusinessTripWorkLog(requestData);
    }

    if (HOME_OFFICE_WORK_LOG === data.type) {
      const requestData = {
        comment: data.comment,
        date: data.date,
        dateTo: data.dateTo,
      };

      if (data.id) {
        return editHomeOfficeWorkLog(data.id, requestData);
      }

      return addMultipleHomeOfficeWorkLog(requestData);
    }

    if (OVERTIME_WORK_LOG === data.type) {
      const requestData = {
        date: data.date,
        reason: data.reason,
      };

      if (data.id) {
        return editOvertimeWorkLog(data.id, requestData);
      }

      return addOvertimeWorkLog(requestData);
    }

    if (SICK_DAY_WORK_LOG === data.type) {
      const requestData = {
        childDateOfBirth: data.childDateOfBirth,
        childName: data.childName,
        date: data.date,
        dateTo: data.dateTo,
        variant: data.variant,
      };

      if (data.id) {
        return editSickDayWorkLog(data.id, requestData);
      }

      return addMultipleSickDayWorkLog(requestData);
    }

    if (SPECIAL_LEAVE_WORK_LOG === data.type) {
      const requestData = {
        date: data.date,
        dateTo: data.dateTo,
      };

      if (data.id) {
        return editSpecialLeaveWorkLog(data.id, requestData);
      }

      return addMultipleSpecialLeaveWorkLog(requestData);
    }

    if (TIME_OFF_WORK_LOG === data.type) {
      const requestData = {
        comment: data.comment,
        date: data.date,
        dateTo: data.dateTo,
      };

      if (data.id) {
        return editTimeOffWorkLog(data.id, requestData);
      }

      return addMultipleTimeOffWorkLog(requestData);
    }

    if (VACATION_WORK_LOG === data.type) {
      const requestData = {
        date: data.date,
        dateTo: data.dateTo,
      };

      if (data.id) {
        return editVacationWorkLog(data.id, requestData);
      }

      return addMultipleVacationWorkLog(requestData);
    }

    if (WORK_LOG === data.type) {
      const requestData = {
        endTime: data.endTime,
        startTime: data.startTime,
      };

      if (data.id) {
        return editWorkLog(data.id, requestData);
      }

      return addWorkLog(requestData);
    }

    throw new Error(`Unknown type ${data.type}`);
  }

  saveSupervisorWorkLogForm(data) {
    const {
      addMultipleBanWorkLogs,
      addMultipleMaternityProtectionWorkLogs,
      addMultipleParentalLeaveWorkLogs,
      addMultipleSickDayUnpaidWorkLogs,
      editBanWorkLog,
      editMaternityProtectionWorkLog,
      editParentalLeaveWorkLog,
      editSickDayUnpaidWorkLog,
      workMonth,
    } = this.props;

    const requestData = {
      date: data.date,
      dateTo: data.dateTo,
      user: {
        id: workMonth.get('user').get('id'),
      },
    };

    if (BAN_WORK_LOG === data.type) {
      if (data.id) {
        return editBanWorkLog(
          data.id,
          {
            ...requestData,
            workTimeLimit: data.workTimeLimit,
          },
        );
      }

      return addMultipleBanWorkLogs({
        ...requestData,
        workTimeLimit: data.workTimeLimit,
      });
    }

    if (MATERNITY_PROTECTION_WORK_LOG === data.type) {
      if (data.id) {
        return editMaternityProtectionWorkLog(data.id, requestData);
      }

      return addMultipleMaternityProtectionWorkLogs(requestData);
    }

    if (PARENTAL_LEAVE_WORK_LOG === data.type) {
      if (data.id) {
        return editParentalLeaveWorkLog(data.id, requestData);
      }

      return addMultipleParentalLeaveWorkLogs(requestData);
    }

    if (SICK_DAY_UNPAID_WORK_LOG === data.type) {
      if (data.id) {
        return editSickDayUnpaidWorkLog(data.id, requestData);
      }

      return addMultipleSickDayUnpaidWorkLogs(requestData);
    }

    throw new Error(`Unknown type ${data.type}`);
  }

  closeWorkLogForm() {
    this.setState({
      showWorkLogForm: false,
      showWorkLogFormData: null,
      showWorkLogFormDate: null,
    });
  }

  closeSupervisorWorkLogForm() {
    this.setState({
      showSupervisorWorkLogForm: false,
      showSupervisorWorkLogFormData: null,
      showSupervisorWorkLogFormDate: null,
    });
  }

  closeSupervisorWorkTimeCorrectionModal() {
    this.setState({ showSupervisorWorkTimeCorrectionModal: false });
  }

  countWaitingForApprovalWorkLogs() {
    if (this.props.workMonth) {
      let count = 0;

      [
        'businessTripWorkLogs',
        'homeOfficeWorkLogs',
        'overtimeWorkLogs',
        'specialLeaveWorkLogs',
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

  initAndStartWorkLogTimer(e) {
    e.stopPropagation();

    const startTime = localizedMoment();

    this.setState({ workLogTimer: startTime });
    setWorkLogTimer(toJson(startTime));

    this.startWorkLogTimer();
  }

  startWorkLogTimer() {
    this.workLogTimer = setInterval(() => {
      const intervalMiliseconds = localizedMoment().diff(this.state.workLogTimer);
      const interval = moment.utc(intervalMiliseconds);

      this.setState({ workLogTimerInterval: interval.format('HH:mm:ss') });
    }, 1000);
  }

  stopWorkLogTimer(e) {
    e.stopPropagation();

    const startTime = toMomentDateTime(getWorkLogTimer()).second(0);
    let endTime = localizedMoment().second(0);

    if (startTime.unix() === endTime.unix()) {
      endTime = endTime.add(1, 'minutes');
    }

    const intervalMiliseconds = localizedMoment().diff(this.state.workLogTimer);

    clearInterval(this.workLogTimer);

    this.setState({
      workLogTimer: null,
      workLogTimerInterval: '00:00:00',
    });
    removeWorkLogTimer();

    if (intervalMiliseconds >= 30000) {
      this.props.addWorkLog({
        endTime,
        startTime,
      });
    }
  }

  renderWorkHoursInfo(daysOfSelectedMonth) {
    const {
      selectedDate,
      t,
      workMonth,
      workHoursList,
    } = this.props;
    let requiredHours = 0;
    let requiredHoursLeft = 0;
    const workedTime = moment.duration();

    const workHours = workHoursList.find((item) => (
      item.get('year') === selectedDate.year()
      && item.get('month') === selectedDate.month() + 1
    ));

    if (workHours) {
      const workingDays = getNumberOfWorkingDays(
        selectedDate.clone().startOf('month'),
        selectedDate.clone().endOf('month'),
        this.props.config.get('supportedHolidays'),
      );
      requiredHours = workHours.get('requiredHours') * workingDays;
    }

    daysOfSelectedMonth.forEach((day) => {
      const isParentalLeavePresent = !!day.workLogList.find(
        (workLog) => workLog.type === PARENTAL_LEAVE_WORK_LOG,
      );

      if (isParentalLeavePresent) {
        requiredHours -= workHours.get('requiredHours');
      }

      workedTime.add(day.workTime.workTime);
    });

    if (workMonth) {
      workedTime.add(this.props.workMonth.get('workTimeCorrection'), 'seconds');
    }

    if (workMonth && workMonth.get('status') === STATUS_APPROVED) {
      const apiRequiredHours = workMonth.get('requiredTime');
      const apiWorkedTime = moment.duration();
      apiWorkedTime.add(workMonth.get('workedTime') * 1000);

      // eslint-disable-next-line no-underscore-dangle
      const areWorkTimesSame = workedTime._milliseconds === apiWorkedTime._milliseconds;

      return t(
        areWorkTimesSame ? 'workLog:text.workedAndRequiredHours' : 'workLog:text.workedAndRequiredHoursDiffers',
        {
          requiredHours: toHourMinuteFormatFromInt(apiRequiredHours),
          workedHours: `${apiWorkedTime.hours() + (apiWorkedTime.days() * 24)}:${(apiWorkedTime.minutes()) < 10 ? '0' : ''}${apiWorkedTime.minutes()}`,
        },
      );
    }

    if (workMonth && workMonth.get('status') !== STATUS_APPROVED) {
      const userYearStats = workMonth.getIn(['user', 'yearStats']).toJS();
      const requiredHoursTotal = userYearStats.reduce(
        (total, userYearStat) => total + userYearStat.requiredHours,
        0,
      );
      const workedHoursTotal = userYearStats.reduce(
        (total, userYearStat) => total + userYearStat.workedHours,
        0,
      );

      requiredHoursLeft = requiredHoursTotal - workedHoursTotal;

      if (requiredHoursLeft > 0) {
        return t(
          'workLog:text.workedAndRequiredHoursPlusLeft',
          {
            requiredHours: toHourMinuteFormatFromInt(
              Math.max(0, requiredHours + requiredHoursLeft),
            ),
            requiredHoursLeft: toHourMinuteFormatFromInt(requiredHoursLeft),
            requiredHoursWithoutLeft: toHourMinuteFormatFromInt(requiredHours),
            workedHours: `${workedTime.hours() + (workedTime.days() * 24)}:${(workedTime.minutes()) < 10 ? '0' : ''}${workedTime.minutes()}`,
          },
        );
      }

      if (requiredHoursLeft < 0) {
        return t(
          'workLog:text.workedAndRequiredHoursMinusLeft',
          {
            requiredHours: toHourMinuteFormatFromInt(
              Math.max(0, requiredHours + requiredHoursLeft),
            ),
            requiredHoursLeft: toHourMinuteFormatFromInt(requiredHoursLeft),
            requiredHoursWithoutLeft: toHourMinuteFormatFromInt(requiredHours),
            workedHours: `${workedTime.hours() + (workedTime.days() * 24)}:${(workedTime.minutes()) < 10 ? '0' : ''}${workedTime.minutes()}`,
          },
        );
      }
    }

    return t(
      'workLog:text.workedAndRequiredHours',
      {
        requiredHours: toHourMinuteFormatFromInt(requiredHours),
        workedHours: `${workedTime.hours() + (workedTime.days() * 24)}:${(workedTime.minutes()) < 10 ? '0' : ''}${workedTime.minutes()}`,
      },
    );
  }

  renderWorkLogForm() {
    const {
      config,
      isPosting,
      workMonth,
    } = this.props;
    const {
      showWorkLogFormData,
      showWorkLogFormDate,
    } = this.state;

    return (
      <WorkLogForm
        banWorkLogsOfDay={
          workMonth
            ? getWorkLogsByDay(showWorkLogFormDate, workMonth.get('banWorkLogs'))
            : []
        }
        closeHandler={this.closeWorkLogForm}
        config={config}
        data={showWorkLogFormData}
        date={showWorkLogFormDate}
        isPosting={isPosting}
        saveHandler={this.saveWorkLogForm}
        user={workMonth.get('user')}
        workLogsOfDay={
          workMonth
            ? getWorkLogsByDay(showWorkLogFormDate, workMonth.get('workLogs'))
            : []
        }
        showInfoText={STATUS_WAITING_FOR_APPROVAL === workMonth.get('status')}
      />
    );
  }

  renderSupervisorWorkLogForm() {
    const { isPosting } = this.props;
    const {
      showSupervisorWorkLogFormData,
      showSupervisorWorkLogFormDate,
    } = this.state;

    return (
      <AddSupervisorWorkLogModal
        data={showSupervisorWorkLogFormData}
        date={showSupervisorWorkLogFormDate}
        isPosting={isPosting}
        onClose={this.closeSupervisorWorkLogForm}
        onSave={this.saveSupervisorWorkLogForm}
      />
    );
  }

  renderSupervisorWorkTimeCorrectionModal() {
    const {
      isPosting,
      setWorkTimeCorrection,
      workMonth,
    } = this.props;

    return (
      <SupervisorWorkTimeCorrectionModal
        isPosting={isPosting}
        onClose={this.closeSupervisorWorkTimeCorrectionModal}
        onSetWorkTimeCorrection={setWorkTimeCorrection}
        workMonth={workMonth.toJS()}
      />
    );
  }

  renderDeleteWorkLogModal() {
    const {
      banWorkLog,
      businessTripWorkLog,
      homeOfficeWorkLog,
      isPosting,
      maternityProtectionWorkLog,
      overtimeWorkLog,
      parentalLeaveWorkLog,
      sickDayUnpaidWorkLog,
      sickDayWorkLog,
      specialLeaveWorkLog,
      userRoles,
      supervisorView,
      timeOffWorkLog,
      uid,
      vacationWorkLog,
      workLog,
      workMonth,
    } = this.props;
    const {
      showDeleteWorkLogDialogId,
      showDeleteWorkLogDialogType,
    } = this.state;

    return (
      <WorkLogDetailModal
        banWorkLog={banWorkLog ? banWorkLog.toJS() : null}
        businessTripWorkLog={businessTripWorkLog ? businessTripWorkLog.toJS() : null}
        homeOfficeWorkLog={homeOfficeWorkLog ? homeOfficeWorkLog.toJS() : null}
        id={showDeleteWorkLogDialogId}
        isInSupervisorMode={supervisorView && userRoles.includes(ROLE_SUPER_ADMIN)}
        isPosting={isPosting}
        maternityProtectionWorkLog={
          maternityProtectionWorkLog ? maternityProtectionWorkLog.toJS() : null
        }
        onClose={this.closeDeleteWorkLogDialog}
        onDelete={() => this.deleteWorkLog(
          showDeleteWorkLogDialogId,
          showDeleteWorkLogDialogType,
        )}
        overtimeWorkLog={overtimeWorkLog ? overtimeWorkLog.toJS() : null}
        parentalLeaveWorkLog={parentalLeaveWorkLog ? parentalLeaveWorkLog.toJS() : null}
        sickDayUnpaidWorkLog={sickDayUnpaidWorkLog ? sickDayUnpaidWorkLog.toJS() : null}
        sickDayWorkLog={sickDayWorkLog ? sickDayWorkLog.toJS() : null}
        specialLeaveWorkLog={specialLeaveWorkLog ? specialLeaveWorkLog.toJS() : null}
        timeOffWorkLog={timeOffWorkLog ? timeOffWorkLog.toJS() : null}
        type={showDeleteWorkLogDialogType}
        uid={uid}
        vacationWorkLog={vacationWorkLog ? vacationWorkLog.toJS() : null}
        workLog={workLog ? workLog.toJS() : null}
        workMonth={workMonth ? workMonth.toJS() : null}
      />
    );
  }

  render() {
    const {
      t,
      userRoles,
    } = this.props;
    const date = localizedMoment();
    let status = null;
    let userId = null;

    if (this.props.workMonth) {
      status = this.props.workMonth.get('status');
      userId = this.props.workMonth.get('user').get('id');
    }

    if (
      !this.props.workMonth
      || !this.props.workMonthList
      || !this.props.workHoursList
    ) {
      return null;
    }

    const daysOfSelectedMonth = this.getDaysOfSelectedMonth();

    const canAddWorkLog = !this.props.supervisorView
      && (status === STATUS_OPENED || status === STATUS_WAITING_FOR_APPROVAL);
    const canAddSupervisorWorkLog = this.props.supervisorView
      && userRoles.includes(ROLE_SUPER_ADMIN)
      && (this.props.uid !== userId)
      && (status === STATUS_OPENED || status === STATUS_WAITING_FOR_APPROVAL);

    let workTimeCorrectionText = null;

    let areWorkTimesSame = true;
    if (this.props.workMonth) {
      const workTimeCorrection = Math.abs(this.props.workMonth.get('workTimeCorrection'));
      if (workTimeCorrection !== 0) {
        const hour = parseInt(workTimeCorrection / 3600, 10);
        const minute = parseInt((workTimeCorrection - (hour * 3600)) / 60, 10);
        let minuteText = minute;

        if (minute === 0) {
          minuteText = '00';
        } else if (minute < 10) {
          minuteText = `0${minute}`;
        }

        if (this.props.workMonth.get('workTimeCorrection') > 0) {
          workTimeCorrectionText = `${t('workLog:text.correction')}: + ${hour}:${minuteText} h`;
        } else {
          workTimeCorrectionText = `${t('workLog:text.correction')}: - ${hour}:${minuteText} h`;
        }
      }

      areWorkTimesSame = this.getWorkHoursInfo(daysOfSelectedMonth).areWorkTimesSame;
    }

    return (
      <div>
        <nav className={styles.navigation}>
          <div className={styles.navigationPrevious}>
            <Button
              beforeLabel={<Icon icon="keyboard_arrow_left" />}
              clickHandler={this.selectPreviousMonth}
              disabled={
                !getWorkMonthByMonth(
                  this.props.selectedDate.clone().subtract(1, 'month'),
                  this.props.workMonthList.toJS(),
                )
              }
              label={t('workLog:action.previousMonth')}
            />
          </div>
          <div>
            <div className={styles.navigationWrap}>
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
                <div className="mt-2">
                  <Button
                    clickHandler={() => {
                      if (this.props.workMonth) {
                        this.props.markApproved(this.props.workMonth.get('id'));
                      }
                    }}
                    label={t('workLog:action.approveMonth')}
                    variant="success"
                  />
                </div>
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
              afterLabel={<Icon icon="keyboard_arrow_right" />}
              clickHandler={this.selectNextMonth}
              disabled={
                !getWorkMonthByMonth(
                  this.props.selectedDate.clone().add(1, 'month'),
                  this.props.workMonthList.toJS(),
                )
              }
              label={t('workLog:action.nextMonth')}
            />
          </div>
        </nav>
        {(this.props.supervisorView && status === STATUS_OPENED) && (
          <p>
            {t('workLog:text.openedWorkMonth')}
          </p>
        )}
        {(
          this.props.supervisorView
          && userRoles.includes(ROLE_SUPER_ADMIN)
          && (this.props.uid !== userId)
          && (status === STATUS_OPENED || status === STATUS_WAITING_FOR_APPROVAL)
        ) && (
          <div className={styles.tableToolbar}>
            <Button
              clickHandler={this.openSupervisorWorkTimeCorrectionModal}
              label={t('workMonth:actions.setWorkTimeCorrection')}
            />
          </div>
        )}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              {workTimeCorrectionText && (
                <tr>
                  <td
                    colSpan={(canAddWorkLog || canAddSupervisorWorkLog) ? 4 : 3}
                    className={styles.tableCellRight}
                  >
                    {workTimeCorrectionText}
                  </td>
                </tr>
              )}
              {daysOfSelectedMonth.map((day) => {
                let rowClassName = (
                  isWeekend(day.date)
                || includesSameDate(day.date, this.props.config.get('supportedHolidays'))
                ) ? styles.tableRowWeekend
                  : styles.tableRow;

                if (canAddWorkLog || canAddSupervisorWorkLog) {
                  rowClassName = `${rowClassName} ${styles.tableRowAddWorkLog}`;
                }

                let onRowClick;
                if (canAddWorkLog) {
                  onRowClick = () => this.openWorkLogForm(day.date);
                } else if (canAddSupervisorWorkLog) {
                  onRowClick = () => this.openSupervisorWorkLogForm(day.date);
                }

                return (
                  <tr
                    className={rowClassName}
                    key={day.date.date()}
                    onClick={onRowClick}
                  >
                    <td className={styles.dateTableCell}>
                      <div className={styles.date}>
                        {toDayMonthYearFormat(day.date)}
                      </div>
                      <div className={styles.dayInWeek}>
                        {toDayFormat(day.date)}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <Toolbar dense>
                        {day.workLogList.map((workLog) => (
                          <WorkLogDetailButton
                            currentDate={day.date}
                            daysOfCurrentMonth={daysOfSelectedMonth}
                            isInSupervisorMode={
                              this.props.supervisorView && userRoles.includes(ROLE_SUPER_ADMIN)
                            }
                            key={`${workLog.type}_${workLog.id}`}
                            onClick={this.openDeleteWorkLogDialog}
                            onDuplicateClick={this.duplicateWorkLog}
                            onEditClick={this.openEditWorkLogDialog}
                            uid={this.props.uid}
                            workLog={workLog}
                            workMonth={this.props.workMonth.toJS()}
                          />
                        ))}
                        {
                          day.date.isSame(date, 'day')
                          && canAddWorkLog
                          && (
                            <ToolbarItem>
                              {
                                this.state.workLogTimer
                                  ? (
                                    <Button
                                      beforeLabel={<Icon icon="stop" />}
                                      clickHandler={this.stopWorkLogTimer}
                                      label={`${t('workLog:action.endWork')} | ${this.state.workLogTimerInterval}`}
                                    />
                                  ) : (
                                    <Button
                                      beforeLabel={<Icon icon="play_arrow" />}
                                      clickHandler={this.initAndStartWorkLogTimer}
                                      label={t('workLog:action.startWork')}
                                    />
                                  )
                              }
                            </ToolbarItem>
                          )
                        }
                      </Toolbar>
                    </td>
                    {
                      canAddWorkLog
                      && (
                        <td className={styles.tableCellRight}>
                          <div className={styles.addWorkLogButtonWrapper}>
                            <Button
                              clickHandler={() => this.openWorkLogForm(day.date)}
                              beforeLabel={<Icon icon="add" />}
                              label={t('workLog:action.addWorkLog')}
                              labelVisibility="none"
                            />
                          </div>
                        </td>
                      )
                    }
                    {
                      canAddSupervisorWorkLog
                      && (
                        <td className={styles.tableCellRight}>
                          <div className={styles.addWorkLogButtonWrapper}>
                            <Button
                              clickHandler={() => this.openSupervisorWorkLogForm(day.date)}
                              beforeLabel={<Icon icon="add" />}
                              label={t('workLog:action.addWorkLog')}
                              labelVisibility="none"
                            />
                          </div>
                        </td>
                      )
                    }
                    <td
                      className={
                        day.workTime.isWorkTimeCorrected
                          ? styles.tableCellRightWithCorrectedTime
                          : styles.tableCellRight
                      }
                    >
                      {
                        day.workTime.isWorkTimeCorrected
                          ? (
                            <Icon icon="update" />
                          ) : null
                      }
                      {
                        areWorkTimesSame
                          ? (
                            <>
                              {day.workTime.workTime.hours()}
                              :
                              {day.workTime.workTime.minutes() < 10 && '0'}
                              {day.workTime.workTime.minutes()}
                            </>
                          ) : '-:--'
                      }
                      &nbsp;h
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
                beforeLabel={<Icon icon="send" />}
                clickHandler={() => {
                  if (this.props.workMonth) {
                    this.props.markWaitingForApproval(this.props.workMonth.get('id'));
                  }
                }}
                disabled={!this.props.workMonth || !!this.countWaitingForApprovalWorkLogs()}
                label={t('workLog:action.sendWorkMonthForApproval')}
                loadingIcon={this.props.isPosting ? <Icon icon="sync" /> : null}
              />
            </div>
          )
        }
        {this.state.showDeleteWorkLogDialog ? this.renderDeleteWorkLogModal() : null}
        {this.state.showWorkLogForm ? this.renderWorkLogForm() : null}
        {this.state.showSupervisorWorkLogForm ? this.renderSupervisorWorkLogForm() : null}
        {
          this.state.showSupervisorWorkTimeCorrectionModal
            ? this.renderSupervisorWorkTimeCorrectionModal()
            : null
        }
      </div>
    );
  }
}

WorkLogCalendar.defaultProps = {
  banWorkLog: null,
  businessTripWorkLog: null,
  config: {},
  homeOfficeWorkLog: null,
  maternityProtectionWorkLog: null,
  overtimeWorkLog: null,
  parentalLeaveWorkLog: null,
  setWorkTimeCorrection: null,
  sickDayUnpaidWorkLog: null,
  sickDayWorkLog: null,
  specialLeaveWorkLog: null,
  supervisorView: false,
  timeOffWorkLog: null,
  uid: null,
  userRoles: [],
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogCalendar.propTypes = {
  addBusinessTripWorkLog: PropTypes.func.isRequired,
  addHomeOfficeWorkLog: PropTypes.func.isRequired,
  addMultipleBanWorkLogs: PropTypes.func.isRequired,
  addMultipleBusinessTripWorkLog: PropTypes.func.isRequired,
  addMultipleHomeOfficeWorkLog: PropTypes.func.isRequired,
  addMultipleMaternityProtectionWorkLogs: PropTypes.func.isRequired,
  addMultipleParentalLeaveWorkLogs: PropTypes.func.isRequired,
  addMultipleSickDayUnpaidWorkLogs: PropTypes.func.isRequired,
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
  changeSelectedDate: PropTypes.func.isRequired,
  config: ImmutablePropTypes.mapContains({}),
  deleteBanWorkLog: PropTypes.func.isRequired,
  deleteBusinessTripWorkLog: PropTypes.func.isRequired,
  deleteHomeOfficeWorkLog: PropTypes.func.isRequired,
  deleteMaternityProtectionWorkLog: PropTypes.func.isRequired,
  deleteOvertimeWorkLog: PropTypes.func.isRequired,
  deleteParentalLeaveWorkLog: PropTypes.func.isRequired,
  deleteSickDayUnpaidWorkLog: PropTypes.func.isRequired,
  deleteSickDayWorkLog: PropTypes.func.isRequired,
  deleteSpecialLeaveWorkLog: PropTypes.func.isRequired,
  deleteTimeOffWorkLog: PropTypes.func.isRequired,
  deleteVacationWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  editBanWorkLog: PropTypes.func.isRequired,
  editBusinessTripWorkLog: PropTypes.func.isRequired,
  editHomeOfficeWorkLog: PropTypes.func.isRequired,
  editMaternityProtectionWorkLog: PropTypes.func.isRequired,
  editOvertimeWorkLog: PropTypes.func.isRequired,
  editParentalLeaveWorkLog: PropTypes.func.isRequired,
  editSickDayUnpaidWorkLog: PropTypes.func.isRequired,
  editSickDayWorkLog: PropTypes.func.isRequired,
  editSpecialLeaveWorkLog: PropTypes.func.isRequired,
  editTimeOffWorkLog: PropTypes.func.isRequired,
  editVacationWorkLog: PropTypes.func.isRequired,
  editWorkLog: PropTypes.func.isRequired,
  fetchBanWorkLog: PropTypes.func.isRequired,
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
  fetchMaternityProtectionWorkLog: PropTypes.func.isRequired,
  fetchOvertimeWorkLog: PropTypes.func.isRequired,
  fetchParentalLeaveWorkLog: PropTypes.func.isRequired,
  fetchSickDayUnpaidWorkLog: PropTypes.func.isRequired,
  fetchSickDayWorkLog: PropTypes.func.isRequired,
  fetchSpecialLeaveWorkLog: PropTypes.func.isRequired,
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
  selectedDate: PropTypes.shape({
    clone: PropTypes.func.isRequired,
    month: PropTypes.func,
    year: PropTypes.func,
  }).isRequired,
  setWorkTimeCorrection: PropTypes.func,
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
  supervisorView: PropTypes.bool,
  t: PropTypes.func.isRequired,
  timeOffWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  uid: PropTypes.number,
  userRoles: PropTypes.arrayOf(PropTypes.oneOf([
    ROLE_ADMIN,
    ROLE_EMPLOYEE,
    ROLE_SUPER_ADMIN,
  ])),
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
    banWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      workTimeLimit: PropTypes.number.isRequired,
    })).isRequired,
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
    maternityProtectionWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
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
    parentalLeaveWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
    sickDayUnpaidWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
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
    specialLeaveWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
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
    timeOffWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
    user: ImmutablePropTypes.mapContains({
      vacations: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
        remainingVacationDays: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired,
      })).isRequired,
    }).isRequired,
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

export default withTranslation()(WorkLogCalendar);
