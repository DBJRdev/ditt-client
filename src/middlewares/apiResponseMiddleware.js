import { setLastRequestBrowserTime } from '../resources/auth';

export default (store) => (next) => (action) => {
  if (action.type && action.type.endsWith('SUCCESS')) {
    store.dispatch(setLastRequestBrowserTime(Date.now()));
  }

  return next(action);
};
