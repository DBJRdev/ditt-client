import Immutable from 'immutable';

export default Immutable.fromJS({
  data: {
    data: {
      description: '',
      title: '',
    },
    isFetching: false,
    isFetchingFailure: false,
  },
});
