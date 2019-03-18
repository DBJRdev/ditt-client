import moment from 'moment-timezone';
import jwt from 'jsonwebtoken';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Table,
} from 'react-ui';
import { Link } from 'react-router-dom';
import routes from '../../routes';
import Layout from '../../components/Layout';
import { ROLE_SUPER_ADMIN } from '../../resources/user';
import { toHourMinuteFormatFromInt } from '../../services/dateTimeService';
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
    const { t } = this.props;
    const year = moment().year();
    const columns = [
      {
        format: row => (
          /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
          <Link to={routes.editUser.replace(':id', row.id)}>
            {row.firstName}
            {' '}
            {row.lastName}
          </Link>
        ),
        isSortable: true,
        label: t('user:element.name'),
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
        label: t('user:element.supervisor'),
        name: 'supervisor.lastName',
      },
      {
        format: (row) => {
          if (row.yearStats) {
            const userYearStats = row.yearStats.filter(stats => stats.year === year)[0];

            if (userYearStats) {
              return `${toHourMinuteFormatFromInt(userYearStats.workedHours)}/${toHourMinuteFormatFromInt(userYearStats.requiredHours)}`;
            }
          }

          return '0:00/0:00';
        },
        isSortable: false,
        label: t('user:element.workedAndRequiredHours'),
        name: 'requiredWorkedHours',
      },
      {
        format: (row) => {
          const vacation = row.vacations.filter(vacationItem => vacationItem.year === year)[0];

          if (row.yearStats) {
            const userYearStats = row.yearStats.filter(stats => stats.year === year)[0];

            if (userYearStats && vacation) {
              return `${userYearStats.vacationDaysUsed}/${vacation.vacationDays + vacation.vacationDaysCorrection}`;
            }
          }

          return `0/${vacation.vacationDays}`;
        },
        isSortable: false,
        label: t('user:element.vacationDaysUsed'),
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
              {t('user:action.showWorkLog')}
            </Link>
          ),
          label: t('user:action.showWorkLog'),
          name: 'showWorkLog',
        });
      }
    }

    return (
      <Layout title={t('user:title.users')} loading={this.props.isFetching}>
        <div className={styles.actions}>
          <Button
            clickHandler={() => this.props.history.push(routes.addUser)}
            label={t('user:action.addUser')}
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
  t: PropTypes.func.isRequired,
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

export default withNamespaces()(ListComponent);
