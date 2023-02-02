import { connect } from 'react-redux';
import {
  fetchBanWorkLog, selectBanWorkLog,
} from '../../resources/banWorkLog';
import {
  fetchBusinessTripWorkLog, selectBusinessTripWorkLog,
} from '../../resources/businessTripWorkLog';
import {
  fetchHomeOfficeWorkLog, selectHomeOfficeWorkLog,
} from '../../resources/homeOfficeWorkLog';
import {
  fetchMaternityProtectionWorkLog, selectMaternityProtectionWorkLog,
} from '../../resources/maternityProtectionWorkLog';
import {
  fetchOvertimeWorkLog, selectOvertimeWorkLog,
} from '../../resources/overtimeWorkLog';
import {
  fetchParentalLeaveWorkLog, selectParentalLeaveWorkLog,
} from '../../resources/parentalLeaveWorkLog';
import {
  fetchSickDayUnpaidWorkLog, selectSickDayUnpaidWorkLog,
} from '../../resources/sickDayUnpaidWorkLog';
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
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../resources/workMonth';
import {
  fetchSickDayWorkLog, selectSickDayWorkLog,
} from '../../resources/sickDayWorkLog';
import {
  fetchSpecialLeaveWorkLog, selectSpecialLeaveWorkLog,
} from '../../resources/specialLeaveWorkLog';
import {
  fetchTimeOffWorkLog, selectTimeOffWorkLog,
} from '../../resources/timeOffWorkLog';
import {
  fetchTrainingWorkLog,
  selectTrainingWorkLog,
} from '../../resources/trainingWorkLog';
import {
  fetchVacationWorkLog, selectVacationWorkLog,
} from '../../resources/vacationWorkLog';
import {
  fetchWorkLog, selectWorkLog,
} from '../../resources/workLog';
import WorkLogCalendarComponent from './WorkLogCalendarComponent';

const mapStateToProps = (state) => ({
  banWorkLog: selectBanWorkLog(state)?.toJS(),
  businessTripWorkLog: selectBusinessTripWorkLog(state)?.toJS(),
  homeOfficeWorkLog: selectHomeOfficeWorkLog(state)?.toJS(),
  maternityProtectionWorkLog: selectMaternityProtectionWorkLog(state)?.toJS(),
  overtimeWorkLog: selectOvertimeWorkLog(state)?.toJS(),
  parentalLeaveWorkLog: selectParentalLeaveWorkLog(state)?.toJS(),
  sickDayUnpaidWorkLog: selectSickDayUnpaidWorkLog(state)?.toJS(),
  sickDayWorkLog: selectSickDayWorkLog(state)?.toJS(),
  specialLeaveWorkLog: selectSpecialLeaveWorkLog(state)?.toJS(),
  timeOffWorkLog: selectTimeOffWorkLog(state)?.toJS(),
  trainingWorkLog: selectTrainingWorkLog(state)?.toJS(),
  vacationWorkLog: selectVacationWorkLog(state)?.toJS(),
  workLog: selectWorkLog(state)?.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  onWorkLogFetch: (id, type) => {
    if (BAN_WORK_LOG === type) {
      return dispatch(fetchBanWorkLog(id));
    }

    if (BUSINESS_TRIP_WORK_LOG === type) {
      return dispatch(fetchBusinessTripWorkLog(id));
    }

    if (HOME_OFFICE_WORK_LOG === type) {
      return dispatch(fetchHomeOfficeWorkLog(id));
    }

    if (MATERNITY_PROTECTION_WORK_LOG === type) {
      return dispatch(fetchMaternityProtectionWorkLog(id));
    }

    if (OVERTIME_WORK_LOG === type) {
      return dispatch(fetchOvertimeWorkLog(id));
    }

    if (PARENTAL_LEAVE_WORK_LOG === type) {
      return dispatch(fetchParentalLeaveWorkLog(id));
    }

    if (SICK_DAY_UNPAID_WORK_LOG === type) {
      return dispatch(fetchSickDayUnpaidWorkLog(id));
    }

    if (SICK_DAY_WORK_LOG === type) {
      return dispatch(fetchSickDayWorkLog(id));
    }

    if (SPECIAL_LEAVE_WORK_LOG === type) {
      return dispatch(fetchSpecialLeaveWorkLog(id));
    }

    if (TIME_OFF_WORK_LOG === type) {
      return dispatch(fetchTimeOffWorkLog(id));
    }

    if (TRAINING_WORK_LOG === type) {
      return dispatch(fetchTrainingWorkLog(id));
    }

    if (VACATION_WORK_LOG === type) {
      return dispatch(fetchVacationWorkLog(id));
    }

    if (WORK_LOG === type) {
      return dispatch(fetchWorkLog(id));
    }

    throw new Error(`Unknown type ${type}`);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogCalendarComponent);
