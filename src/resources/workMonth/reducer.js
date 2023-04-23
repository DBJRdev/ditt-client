import Immutable from 'immutable';
import {
  transformSpecialApprovals,
  transformWorkMonth,
  transformWorkMonthDetail,
} from './dataTransformers';
import initialState from './initialState';
import * as actionTypes from './actionTypes';

export default (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  const {
    payload,
    type,
  } = action;

  if (type === actionTypes.FETCH_RECENT_SPECIAL_APPROVAL_LIST_REQUEST) {
    return state
      .setIn(['recentSpecialApprovalList', 'isFetching'], true)
      .setIn(['recentSpecialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_RECENT_SPECIAL_APPROVAL_LIST_SUCCESS) {
    return state
      .setIn(['recentSpecialApprovalList', 'data'], Immutable.fromJS(transformSpecialApprovals(payload)))
      .setIn(['recentSpecialApprovalList', 'isFetching'], false)
      .setIn(['recentSpecialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_RECENT_SPECIAL_APPROVAL_LIST_FAILURE) {
    return state
      .setIn(['recentSpecialApprovalList', 'data'], null)
      .setIn(['recentSpecialApprovalList', 'isFetching'], false)
      .setIn(['recentSpecialApprovalList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_SPECIAL_APPROVAL_LIST_REQUEST) {
    return state
      .setIn(['specialApprovalList', 'isFetching'], true)
      .setIn(['specialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SPECIAL_APPROVAL_LIST_SUCCESS) {
    return state
      .setIn(['specialApprovalList', 'data'], Immutable.fromJS(transformSpecialApprovals(payload)))
      .setIn(['specialApprovalList', 'isFetching'], false)
      .setIn(['specialApprovalList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_SPECIAL_APPROVAL_LIST_FAILURE) {
    return state
      .setIn(['specialApprovalList', 'data'], null)
      .setIn(['specialApprovalList', 'isFetching'], false)
      .setIn(['specialApprovalList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_REQUEST) {
    return state
      .setIn(['workMonth', 'isFetching'], true)
      .setIn(['workMonth', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(transformWorkMonthDetail(payload)))
      .setIn(['workMonth', 'isFetching'], false)
      .setIn(['workMonth', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_FAILURE) {
    return state
      .setIn(['workMonth', 'data'], null)
      .setIn(['workMonth', 'isFetching'], false)
      .setIn(['workMonth', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_REQUEST) {
    return state
      .setIn(['workMonthList', 'isFetching'], true)
      .setIn(['workMonthList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_SUCCESS) {
    return state
      .setIn(['workMonthList', 'data'], Immutable.fromJS(payload.map(transformWorkMonth)))
      .setIn(['workMonthList', 'isFetching'], false)
      .setIn(['workMonthList', 'isFetchingFailure'], false);
  }

  if (type === actionTypes.FETCH_WORK_MONTH_LIST_FAILURE) {
    return state
      .setIn(['workMonthList', 'data'], Immutable.fromJS([]))
      .setIn(['workMonthList', 'isFetching'], false)
      .setIn(['workMonthList', 'isFetchingFailure'], true);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(transformWorkMonthDetail(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_APPROVED_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(transformWorkMonthDetail(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.MARK_WORK_MONTH_WAITING_FOR_APPROVAL_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  if (type === actionTypes.SET_WORK_TIME_CORRECTION_REQUEST) {
    return state
      .setIn(['workMonth', 'isPosting'], true)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SET_WORK_TIME_CORRECTION_SUCCESS) {
    return state
      .setIn(['workMonth', 'data'], Immutable.fromJS(transformWorkMonthDetail(payload)))
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], false);
  }

  if (type === actionTypes.SET_WORK_TIME_CORRECTION_FAILURE) {
    return state
      .setIn(['workMonth', 'isPosting'], false)
      .setIn(['workMonth', 'isPostingFailure'], true);
  }

  return state;
};
