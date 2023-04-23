import { createSelector } from 'reselect';

const getContract = (state) => state.getIn(['contract', 'contract']);
const getContractList = (state) => state.getIn(['contract', 'contractList']);

export const selectContractMeta = createSelector([getContract], (data) => ({
  isPosting: data.get('isPosting'),
  isPostingFailure: data.get('isPostingFailure'),
}));

export const selectContractList = createSelector([getContractList], (data) => data.get('data'));
export const selectContractListMeta = createSelector([getContractList], (data) => ({
  isFetching: data.get('isFetching'),
  isFetchingFailure: data.get('isFetchingFailure'),
}));
