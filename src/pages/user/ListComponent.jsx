import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Table,
} from 'react-ui';
import { Link } from 'react-router-dom';
import routes from '../../routes';
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
    this.props.fetchUserList({
      order: {
        column: this.state.tableSortColumn,
        direction: this.state.tableSortDirection,
      },
    });
  }

  render() {
    return (
      <Layout title="Users" loading={this.props.isFetching}>
        <Button
          clickHandler={() => this.props.history.push(routes.addUser)}
          label="Add user"
          priority="primary"
        />
        <Table
          columns={[
            {
              format: row => (
                /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                <Link to={routes.editUser.replace(':id', row.id)}>
                  {row.firstName} {row.lastName}
                </Link>
              ),
              isSortable: true,
              label: 'Name',
              name: 'lastName',
            },
            {
              format: (row) => {
                if (row.supervisor) {
                  return `${row.supervisor.firstName} ${row.supervisor.lastName}`;
                }

                return '-';
              },
              isSortable: true,
              label: 'Supervisor',
              name: 'supervisor.lastName',
            },
            {
              format: () => '-',
              isSortable: false,
              label: 'Hours per current month',
              name: 'hoursPerCurrentMonth',
            },
          ]}
          rows={this.props.userList.toJS()}
          sort={{
            changeHandler: (column, direction) => {
              const orderDirection = direction === 'asc' ? 'desc' : 'asc';

              this.props.fetchUserList({
                order: {
                  column,
                  direction: orderDirection,
                },
              }).then(() => {
                this.setState({
                  tableSortColumn: column,
                  tableSortDirection: orderDirection,
                });
              });
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
  fetchUserList: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  userList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  })).isRequired,
};

export default ListComponent;
