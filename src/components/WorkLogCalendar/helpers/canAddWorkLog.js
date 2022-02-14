import {
  STATUS_OPENED, STATUS_WAITING_FOR_APPROVAL,
} from '../../../resources/workMonth';

export const canAddWorkLog = (workMonth, supervisorView) => !supervisorView
  && (
    workMonth.status === STATUS_OPENED
    || workMonth.status === STATUS_WAITING_FOR_APPROVAL
  );
