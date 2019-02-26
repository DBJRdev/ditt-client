import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import Layout from '../../components/Layout';

/* eslint-disable */

class SettingsComponent extends React.Component {
  componentDidMount() {
    this.props.fetchConfig();
  }

  render() {
    const { t } = this.props;
    return (
      <Layout title={t('settings:title.settings')} loading={this.props.isFetching}>

      </Layout>
    );
  }
}

SettingsComponent.defaultProps = {
  config: {},
};

SettingsComponent.propTypes = {
  config: ImmutablePropTypes.mapContains({}),
  fetchConfig: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(SettingsComponent);
