import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { Button } from 'react-ui';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import history from '../../history';
import routes from '../../routes';

class LayoutComponent extends React.Component {
  isAuthorized(roles) {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        return decodedToken.roles.some(role => roles.includes(role));
      }
    }

    return false;
  }

  render() {
    return (
      <div>
        {this.isAuthorized([ROLE_EMPLOYEE, ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
          <div>
            {this.isAuthorized([ROLE_EMPLOYEE]) && (
              <Button
                clickHandler={() => history.push(routes.index)}
                label="Work logs"
                priority="primary"
              />
            )}
            {this.isAuthorized([ROLE_ADMIN, ROLE_SUPER_ADMIN]) && (
              <Button
                clickHandler={() => history.push(routes.userList)}
                label="Users"
                priority="primary"
              />
            )}
            <Button
              clickHandler={this.props.logout}
              label="Logout"
              priority="primary"
            />
          </div>
        )}
        <h1>{this.props.title}</h1>
        <div>
          {this.props.loading ? 'Loading ...' : this.props.children}
        </div>
      </div>
    );
  }
}

LayoutComponent.defaultProps = {
  loading: false,
  token: null,
};

LayoutComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  loading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  token: PropTypes.string,
};

export default LayoutComponent;
