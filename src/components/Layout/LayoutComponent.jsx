import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Loader } from '../Loader';
import GlobalProvider from '../../providers/global/GlobalProvider';
import styles from './styles.scss';

const LayoutComponent = ({
  children,
  loading,
  setLogoutLocally,
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
          <GlobalProvider user={user}>
            {title && (
              <h1 className={styles.bodyTitle}>{title}</h1>
            )}
            {
              loading
                ? <Loader />
                : children
            }
          </GlobalProvider>
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

export default LayoutComponent;
