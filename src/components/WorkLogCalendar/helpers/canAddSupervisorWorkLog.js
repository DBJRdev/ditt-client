import { ROLE_SUPER_ADMIN } from '../../../resources/user';
import {
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../../resources/workMonth';

export const canAddSupervisorWorkLog = (workMonth, supervisorView, user) => supervisorView
  && user.roles.includes(ROLE_SUPER_ADMIN)
  && (user.uid !== workMonth.user.id)
  && (workMonth.status === STATUS_OPENED || workMonth.status === STATUS_WAITING_FOR_APPROVAL);
