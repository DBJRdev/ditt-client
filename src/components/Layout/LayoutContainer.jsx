import decode from 'jwt-decode';
import { connect } from 'react-redux';
import {
  setLogoutLocally,
  selectJwtToken,
} from '../../resources/auth';
import LayoutComponent from './LayoutComponent';

const mapStateToProps = (state) => {
  const token = selectJwtToken(state);
  const tokenData = token ? decode(token) : null;

  if (token != null && tokenData != null) {
    const {
      exp,
      iat,
      ...user
    } = tokenData;

    return ({
      token: {
        exp,
        iat,
        token,
      },
      user,
    });
  }

  return ({
    token: null,
    user: null,
  });
};

const mapDispatchToProps = (dispatch) => ({
  setLogoutLocally: () => dispatch(setLogoutLocally()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayoutComponent);
