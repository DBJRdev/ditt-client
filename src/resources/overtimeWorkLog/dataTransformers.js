import {
  STATUS_APPROVED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../workMonth';
import { toMomentDateTime } from '../../services/dateTimeService';

const resolveWorkLogStatus = (workLog) => {
  if (workLog.timeApproved) {
    return STATUS_APPROVED;
  }

  if (workLog.timeRejected) {
    return STATUS_REJECTED;
  }

  return STATUS_WAITING_FOR_APPROVAL;
};

export const transformOvertimeWorkLog = (data) => ({
  date: toMomentDateTime(data.date),
  id: parseInt(data.id, 10),
  reason: data.reason,
  rejectionMessage: data.rejectionMessage,
  status: resolveWorkLogStatus(data),
  timeApproved: data.timeApproved ? toMomentDateTime(data.timeApproved) : null,
  timeRejected: data.timeRejected ? toMomentDateTime(data.timeRejected) : null,
});
