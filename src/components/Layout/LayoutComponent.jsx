import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Header } from '../Header';
import { Footer } from '../Footer';
import styles from './styles.scss';

const LayoutComponent = ({
  children,
  loading,
  setLogoutLocally,
  t,
  title,
  token,
  user,
}) => {
  useEffect(() => {
    const jwtTokenTimer = setInterval(() => {
      if (token && ((token.exp * 1000) - Date.now()) < 0) {
        setLogoutLocally();
        clearInterval(jwtTokenTimer);
      }
    }, 15000);

    return () => {
      clearInterval(jwtTokenTimer);
    };
  }, [setLogoutLocally, token]);

  return (
    <div>
      <Header user={user} />
      <main className={styles.main}>
        <div className={styles.body}>
          {title && (
            <h1 className={styles.bodyTitle}>{title}</h1>
          )}
          {loading ? t('general:text.loading') : children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

LayoutComponent.defaultProps = {
  children: null,
  loading: false,
  title: null,
};

LayoutComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  loading: PropTypes.bool,
  setLogoutLocally: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  title: PropTypes.string,
  token: PropTypes.shape({
    exp: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default withTranslation()(LayoutComponent);
