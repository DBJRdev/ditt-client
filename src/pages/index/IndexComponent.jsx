import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLogCalendar from '../../components/WorkLogCalendar';

class IndexComponent extends React.Component {
  componentDidMount() {
    this.props.fetchWorkLogList();
  }

  render() {
    return (
      <div>
        <h2>Work log</h2>
        {this.props.isFetching ? 'Loading...' : <WorkLogCalendar workLogList={this.props.workLogList} />}
      </div>
    );
  }
}

IndexComponent.propTypes = {
  fetchWorkLogList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  workLogList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default IndexComponent;
