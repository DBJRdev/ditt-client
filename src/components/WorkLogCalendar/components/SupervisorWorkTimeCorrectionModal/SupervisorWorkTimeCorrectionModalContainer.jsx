import { connect } from 'react-redux';
import {
  selectWorkMonth,
  selectWorkMonthMeta,
  setWorkTimeCorrection,
} from '../../../../resources/workMonth';
import SupervisorWorkTimeCorrectionModalComponent from './SupervisorWorkTimeCorrectionModalComponent';

const mapStateToProps = (state) => {
  const workMonthMeta = selectWorkMonthMeta(state);

  return ({
    isPosting: workMonthMeta.isPosting,
    workMonth: selectWorkMonth(state).toJS(),
  });
};

const mapDispatchToProps = (dispatch) => ({
  setWorkTimeCorrection: (id, data) => dispatch(setWorkTimeCorrection(id, data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SupervisorWorkTimeCorrectionModalComponent);
