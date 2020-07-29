import React from 'react';
import Icon from './Icon';
import styles from './LoadingIcon.scss';

const LoadingIcon = () => (
  <div
    className={`
      ${styles.root}
      animation-spin-clockwise
    `.trim()}
  >
    <Icon icon="sync" />
  </div>
);

export default LoadingIcon;
