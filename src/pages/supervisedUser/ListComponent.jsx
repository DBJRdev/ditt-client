import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import decode from 'jwt-decode';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import {
  Trans,
  withTranslation,
} from 'react-i18next';
import {
  ScrollView,
  Table,
} from '@react-ui-org/react-ui';
import { Icon } from '../../components/Icon';
import Layout from '../../components/Layout';
import routes from '../../routes';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../resources/workMonth';
import {
  createDate,
  toHourMinuteFormatFromInt,
  toMonthYearFormat,
} from '../../services/dateTimeService';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../../resources/sickDayWorkLog';
import styles from './supervisedUser.scss';

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
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        this.props.fetchSupervisedUserList(
          decodedToken.uid,
          {
            order: {
              column: this.state.tableSortColumn,
              direction: this.state.tableSortDirection,
            },
          },
        );
      }
    }
  }

  render() {
    const { t } = this.props;

    let uid = null;
    const year = moment().year();

    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        // eslint-disable-next-line prefer-destructuring
        uid = decodedToken.uid;
      }
    }

    const lighterRow = (row) => {
      if (!row.supervisor) {
        return styles.lighterRow;
      }

      return row.supervisor.id !== uid ? styles.lighterRow : '';
    };

    return (
      <Layout title={t('supervisedUser:title.supervisedUsers')} loading={this.props.isFetching}>
        {this.props.supervisedUserList.count() > 0 ? (
          <ScrollView direction="horizontal">
            <Table
              columns={[
                {
                  format: (row) => (
                    <span className={lighterRow(row.user)}>
                      {`${row.user.firstName} ${row.user.lastName}`}
                    </span>
                  ),
                  isSortable: true,
                  label: t('user:element.name'),
                  name: 'lastName',
                },
                {
                  format: (row) => {
                    const waitingForApproval = row.user.workMonths.filter((workMonth) => (
                      workMonth.status === STATUS_WAITING_FOR_APPROVAL
                    ));

                    if (!waitingForApproval.length) {
                      return (
                        <span className={lighterRow(row.user)}>
                          {t('general:action.no')}
                        </span>
                      );
                    }

                    const waitingForApprovalLinks = waitingForApproval.map((workMonth) => (
                      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                      <Link
                        className={styles.waitingForApprovalLink}
                        key={workMonth.id}
                        to={
                          routes.supervisedUserWorkLogWithDate
                            .replace(':id', row.user.id)
                            .replace(':year', workMonth.year)
                            .replace(':month', workMonth.month)
                        }
                      >
                        {toMonthYearFormat(createDate(workMonth.year, workMonth.month - 1, 1))}
                      </Link>
                    ));

                    return (
                      <div className={lighterRow(row.user)}>
                        {t('general:action.yes')}
                        {' | '}
                        {waitingForApprovalLinks}
                      </div>
                    );
                  },
                  label: t('supervisedUser:element.needApproval'),
                  name: 'needApproval',
                },
                {
                  format: (rowData) => rowData.sickDays
                    .filter((sickDay) => sickDay.variant === VARIANT_SICK_CHILD).length,
                  label: (
                    <>
                      {t('supervisedUser:element.sickChildTotal')}
                      <br />
                      {t('supervisedUser:element.last365Days')}
                    </>
                  ),
                  name: 'totalSickChild',
                },
                {
                  format: (rowData) => rowData.sickDays
                    .filter((sickDay) => sickDay.variant !== VARIANT_SICK_CHILD).length,
                  label: (
                    <>
                      {t('supervisedUser:element.sickDayTotal')}
                      <br />
                      {t('supervisedUser:element.last365Days')}
                    </>
                  ),
                  name: 'totalSick',
                },
                {
                  format: (row) => {
                    if (row.user.lastApprovedWorkMonth == null) {
                      return (
                        <span className={lighterRow(row.user)}>
                          -
                        </span>
                      );
                    }

                    let time = null;
                    if (row.user.yearStats) {
                      const requiredHoursTotal = row.user.yearStats.reduce(
                        (total, userYearStat) => total + userYearStat.requiredHours,
                        0,
                      );
                      const workedHoursTotal = row.user.yearStats.reduce(
                        (total, userYearStat) => total + userYearStat.workedHours,
                        0,
                      );
                      time = (requiredHoursTotal - workedHoursTotal) * -1;
                    }

                    return (
                      <span className={lighterRow(row.user)}>
                        <Trans
                          components={[
                            <Link
                              to={
                                routes.supervisedUserWorkLogWithDate
                                  .replace(':id', row.user.id)
                                  .replace(':year', row.user.lastApprovedWorkMonth.year.year)
                                  .replace(':month', row.user.lastApprovedWorkMonth.month)
                              }
                            />,
                          ]}
                          i18nKey="user:element.endMonth"
                          t={t}
                          values={{
                            month: row.user.lastApprovedWorkMonth.month,
                            time: time ? toHourMinuteFormatFromInt(time, true) : '-',
                            year: row.user.lastApprovedWorkMonth.year.year,
                          }}
                        />
                      </span>
                    );
                  },
                  isSortable: false,
                  label: t('user:element.endMonthStatus'),
                  name: 'endMonth',
                },
                {
                  format: (row) => {
                    const vacation = row.user.vacations.filter((vacationItem) => vacationItem.year.year === year)[0];

                    if (row.yearStats) {
                      const userYearStats = row.user.yearStats.filter((stats) => stats.year.year === year)[0];

                      if (userYearStats && vacation) {
                        return `${userYearStats.vacationDaysUsed}/${vacation.vacationDays + vacation.vacationDaysCorrection}`;
                      }
                    }

                    return `0/${vacation.vacationDays}`;
                  },
                  isSortable: false,
                  label: t('supervisedUser:element.vacationDaysUsed'),
                  name: 'vacationDaysUsed',
                },
                {
                  format: (row) => (
                    <span className={lighterRow(row.user)}>
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <Link to={routes.supervisedUserWorkLog.replace(':id', row.user.id)}>
                        {t('supervisedUser:action.show')}
                      </Link>
                    </span>
                  ),
                  label: t('supervisedUser:element.monthlyLogs'),
                  name: 'showWorkLog',
                },
              ]}
              rows={this.props.supervisedUserList.toJS()}
              sort={{
                ascendingIcon: <Icon icon="arrow_upward" />,
                column: this.state.tableSortColumn,
                descendingIcon: <Icon icon="arrow_downward" />,
                direction: this.state.tableSortDirection,
                onClick: (column, direction) => {
                  if (this.props.token) {
                    const decodedToken = decode(this.props.token);

                    if (decodedToken) {
                      const orderDirection = direction === 'asc' ? 'desc' : 'asc';

                      this.props.fetchSupervisedUserList(
                        decodedToken.uid,
                        {
                          order: {
                            column,
                            direction: orderDirection,
                          },
                        },
                      ).then(() => {
                        this.setState({
                          tableSortColumn: column,
                          tableSortDirection: orderDirection,
                        });
                      });
                    }
                  }
                },
              }}
            />
          </ScrollView>
        ) : (
          <div>
            {t('supervisedUser:text.emptyList')}
          </div>
        )}
      </Layout>
    );
  }
}

ListComponent.propTypes = {
  fetchSupervisedUserList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  supervisedUserList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    sickDays: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      variant: PropTypes.oneOf([
        VARIANT_SICK_CHILD,
        VARIANT_WITH_NOTE,
        VARIANT_WITHOUT_NOTE,
      ]).isRequired,
    })),
    user: ImmutablePropTypes.mapContains({
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
      workMonths: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
        status: PropTypes.oneOf([
          STATUS_APPROVED,
          STATUS_OPENED,
          STATUS_WAITING_FOR_APPROVAL,
        ]).isRequired,
      })).isRequired,
    }),
  })).isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default withTranslation()(ListComponent);
