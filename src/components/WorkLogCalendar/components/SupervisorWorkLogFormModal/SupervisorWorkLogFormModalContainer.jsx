import { connect } from 'react-redux';
import {
  BAN_WORK_LOG,
  MATERNITY_PROTECTION_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG, selectWorkMonth,
  SICK_DAY_UNPAID_WORK_LOG,
} from '../../../../resources/workMonth';
import {
  addMultipleBanWorkLogs,
  editBanWorkLog,
  selectBanWorkLogMeta,
} from '../../../../resources/banWorkLog';
import {
  addMultipleMaternityProtectionWorkLogs,
  editMaternityProtectionWorkLog,
  selectMaternityProtectionWorkLogMeta,
} from '../../../../resources/maternityProtectionWorkLog';
import {
  addMultipleParentalLeaveWorkLogs,
  editParentalLeaveWorkLog,
  selectParentalLeaveWorkLogMeta,
} from '../../../../resources/parentalLeaveWorkLog';
import {
  addMultipleSickDayUnpaidWorkLogs,
  editSickDayUnpaidWorkLog,
  selectSickDayUnpaidWorkLogMeta,
} from '../../../../resources/sickDayUnpaidWorkLog';
import { getWorkingDays } from '../../../../services/dateTimeService';
import { selectConfig } from '../../../../resources/config';
import WorkLogFormModalComponent from './SupervisorWorkLogFormModalComponent';

const mapStateToProps = (state) => ({
  config: selectConfig(state).toJS(),
  isPosting: selectBanWorkLogMeta(state).isPosting
    || selectMaternityProtectionWorkLogMeta(state).isPosting
    || selectParentalLeaveWorkLogMeta(state).isPosting
    || selectSickDayUnpaidWorkLogMeta(state).isPosting,
  workMonth: selectWorkMonth(state)?.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  onSave: (workLog, config, contracts) => {
    const requestData = { ...workLog };

    if (workLog.id == null) {
      const workingDays = getWorkingDays(workLog.date, workLog.dateTo, config.supportedHolidays, contracts);
      requestData.workLogs = workingDays.map((workingDay) => ({ date: workingDay }));
    }

    requestData.dateTo = undefined;
    requestData.workTimeLimit = undefined;

    if (BAN_WORK_LOG === workLog.type) {
      requestData.workTimeLimit = workLog.workTimeLimit;

      if (workLog.id) {
        return dispatch(editBanWorkLog(
          workLog.id,
          {
            ...requestData,
            workTimeLimit: workLog.workTimeLimit,
          },
        ));
      }

      return dispatch(addMultipleBanWorkLogs({
        ...requestData,
        workTimeLimit: workLog.workTimeLimit,
      }));
    }

    if (MATERNITY_PROTECTION_WORK_LOG === workLog.type) {
      if (workLog.id) {
        return dispatch(editMaternityProtectionWorkLog(workLog.id, requestData));
      }

      return dispatch(addMultipleMaternityProtectionWorkLogs(requestData));
    }

    if (PARENTAL_LEAVE_WORK_LOG === workLog.type) {
      if (workLog.id) {
        return dispatch(editParentalLeaveWorkLog(workLog.id, requestData));
      }

      return dispatch(addMultipleParentalLeaveWorkLogs(requestData));
    }

    if (SICK_DAY_UNPAID_WORK_LOG === workLog.type) {
      if (workLog.id) {
        return dispatch(editSickDayUnpaidWorkLog(workLog.id, requestData));
      }

      return dispatch(addMultipleSickDayUnpaidWorkLogs(requestData));
    }

    throw new Error(`Unknown type ${workLog.type}`);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkLogFormModalComponent);
