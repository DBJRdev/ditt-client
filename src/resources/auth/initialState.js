import Immutable from 'immutable';

let jwt = null;
if (window.localStorage) {
  jwt = localStorage.getItem('jwt');
}

export default Immutable.fromJS({
  isLoggedOutLocally: false,
  jwt: {
    isPosting: false,
    isPostingFailure: false,
    token: jwt || null,
  },
  lastRequestBrowserTime: null,
  resetPassword: {
    isPosting: false,
    isPostingFailure: false,
  },
  setNewPassword: {
    isPosting: false,
    isPostingFailure: false,
  },
});
