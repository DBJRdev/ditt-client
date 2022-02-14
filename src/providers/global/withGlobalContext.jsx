import PropTypes from 'prop-types';
import React from 'react';
import GlobalContext from './GlobalContext';

export default (Component) => {
  const WithProviderContextComponent = (props) => (
    <GlobalContext.Consumer>
      {(context) => (
        <Component
          user={context.user}
          {...props}
        />
      )}
    </GlobalContext.Consumer>
  );

  WithProviderContextComponent.defaultProps = {
    user: undefined,
  };

  WithProviderContextComponent.propTypes = {
    user: PropTypes.shape({}),
  };

  return WithProviderContextComponent;
};
