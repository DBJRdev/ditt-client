import { connect } from 'react-redux';
import {
  addBusinessTripWorkLog,
  addMultipleBusinessTripWorkLog,
  editBusinessTripWorkLog,
  selectBusinessTripWorkLogMeta,
} from '../../resources/businessTripWorkLog';
import {
  addHomeOfficeWorkLog,
  addMultipleHomeOfficeWorkLog,
  editHomeOfficeWorkLog,
  selectHomeOfficeWorkLogMeta,
} from '../../resources/homeOfficeWorkLog';
import {
  addOvertimeWorkLog,
  editOvertimeWorkLog,
  selectOvertimeWorkLogMeta,
} from '../../resources/overtimeWorkLog';
import {
  addMultipleSickDayWorkLog,
  addSickDayWorkLog,
  editSickDayWorkLog,
  selectSickDayWorkLogMeta,
} from '../../resources/sickDayWorkLog';
import {
  addMultipleSpecialLeaveWorkLog,
  addSpecialLeaveWorkLog,
  editSpecialLeaveWorkLog,
  selectSpecialLeaveWorkLogMeta,
} from '../../resources/specialLeaveWorkLog';
import {
  addMultipleTimeOffWorkLog,
  addTimeOffWorkLog,
  editTimeOffWorkLog,
  selectTimeOffWorkLogMeta,
} from '../../resources/timeOffWorkLog';
import {
  addTrainingWorkLog,
  addMultipleTrainingWorkLog,
  editTrainingWorkLog,
  selectTrainingWorkLogMeta,
} from '../../resources/trainingWorkLog';
import {
  addMultipleVacationWorkLog,
  addVacationWorkLog,
  editVacationWorkLog,
  selectVacationWorkLogMeta,
} from '../../resources/vacationWorkLog';
import {
  addWorkLog,
  editWorkLog,
  selectAddWorkLogMeta,
} from '../../resources/workLog';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
  OVERTIME_WORK_LOG,
  selectWorkMonth,
} from '../../resources/workMonth';
import {
  getAllDays,
  getWorkingDays,
} from '../../services/dateTimeService';
import { selectConfig } from '../../resources/config';
import WorkLogFormModalComponent from './WorkLogFormModalComponent';

const mapStateToProps = (state) => ({
  config: selectConfig(state).toJS(),
  isPosting: selectBusinessTripWorkLogMeta(state).isPosting
    || selectHomeOfficeWorkLogMeta(state).isPosting
    || selectOvertimeWorkLogMeta(state).isPosting
    || selectSickDayWorkLogMeta(state).isPosting
    || selectSpecialLeaveWorkLogMeta(state).isPosting
    || selectTimeOffWorkLogMeta(state).isPosting
    || selectTrainingWorkLogMeta(state).isPosting
    || selectVacationWorkLogMeta(state).isPosting
    || selectAddWorkLogMeta(state).isPosting,
  workMonth: selectWorkMonth(state)?.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  onSave: (workLog, config) => {
    const processMultipleWorkLogs = (data) => {
      const workingDays = getAllDays(data.date, data.dateTo);
      return workingDays.map((workingDay) => ({
        ...data,
        date: workingDay,
        dateTo: undefined,
      }));
    };
    const processMultipleWorkLogsIncludingHolidays = (data) => {
      const workingDays = getWorkingDays(data.date, data.dateTo, config.supportedHolidays);
      return workingDays.map((workingDay) => ({
        ...data,
        date: workingDay,
        dateTo: undefined,
      }));
    };

    if (workLog.type === BUSINESS_TRIP_WORK_LOG) {
      const requestData = {
        date: workLog.date,
        dateTo: workLog.dateTo,
        destination: workLog.destination,
        expectedArrival: workLog.expectedArrival,
        expectedDeparture: workLog.expectedDeparture,
        plannedEndHour: workLog.plannedEndHour,
        plannedEndMinute: workLog.plannedEndMinute,
        plannedStartHour: workLog.plannedStartHour,
        plannedStartMinute: workLog.plannedStartMinute,
        purpose: workLog.purpose,
        transport: workLog.transport,
      };

      if (workLog.id) {
        return dispatch(editBusinessTripWorkLog(workLog.id, requestData));
      }

      const multipleRequestData = processMultipleWorkLogs(requestData);
      return multipleRequestData.length > 1
        ? dispatch(addMultipleBusinessTripWorkLog(multipleRequestData))
        : dispatch(addBusinessTripWorkLog(requestData));
    } if (workLog.type === HOME_OFFICE_WORK_LOG) {
      const requestData = {
        comment: workLog.comment,
        date: workLog.date,
        dateTo: workLog.dateTo,
        plannedEndHour: workLog.plannedEndHour,
        plannedEndMinute: workLog.plannedEndMinute,
        plannedStartHour: workLog.plannedStartHour,
        plannedStartMinute: workLog.plannedStartMinute,
      };

      if (workLog.id) {
        return dispatch(editHomeOfficeWorkLog(workLog.id, requestData));
      }

      const multipleRequestData = processMultipleWorkLogs(requestData);
      return multipleRequestData.length > 1
        ? dispatch(addMultipleHomeOfficeWorkLog(multipleRequestData))
        : dispatch(addHomeOfficeWorkLog(requestData));
    } if (workLog.type === OVERTIME_WORK_LOG) {
      const requestData = {
        date: workLog.date,
        reason: workLog.reason,
      };

      if (workLog.id) {
        return dispatch(editOvertimeWorkLog(workLog.id, requestData));
      }

      return dispatch(addOvertimeWorkLog(requestData));
    } if (workLog.type === SICK_DAY_WORK_LOG) {
      const requestData = {
        childDateOfBirth: workLog.childDateOfBirth,
        childName: workLog.childName,
        date: workLog.date,
        dateTo: workLog.dateTo,
        variant: workLog.variant,
      };

      if (workLog.id) {
        return dispatch(editSickDayWorkLog(workLog.id, requestData));
      }

      const multipleRequestData = processMultipleWorkLogsIncludingHolidays(requestData);
      return multipleRequestData.length > 1
        ? dispatch(addMultipleSickDayWorkLog(multipleRequestData))
        : dispatch(addSickDayWorkLog(requestData));
    } if (workLog.type === SPECIAL_LEAVE_WORK_LOG) {
      const requestData = {
        date: workLog.date,
        dateTo: workLog.dateTo,
        reason: workLog.reason,
      };

      if (workLog.id) {
        return dispatch(editSpecialLeaveWorkLog(workLog.id, requestData));
      }

      const multipleRequestData = processMultipleWorkLogsIncludingHolidays(requestData);
      return multipleRequestData.length > 1
        ? dispatch(addMultipleSpecialLeaveWorkLog(multipleRequestData))
        : dispatch(addSpecialLeaveWorkLog(requestData));
    } if (workLog.type === TIME_OFF_WORK_LOG) {
      const requestData = {
        comment: workLog.comment,
        date: workLog.date,
        dateTo: workLog.dateTo,
      };

      if (workLog.id) {
        return dispatch(editTimeOffWorkLog(workLog.id, requestData));
      }

      const multipleRequestData = processMultipleWorkLogsIncludingHolidays(requestData);
      return multipleRequestData.length > 1
        ? dispatch(addMultipleTimeOffWorkLog(multipleRequestData))
        : dispatch(addTimeOffWorkLog(requestData));
    } if (workLog.type === TRAINING_WORK_LOG) {
      const requestData = {
        comment: workLog.comment,
        date: workLog.date,
        dateTo: workLog.dateTo,
        title: workLog.title,
      };

      if (workLog.id) {
        return dispatch(editTrainingWorkLog(workLog.id, requestData));
      }

      const multipleRequestData = processMultipleWorkLogs(requestData);
      return multipleRequestData.length > 1
        ? dispatch(addMultipleTrainingWorkLog(multipleRequestData))
        : dispatch(addTrainingWorkLog(requestData));
    } if (workLog.type === VACATION_WORK_LOG) {
      const requestData = {
        date: workLog.date,
        dateTo: workLog.dateTo,
      };

      if (workLog.id) {
        return dispatch(editVacationWorkLog(workLog.id, requestData));
      }

      const multipleRequestData = processMultipleWorkLogsIncludingHolidays(requestData);
      return multipleRequestData.length > 1
        ? dispatch(addMultipleVacationWorkLog(multipleRequestData))
        : dispatch(addVacationWorkLog(requestData));
    } if (workLog.type === WORK_LOG) {
      const requestData = {
        endTime: workLog.endTime,
        startTime: workLog.startTime,
      };

      if (workLog.id) {
        return dispatch(editWorkLog(workLog.id, requestData));
      }

      return dispatch(addWorkLog(requestData));
    }
    throw new Error(`Unknown type ${workLog.type}`);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogFormModalComponent);
