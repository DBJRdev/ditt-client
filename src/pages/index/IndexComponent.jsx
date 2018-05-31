import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLogCalendar from '../../components/WorkLogCalendar';
import Layout from '../../components/Layout';

class IndexComponent extends React.Component {
  componentDidMount() {
    this.props.fetchWorkHoursList(this.props.uid);
    this.props.fetchWorkLogList(this.props.uid);
  }

  render() {
    return (
      <Layout title="Work logs" loading={this.props.isFetching}>
        <WorkLogCalendar
          addWorkLog={this.props.addWorkLog}
          deleteWorkLog={this.props.deleteWorkLog}
          isPostingWorkLog={this.props.isPosting}
          workHoursList={this.props.workHoursList}
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
  fetchWorkHoursList: PropTypes.func.isRequired,
  fetchWorkLogList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  uid: PropTypes.number,
  workHoursList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
  workLogList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default IndexComponent;
