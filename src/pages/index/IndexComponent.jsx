import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

class IndexComponent extends React.Component {
  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    if (this.props.isFetching) {
      return 'Loading...';
    }

    return (
      <div>
        <h1>{this.props.data.get('title')}</h1>
        <p>{this.props.data.get('description')}</p>
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
