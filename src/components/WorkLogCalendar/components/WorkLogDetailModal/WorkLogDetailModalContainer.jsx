import { connect } from 'react-redux';
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
  VACATION_WORK_LOG,
  WORK_LOG,
  selectWorkMonth,
} from '../../../../resources/workMonth';
import {
  deleteBanWorkLog,
  selectBanWorkLog,
  selectBanWorkLogMeta,
} from '../../../../resources/banWorkLog';
import {
  deleteBusinessTripWorkLog,
  selectBusinessTripWorkLog,
  selectBusinessTripWorkLogMeta,
} from '../../../../resources/businessTripWorkLog';
import {
  deleteHomeOfficeWorkLog,
  selectHomeOfficeWorkLog,
  selectHomeOfficeWorkLogMeta,
} from '../../../../resources/homeOfficeWorkLog';
import {
  deleteMaternityProtectionWorkLog,
  selectMaternityProtectionWorkLog,
  selectMaternityProtectionWorkLogMeta,
} from '../../../../resources/maternityProtectionWorkLog';
import {
  deleteOvertimeWorkLog,
  selectOvertimeWorkLog,
  selectOvertimeWorkLogMeta,
} from '../../../../resources/overtimeWorkLog';
import {
  deleteParentalLeaveWorkLog,
  selectParentalLeaveWorkLog,
  selectParentalLeaveWorkLogMeta,
} from '../../../../resources/parentalLeaveWorkLog';
import {
  deleteSickDayUnpaidWorkLog,
  selectSickDayUnpaidWorkLog,
  selectSickDayUnpaidWorkLogMeta,
} from '../../../../resources/sickDayUnpaidWorkLog';
import {
  deleteSickDayWorkLog,
  selectSickDayWorkLog,
  selectSickDayWorkLogMeta,
} from '../../../../resources/sickDayWorkLog';
import {
  deleteSpecialLeaveWorkLog,
  selectSpecialLeaveWorkLog,
  selectSpecialLeaveWorkLogMeta,
} from '../../../../resources/specialLeaveWorkLog';
import {
  deleteTimeOffWorkLog,
  selectTimeOffWorkLog,
  selectTimeOffWorkLogMeta,
} from '../../../../resources/timeOffWorkLog';
import {
  deleteVacationWorkLog,
  selectVacationWorkLog,
  selectVacationWorkLogMeta,
} from '../../../../resources/vacationWorkLog';
import {
  deleteWorkLog,
  selectDeleteWorkLogMeta,
  selectWorkLog,
} from '../../../../resources/workLog';
import WorkLogDetailModal from './WorkLogDetailModal';

const mapStateToProps = (state) => ({
  banWorkLog: selectBanWorkLog(state)?.toJS(),
  businessTripWorkLog: selectBusinessTripWorkLog(state)?.toJS(),
  homeOfficeWorkLog: selectHomeOfficeWorkLog(state)?.toJS(),
  isPosting: selectBanWorkLogMeta(state)?.isPosting
      || selectBusinessTripWorkLogMeta(state)?.isPosting
      || selectHomeOfficeWorkLogMeta(state)?.isPosting
      || selectMaternityProtectionWorkLogMeta(state)?.isPosting
      || selectOvertimeWorkLogMeta(state)?.isPosting
      || selectParentalLeaveWorkLogMeta(state)?.isPosting
      || selectSickDayUnpaidWorkLogMeta(state)?.isPosting
      || selectSickDayWorkLogMeta(state)?.isPosting
      || selectSpecialLeaveWorkLogMeta(state)?.isPosting
      || selectTimeOffWorkLogMeta(state)?.isPosting
      || selectVacationWorkLogMeta(state)?.isPosting
      || selectDeleteWorkLogMeta(state)?.isPosting
      || false,
  maternityProtectionWorkLog: selectMaternityProtectionWorkLog(state)?.toJS(),
  overtimeWorkLog: selectOvertimeWorkLog(state)?.toJS(),
  parentalLeaveWorkLog: selectParentalLeaveWorkLog(state)?.toJS(),
  sickDayUnpaidWorkLog: selectSickDayUnpaidWorkLog(state)?.toJS(),
  sickDayWorkLog: selectSickDayWorkLog(state)?.toJS(),
  specialLeaveWorkLog: selectSpecialLeaveWorkLog(state)?.toJS(),
  timeOffWorkLog: selectTimeOffWorkLog(state)?.toJS(),
  vacationWorkLog: selectVacationWorkLog(state)?.toJS(),
  workLog: selectWorkLog(state)?.toJS(),
  workMonth: selectWorkMonth(state)?.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  onDelete: (id, type) => {
    if (BAN_WORK_LOG === type) {
      return dispatch(deleteBanWorkLog(id));
    } if (BUSINESS_TRIP_WORK_LOG === type) {
      return dispatch(deleteBusinessTripWorkLog(id));
    } if (HOME_OFFICE_WORK_LOG === type) {
      return dispatch(deleteHomeOfficeWorkLog(id));
    } if (MATERNITY_PROTECTION_WORK_LOG === type) {
      return dispatch(deleteMaternityProtectionWorkLog(id));
    } if (OVERTIME_WORK_LOG === type) {
      return dispatch(deleteOvertimeWorkLog(id));
    } if (PARENTAL_LEAVE_WORK_LOG === type) {
      return dispatch(deleteParentalLeaveWorkLog(id));
    } if (SICK_DAY_UNPAID_WORK_LOG === type) {
      return dispatch(deleteSickDayUnpaidWorkLog(id));
    } if (SICK_DAY_WORK_LOG === type) {
      return dispatch(deleteSickDayWorkLog(id));
    } if (SPECIAL_LEAVE_WORK_LOG === type) {
      return dispatch(deleteSpecialLeaveWorkLog(id));
    } if (TIME_OFF_WORK_LOG === type) {
      return dispatch(deleteTimeOffWorkLog(id));
    } if (VACATION_WORK_LOG === type) {
      return dispatch(deleteVacationWorkLog(id));
    } if (WORK_LOG === type) {
      return dispatch(deleteWorkLog(id));
    }

    throw new Error(`Unknown type ${type}`);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogDetailModal);
