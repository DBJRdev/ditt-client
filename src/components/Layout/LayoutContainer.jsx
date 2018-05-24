import { connect } from 'react-redux';
import {
  logout,
  selectJwtToken,
} from '../../resources/auth';
import LayoutComponent from './LayoutComponent';

const mapStateToProps = state => ({
  token: selectJwtToken(state),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutComponent);

