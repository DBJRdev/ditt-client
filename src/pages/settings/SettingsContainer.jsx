import { connect } from 'react-redux';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import Component from './SettingsComponent';

const mapStateToProps = (state) => {
  const configMeta = selectConfigMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: configMeta.isFetching,
    isPosting: configMeta.isPosting,
  });
};

const mapDispatchToProps = dispatch => ({
  fetchConfig: () => dispatch(fetchConfig()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
