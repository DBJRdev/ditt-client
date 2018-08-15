import moment from 'moment-timezone';
import jwt from 'jsonwebtoken';
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
import { ROLE_SUPER_ADMIN } from '../../resources/user';
import styles from './user.scss';

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
    const year = moment().year();
    const columns = [
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
        format: (row) => {
          const userYearStats = row.yearStats.filter(stats => stats.year === year)[0];

          return `${Math.round(userYearStats.workedHours * 10) / 10}/${userYearStats.requiredHours}`;
        },
        isSortable: false,
        label: 'Worked / Required hours',
        name: 'requiredWorkedHours',
      },
      {
        format: row =>
          `${row.yearStats.filter(stats => stats.year === year)[0].vacationDaysUsed}/${row.vacationDays}`,
        isSortable: false,
        label: 'Vacation days used',
        name: 'vacationDaysUsed',
      },
    ];

    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken && decodedToken.roles.some(role => ROLE_SUPER_ADMIN === role)) {
        columns.push({
          format: row => (
            /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
            <Link to={routes.supervisedUserWorkLog.replace(':id', row.id)}>
              Show work log
            </Link>
          ),
          label: 'Show work log',
          name: 'showWorkLog',
        });
      }
    }

    return (
      <Layout title="Users" loading={this.props.isFetching}>
        <div className={styles.actions}>
          <Button
            clickHandler={() => this.props.history.push(routes.addUser)}
            label="Add user"
            priority="primary"
          />
        </div>
        <Table
          columns={columns}
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
  token: PropTypes.string.isRequired,
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
