import React from 'react';
import { TITLE } from '../../../config/envspecific';
import LogoSvg from './images/logo.svg';
import styles from './styles.scss';

const LogoComponent = () => (
  <LogoSvg
    alt={TITLE}
    className={styles.logo}
    height={85}
    width={183}
  />
);

export default LogoComponent;
