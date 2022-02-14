import React from 'react';
import styles from './Loader.scss';

const Loader = () => (
  <div className={styles.loaderContainer}>
    <svg
      className={[styles.loader, styles.loaderRotate].join(' ')}
      viewBox="0 0 100 100"
    >
      <circle
        className={styles.loaderCircle}
        cx="50"
        cy="50"
        r="40"
      />
    </svg>
  </div>
);

export default Loader;
