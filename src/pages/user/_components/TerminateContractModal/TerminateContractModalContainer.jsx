import { connect } from 'react-redux';
import { selectContractMeta } from '../../../../resources/contract';
import TerminateContractModalComponent from './TerminateContractModalComponent';

const mapStateToProps = (state) => ({
  isPosting: selectContractMeta(state).isPosting,
});

export default connect(
  mapStateToProps,
  null,
)(TerminateContractModalComponent);
