import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLogCalendar from '../../components/WorkLogCalendar';

class IndexComponent extends React.Component {
  componentDidMount() {
    this.props.fetchWorkLogList(this.props.uid);
  }

  render() {
    return (
      <div>
        <button onClick={this.props.logout}>Logout</button>
        <h2>Work log</h2>
        {
          this.props.isFetchingWorkLogList
          ? 'Loading...'
          : (
            <WorkLogCalendar
              addWorkLog={this.props.addWorkLog}
              deleteWorkLog={this.props.deleteWorkLog}
              isPostingWorkLog={this.props.isPostingWorkLog}
              workLogList={this.props.workLogList}
            />
          )
        }
      </div>
    );
  }
}

IndexComponent.propTypes = {
  addWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  fetchWorkLogList: PropTypes.func.isRequired,
  isFetchingWorkLogList: PropTypes.bool.isRequired,
  isPostingWorkLog: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  uid: PropTypes.number.isRequired,
  workLogList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default IndexComponent;
