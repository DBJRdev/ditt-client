import { connect } from 'react-redux';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../../../resources/workMonth';
import {
  addBusinessTripWorkLog,
  fetchBusinessTripWorkLog,
  transformBusinessTripWorkLog,
} from '../../../../resources/businessTripWorkLog';
import {
  addHomeOfficeWorkLog,
  fetchHomeOfficeWorkLog,
  transformHomeOfficeWorkLog,
} from '../../../../resources/homeOfficeWorkLog';
import {
  addOvertimeWorkLog,
  fetchOvertimeWorkLog,
  transformOvertimeWorkLog,
} from '../../../../resources/overtimeWorkLog';
import {
  addSickDayWorkLog,
  fetchSickDayWorkLog,
  transformSickDayWorkLog,
} from '../../../../resources/sickDayWorkLog';
import {
  addSpecialLeaveWorkLog,
  fetchSpecialLeaveWorkLog,
  transformSpecialLeaveWorkLog,
} from '../../../../resources/specialLeaveWorkLog';
import {
  addTimeOffWorkLog,
  fetchTimeOffWorkLog,
  transformTimeOffWorkLog,
} from '../../../../resources/timeOffWorkLog';
import {
  addTrainingWorkLog,
  fetchTrainingWorkLog,
  transformTrainingWorkLog,
} from '../../../../resources/trainingWorkLog';
import {
  addVacationWorkLog,
  fetchVacationWorkLog,
  transformVacationWorkLog,
} from '../../../../resources/vacationWorkLog';
import {
  addWorkLog, fetchWorkLog, transformWorkLog,
} from '../../../../resources/workLog';
import WorkLogDetailButton from './WorkLogDetailButtonComponent';

const mapDispatchToProps = (dispatch) => ({
  onDuplicate: async (id, type) => {
    const getDupliciteWorkLogFunction = async (addFunction, fetchFunction, transformFunction) => {
      const response = await dispatch(fetchFunction(id));
      const data = transformFunction(response.payload);
      data.id = null;
      data.date = data.date.add(1, 'days');
      data.timeApproved = null;
      data.timeRejected = null;
      data.rejectionMessage = null;

      return dispatch(addFunction(data));
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

    if (TRAINING_WORK_LOG === type) {
      return getDupliciteWorkLogFunction(
        addTrainingWorkLog,
        fetchTrainingWorkLog,
        transformTrainingWorkLog,
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
      const response = await dispatch(fetchWorkLog(id));
      const data = transformWorkLog(response.payload);
      data.startTime = data.startTime.add(1, 'days');
      data.endTime = data.endTime.add(1, 'days');

      return dispatch(addWorkLog(data));
    }

    return null;
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(WorkLogDetailButton);
