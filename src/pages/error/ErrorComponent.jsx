import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from 'react-i18next';

const ErrorComponent = props => (
  <div>
    <h1>{props.t('error:title')}</h1>
    <p>{props.t('error:description')}</p>
  </div>
);

ErrorComponent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(ErrorComponent);
