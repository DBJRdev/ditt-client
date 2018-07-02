import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { ForgotPassword } from 'react-ui';
import routes from '../../routes';
import styles from './Login.scss';
import logoImage from './images/logo.svg';

class ForgotPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
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
      <div className={styles.container}>
        <img
          src={logoImage}
          width={240}
          height={141}
          className={styles.logo}
          alt="DBJR Internal Time Tracking"
        />
        {
          this.props.isPosting
            ? 'Loading…'
            : (
              <ForgotPassword
                footer={
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <Link to={routes.login}>
                    Go to Log in
                  </Link>
                }
                hasError={this.props.isPostingFailure}
                submitHandler={() => {
                  this.props.forgotPassword({
                    email: this.state.email,
                  });

                  return false;
                }}
                onChangeHandler={this.onChangeHandler}
                title="DBJR Internal Time Tracking"
                usernameType="email"
              />
            )
        }
      </div>
    );
  }
}

ForgotPasswordComponent.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  isPosting: PropTypes.bool.isRequired,
  isPostingFailure: PropTypes.bool.isRequired,
};

export default ForgotPasswordComponent;
