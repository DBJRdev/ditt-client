import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  TITLE,
  VERSION,
} from '../../../config/envspecific';
import styles from './styles.scss';

const LayoutComponent = ({ t }) => (
  <footer className={styles.footer}>
    <p>
      {TITLE}
      {VERSION && (
        <>
          {' | '}
          {t('layout:text.lastUpdate', { date: VERSION || '' })}
        </>
      )}
    </p>
  </footer>
);

LayoutComponent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(LayoutComponent);
