import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLogCalendar from '../../components/WorkLogCalendar';

class IndexComponent extends React.Component {
  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    return (
      <div>
        {this.props.isFetching ? 'Loading...' : (
          <div>
            <h1>{this.props.data.get('title')}</h1>
            <p>{this.props.data.get('description')}</p>
          </div>
        )}
        <h2>Work log</h2>
        <WorkLogCalendar />
      </div>
    );
  }
}

IndexComponent.propTypes = {
  data: ImmutablePropTypes.mapContains({
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  fetchData: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default IndexComponent;
