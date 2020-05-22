import { connect } from 'react-redux';
import {
  logout,
  setLogoutLocally,
  selectJwtToken,
} from '../../resources/auth';
import LayoutComponent from './LayoutComponent';

const mapStateToProps = (state) => ({
  token: selectJwtToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  setLogoutLocally: () => dispatch(setLogoutLocally()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayoutComponent);
