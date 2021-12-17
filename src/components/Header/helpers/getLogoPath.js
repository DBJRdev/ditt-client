import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../../resources/user';
import routes from '../../../routes';

export const getLogoPath = (roles) => {
  if (roles.includes(ROLE_EMPLOYEE)) {
    return routes.index;
  }

  if (roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN)) {
    return routes.userList;
  }

  return routes.login;
};
