import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { Table } from 'react-ui';
import Layout from '../../components/Layout';

class ListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableSortColumn: 'lastName',
      tableSortDirection: 'asc',
    };
  }

  componentDidMount() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        this.props.fetchSupervisedUserList(
          decodedToken.uid,
          {
            order: {
              column: this.state.tableSortColumn,
              direction: this.state.tableSortDirection,
            },
          }
        );
      }
    }
  }

  render() {
    return (
      <Layout title="Supervised users" loading={this.props.isFetching}>
        <Table
          columns={[
            {
              format: row => `${row.firstName} ${row.lastName}`,
              isSortable: true,
              label: 'Name',
              name: 'lastName',
            },
            {
              format: () => '-',
              label: 'Need approval',
              name: 'needApproval',
            },
            {
              format: () => '-',
              label: 'Show worklog',
              name: 'showWorklog',
            },
          ]}
          rows={this.props.supervisedUserList.toJS()}
          sort={{
            changeHandler: (column, direction) => {
              if (this.props.token) {
                const decodedToken = jwt.decode(this.props.token);

                if (decodedToken) {
                  const orderDirection = direction === 'asc' ? 'desc' : 'asc';

                  this.props.fetchSupervisedUserList(
                    decodedToken.uid,
                    {
                      order: {
                        column,
                        direction: orderDirection,
                      },
                    }
                  ).then(() => {
                    this.setState({
                      tableSortColumn: column,
                      tableSortDirection: orderDirection,
                    });
                  });
                }
              }
            },
            column: this.state.tableSortColumn,
            direction: this.state.tableSortDirection,
          }}
        />
      </Layout>
    );
  }
}

ListComponent.propTypes = {
  fetchSupervisedUserList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  supervisedUserList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  })).isRequired,
  token: PropTypes.string.isRequired,
};

export default ListComponent;
