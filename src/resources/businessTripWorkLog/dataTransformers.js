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

export const transformBusinessTripWorkLog = (data) => ({
  date: toMomentDateTime(data.date),
  destination: data.destination,
  expectedArrival: data.expectedArrival,
  id: parseInt(data.id, 10),
  plannedEndHour: data.plannedEndHour.toString(),
  plannedEndMinute: data.plannedEndMinute.toString(),
  plannedStartHour: data.plannedStartHour.toString(),
  plannedStartMinute: data.plannedStartMinute.toString(),
  purpose: data.purpose,
  rejectionMessage: data.rejectionMessage,
  status: resolveWorkLogStatus(data),
  timeApproved: data.timeApproved ? toMomentDateTime(data.timeApproved) : null,
  timeRejected: data.timeRejected ? toMomentDateTime(data.timeRejected) : null,
  transport: data.transport,
});
