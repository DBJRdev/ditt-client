import Immutable from 'immutable';

export default Immutable.fromJS({
  specialApprovalList: {
    data: {
      businessTripWorkLogs: [],
      homeOfficeWorkLogs: [],
      timeOffWorkLogs: [],
      vacationWorkLogs: [],
    },
    isFetching: false,
    isFetchingFailure: false,
  },
  workMonth: {
    data: null,
    isFetching: false,
    isFetchingFailure: false,
    isPosting: false,
    isPostingFailure: false,
  },
  workMonthList: {
    data: [],
    isFetching: false,
    isFetchingFailure: false,
  },
});
