import { toMomentDateTime } from '../../services/dateTimeService';
import {
  STATUS_APPROVED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../workMonth';

const resolveWorkLogStatus = (workLog) => {
  if (workLog.timeApproved) {
    return STATUS_APPROVED;
  }

  if (workLog.timeRejected) {
    return STATUS_REJECTED;
  }

  return STATUS_WAITING_FOR_APPROVAL;
};

export const transformTimeOffWorkLog = (data) => ({
  comment: data.comment,
  date: toMomentDateTime(data.date),
  id: parseInt(data.id, 10),
  rejectionMessage: data.rejectionMessage,
  status: resolveWorkLogStatus(data),
  timeApproved: data.timeApproved ? toMomentDateTime(data.timeApproved) : null,
  timeRejected: data.timeRejected ? toMomentDateTime(data.timeRejected) : null,
});
