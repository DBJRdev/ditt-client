import moment from 'moment-timezone';
import decode from 'jwt-decode';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Trans,
  withTranslation,
} from 'react-i18next';
import {
  Button,
  ScrollView,
  Table,
} from '@react-ui-org/react-ui';
import { Link } from 'react-router-dom';
import routes from '../../routes';
import { Icon } from '../../components/Icon';
import Layout from '../../components/Layout';
import { ROLE_SUPER_ADMIN } from '../../resources/user';
import {
  createDate,
  toHourMinuteFormatFromInt,
  toMonthFormat,
} from '../../services/dateTimeService';
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
        format: (row) => (
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
          if (row.lastApprovedWorkMonth == null) {
            return '-';
          }

          let time = null;
          if (row.yearStats) {
            const requiredHoursTotal = row.yearStats.reduce(
              (total, userYearStat) => total + userYearStat.requiredHours,
              0,
            );
            const workedHoursTotal = row.yearStats.reduce(
              (total, userYearStat) => total + userYearStat.workedHours,
              0,
            );
            time = (requiredHoursTotal - workedHoursTotal) * -1;
          }

          return (
            <Trans
              components={[
                <Link
                  to={
                    routes.supervisedUserWorkLogWithDate
                      .replace(':id', row.id)
                      .replace(':year', row.lastApprovedWorkMonth.year.year)
                      .replace(':month', row.lastApprovedWorkMonth.month)
                  }
                />,
              ]}
              i18nKey="user:element.endMonth"
              t={t}
              values={{
                month: toMonthFormat(createDate(
                  row.lastApprovedWorkMonth.year.year,
                  row.lastApprovedWorkMonth.month - 1,
                  1,
                )),
                time: time ? toHourMinuteFormatFromInt(time, true) : '-',
              }}
            />
          );
        },
        isSortable: false,
        label: t('user:element.endMonthStatus'),
        name: 'endMonth',
      },
      {
        format: (row) => {
          const vacation = row.vacations.filter((vacationItem) => vacationItem.year === year)[0];

          if (row.yearStats) {
            const userYearStats = row.yearStats.filter((stats) => stats.year === year)[0];

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
      const decodedToken = decode(this.props.token);

      if (decodedToken && decodedToken.roles.some((role) => ROLE_SUPER_ADMIN === role)) {
        columns.push({
          format: (row) => (
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
            label={t('user:action.addUser')}
            onClick={() => this.props.history.push(routes.addUser)}
          />
        </div>
        <ScrollView direction="horizontal">
          <Table
            columns={columns}
            rows={this.props.userList.toJS()}
            sort={{
              ascendingIcon: <Icon icon="arrow_upward" />,
              column: this.state.tableSortColumn,
              descendingIcon: <Icon icon="arrow_downward" />,
              direction: this.state.tableSortDirection,
              onClick: (column, direction) => {
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
            }}
          />
        </ScrollView>
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
    lastApprovedWorkMonth: PropTypes.shape({
      month: PropTypes.number.isRequired,
      requiredTime: PropTypes.number.isRequired,
      workedTime: PropTypes.number.isRequired,
      year: PropTypes.shape({
        year: PropTypes.number.isRequired,
      }).isRequired,
    }),
    lastName: PropTypes.string.isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  })).isRequired,
};

export default withTranslation()(ListComponent);
