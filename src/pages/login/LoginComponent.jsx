import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { Login } from 'react-ui';
import {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  ROLE_SUPER_ADMIN,
} from '../../resources/user';
import routes from '../../routes';

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      username: null,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  componentDidMount() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        const { roles } = decodedToken;

        if (roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN)) {
          this.props.history.push(routes.userList);
        } else if (roles.includes(ROLE_EMPLOYEE)) {
          this.props.history.push(routes.index);
        }
      }
    }
  }

  onChangeHandler(field, value) {
    this.setState({
      [field]: value,
    });
  }

  render() {
    return (
      <div>
        {
          this.props.isPosting
            ? 'Loading...'
            : (
              <Login
                hasError={this.props.isPostingFailure}
                submitHandler={() => {
                  this.props.login({
                    password: this.state.password,
                    username: this.state.username,
                  });

                  return false;
                }}
                onChangeHandler={this.onChangeHandler}
                title="Login"
                usernameType="email"
              />
            )
        }
      </div>
    );
  }
}

LoginComponent.defaultProps = {
  token: null,
};

LoginComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isPosting: PropTypes.bool.isRequired,
  isPostingFailure: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  token: PropTypes.string,
};

export default LoginComponent;
