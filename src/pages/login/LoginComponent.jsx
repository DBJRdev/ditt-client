import PropTypes from 'prop-types';
import React from 'react';
import { Login } from 'react-ui';

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      username: null,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
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

LoginComponent.propTypes = {
  isPosting: PropTypes.bool.isRequired,
  isPostingFailure: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

export default LoginComponent;
