import Immutable from 'immutable';

export default Immutable.fromJS({
  recentSpecialApprovalList: {
    data: {
      businessTripWorkLogs: [],
      homeOfficeWorkLogs: [],
      overtimeWorkLogs: [],
      sickDayWorkLogs: [],
      specialLeaveWorkLogs: [],
      timeOffWorkLogs: [],
      trainingWorkLogs: [],
      vacationWorkLogs: [],
    },
    isFetching: false,
    isFetchingFailure: false,
  },
  specialApprovalList: {
    data: {
      businessTripWorkLogs: [],
      homeOfficeWorkLogs: [],
      overtimeWorkLogs: [],
      sickDayWorkLogs: [],
      specialLeaveWorkLogs: [],
      timeOffWorkLogs: [],
      trainingWorkLogs: [],
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
