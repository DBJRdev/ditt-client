import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import styles from './styles.scss';

const LayoutComponent = ({ t }) => (
  <footer className={styles.footer}>
    <p>
      {t('layout:title')}
      {window.dittLastUpdate && (
        <>
          {' | '}
          {t('layout:text.lastUpdate', { date: window.dittLastUpdate || '' })}
        </>
      )}
    </p>
  </footer>
);

LayoutComponent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(LayoutComponent);
