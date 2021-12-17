import { connect } from 'react-redux';
import { logout } from '../../resources/auth';
import HeaderComponent from './HeaderComponent';

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(
  null,
  mapDispatchToProps,
)(HeaderComponent);
