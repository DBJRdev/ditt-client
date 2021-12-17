import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import LogoSvg from './images/logo.svg';
import styles from './styles.scss';

const LogoComponent = ({ t }) => (
  <LogoSvg
    alt={t('layout:title')}
    className={styles.logo}
    width={183}
    height={85}
  />
);

LogoComponent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(LogoComponent);
