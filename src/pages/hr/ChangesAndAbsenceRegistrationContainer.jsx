import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchConfig,
  selectConfig,
  selectConfigMeta,
} from '../../resources/config';
import {
  fetchChangesAndAbsenceRegistrations,
  selectChangesAndAbsenceRegistrations,
  selectChangesAndAbsenceRegistrationsMeta,
} from '../../resources/hr';
import Component from './ChangesAndAbsenceRegistrationComponent';

const mapStateToProps = (state) => {
  const changesAndAbsenceRegistrationsMeta = selectChangesAndAbsenceRegistrationsMeta(state);
  const configMeta = selectConfigMeta(state);

  return ({
    changesAndAbsenceRegistrations: selectChangesAndAbsenceRegistrations(state),
    config: selectConfig(state)?.toJS(),
    isFetching: configMeta.isFetching || changesAndAbsenceRegistrationsMeta.isFetching,
    token: selectJwtToken(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchChangesAndAbsenceRegistrations: (data) => dispatch(
    fetchChangesAndAbsenceRegistrations(data),
  ),
  fetchConfig: () => dispatch(fetchConfig()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
