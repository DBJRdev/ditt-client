import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchYearOverview,
  selectYearOverview,
  selectYearOverviewsMeta,
} from '../../resources/hr';
import Component from './YearOverviewComponent';

const mapStateToProps = (state) => {
  const configMeta = selectConfigMeta(state);
  const yearOverviewMeta = selectYearOverviewsMeta(state);

  return ({
    config: selectConfig(state),
    isFetching: configMeta.isFetching || yearOverviewMeta.isFetching,
    token: selectJwtToken(state),
    yearOverview: selectYearOverview(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchConfig: () => dispatch(fetchConfig()),
  fetchYearOverview: () => dispatch(fetchYearOverview()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
