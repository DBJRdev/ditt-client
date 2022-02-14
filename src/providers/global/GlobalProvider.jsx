import PropTypes from 'prop-types';
import React from 'react';
import GlobalContext from './GlobalContext';

const GlobalProvider = ({
  children,
  user,
}) => (
  <GlobalContext.Provider
    value={{
      user,
    }}
  >
    {children}
  </GlobalContext.Provider>
);

GlobalProvider.defaultProps = {
  children: null,
  user: null,
};

GlobalProvider.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({}),
};

export default GlobalProvider;
