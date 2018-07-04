import Immutable from 'immutable';

let jwt = null;
if (window.localStorage) {
  jwt = localStorage.getItem('jwt');
}

export default Immutable.fromJS({
  jwt: {
    isPosting: false,
    isPostingFailure: false,
    token: jwt || null,
  },
  resetPassword: {
    isPosting: false,
    isPostingFailure: false,
  },
  setNewPassword: {
    isPosting: false,
    isPostingFailure: false,
  },
});
