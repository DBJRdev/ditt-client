import { connect } from 'react-redux';
import {
  fetchConfig,
  saveConfig,
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
  saveConfig: data => dispatch(saveConfig(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
