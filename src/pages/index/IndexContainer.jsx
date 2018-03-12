import { connect } from 'react-redux';
import {
  fetchData,
  selectData,
  selectDataMeta,
} from '../../resources/global';
import IndexComponent from './IndexComponent';

const mapStateToProps = (state) => {
  const meta = selectDataMeta(state);

  return ({
    data: selectData(state),
    isFetching: meta.isFetching,
  });
};

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexComponent);
