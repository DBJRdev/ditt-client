import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLogCalendar from '../../components/WorkLogCalendar';
import Layout from '../../components/Layout';

class IndexComponent extends React.Component {
  componentDidMount() {
    this.props.fetchWorkLogList(this.props.uid);
  }

  render() {
    return (
      <Layout title="Work logs" loading={this.props.isFetchingWorkLogList}>
        <WorkLogCalendar
          addWorkLog={this.props.addWorkLog}
          deleteWorkLog={this.props.deleteWorkLog}
          isPostingWorkLog={this.props.isPostingWorkLog}
          workLogList={this.props.workLogList}
        />
      </Layout>
    );
  }
}

IndexComponent.defaultProps = {
  uid: null,
};

IndexComponent.propTypes = {
  addWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  fetchWorkLogList: PropTypes.func.isRequired,
  isFetchingWorkLogList: PropTypes.bool.isRequired,
  isPostingWorkLog: PropTypes.bool.isRequired,
  uid: PropTypes.number,
  workLogList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default IndexComponent;
