import React from 'react';
import PropTypes from 'prop-types';
import decode from 'jsonwebtoken/decode';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../../../routes';
import { selectJwtToken } from '..';

class AuthorizedRoute extends Route {
  static isAuthorized(token, roles) {
    if (token) {
      const decodedToken = decode(token);

      if (decodedToken) {
        return decodedToken.roles.some((role) => roles.includes(role));
      }
    }

    return false;
  }

  render() {
    if (AuthorizedRoute.isAuthorized(this.props.token, this.props.roles)) {
      return (
        <Route
          exact={this.props.exact}
          path={this.props.path}
          component={this.props.component}
        />
      );
    }

    return <Redirect to={routes.login} />;
  }
}

AuthorizedRoute.defaultProps = {
  exact: false,
  token: null,
};

AuthorizedRoute.propTypes = {
  component: PropTypes.shape({}).isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string,
};

const mapStateToProps = (state) => ({
  token: selectJwtToken(state),
});

export default connect(mapStateToProps)(AuthorizedRoute);
