import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import {
  Button,
  Modal,
} from 'react-ui';
import { withNamespaces } from 'react-i18next';
import { ROLE_EMPLOYEE } from '../../resources/user';
import { getWorkHoursString } from '../../services/workHoursService';
import Layout from '../../components/Layout';
import routes from '../../routes';
import styles from './user.scss';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiTokenDialogOpened: false,
    };
  }

  componentDidMount() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        const loggedUserId = decodedToken.uid;

        this.props.fetchConfig();
        this.props.fetchUser(loggedUserId);
        this.props.fetchWorkHoursList(loggedUserId);
      }
    }
  }

  getRequiredHours(year) {
    const { workHours } = this.props;
    const selectedWorkHours = [];

    workHours.forEach((workHoursItem) => {
      if (workHoursItem.get('year') === year) {
        selectedWorkHours[workHoursItem.get('month') - 1] = getWorkHoursString(workHoursItem.get('requiredHours'));
      }
    });

    return selectedWorkHours;
  }

  render() {
    const {
      config,
      isPosting,
      renewUserApiToken,
      resetUserApiToken,
      t,
      user,
      workHours,
    } = this.props;
    const { apiTokenDialogOpened } = this.state;

    return (
      <Layout title={t('user:title.profile')} loading={this.props.isFetching}>
        {
          config && user && workHours
          && (
            <div className={styles.profileTableWrap}>
              <table className={styles.profileTable}>
                <tbody>
                  <tr>
                    <td className={styles.profileTableTitle}>
                      {t('user:element.firstName')}
                    </td>
                    <td className={styles.profileTableValue}>
                      {user.get('firstName')}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.profileTableTitle}>
                      {t('user:element.lastName')}
                    </td>
                    <td className={styles.profileTableValue}>
                      {user.get('lastName')}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.profileTableTitle}>
                      {t('user:element.supervisor')}
                    </td>
                    <td className={styles.profileTableValue}>
                      {
                      user.get('supervisor')
                        ? `${user.getIn(['supervisor', 'firstName'])} ${user.getIn(['supervisor', 'lastName'])}`
                        : '-'
                    }
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.profileTableTitle}>
                      {t('user:element.email')}
                    </td>
                    <td className={styles.profileTableValue}>
                      {user.get('email')}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.profileTableTitle}>
                      {t('user:element.employeeId')}
                    </td>
                    <td className={styles.profileTableValue}>
                      {user.get('employeeId')}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} />
                  </tr>
                  <tr>
                    <td className={styles.profileTableTitle}>
                      {t('user:element.apiToken')}
                    </td>
                    <td className={styles.profileTableValue}>
                      {!user.get('apiToken') && '-'}
                      {!!user.get('apiToken') && (
                        <Button
                          clickHandler={() => this.setState({ apiTokenDialogOpened: true })}
                          icon="open_in_new"
                          labelVisibility="none"
                          label={t('user:action.showApiToken')}
                          priority="primary"
                          size="small"
                        />
                      )}
                      <div className={styles.apiTokenButtonsWrapper}>
                        <div className={styles.apiTokenButton}>
                          <Button
                            clickHandler={() => renewUserApiToken(user.get('id'))}
                            icon="autorenew"
                            labelVisibility="none"
                            label={t('user:action.renewApiToken')}
                            loading={isPosting}
                            priority="primary"
                            size="small"
                          />
                        </div>
                        {!!user.get('apiToken') && (
                          <div className={styles.apiTokenButton}>
                            <Button
                              clickHandler={() => resetUserApiToken(user.get('id'))}
                              icon="clear"
                              labelVisibility="none"
                              label={t('user:action.resetApiToken')}
                              loading={isPosting}
                              priority="primary"
                              size="small"
                              variant="danger"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {(user.get('roles') && user.get('roles').includes(ROLE_EMPLOYEE)) && (
                    <tr>
                      <td className={styles.profileTableTitle}>
                        {t('user:text.fastAccess')}
                      </td>
                      <td className={styles.profileTableValue}>
                        {!user.get('apiToken') && '-'}
                        {!!user.get('apiToken') && (
                          <a href={routes.fastAccessAddWorkLog.replace(':apiToken', user.get('apiToken'))}>
                            {t('user:text.addWorkLog')}
                          </a>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h3 className={styles.vacationDaysTitle}>{t('user:text.vacationDays')}</h3>
              <div className={styles.responsiveTable}>
                <table className={styles.vacationTable}>
                  <thead>
                    <tr>
                      <th>{t('vacation:text.year')}</th>
                      <th>{t('vacation:text.total')}</th>
                      <th>{t('vacation:text.correction')}</th>
                      <th>{t('vacation:text.used')}</th>
                      <th>{t('vacation:text.remaining')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.get('vacations') && user.get('vacations').map(vacation => (
                      <tr key={vacation.get('year')}>
                        <td className={styles.vacationTableFirstCell}>
                          {vacation.get('year')}
                        </td>
                        <td className={styles.vacationTableCell}>
                          {vacation.get('vacationDays')}
                        </td>
                        <td className={styles.vacationTableCell}>
                          {vacation.get('vacationDaysCorrection')}
                        </td>
                        <td className={styles.vacationTableCell}>
                          {vacation.get('vacationDays') + vacation.get('vacationDaysCorrection') - vacation.get('remainingVacationDays')}
                        </td>
                        <td className={styles.vacationTableCell}>
                          {vacation.get('remainingVacationDays')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className={styles.workHoursTitle}>{t('user:text.averageWorkingHoursTitle')}</h3>
              <div className={styles.responsiveTable}>
                <table className={styles.workHoursTable}>
                  <thead>
                    <tr>
                      <th />
                      {Array.from({ length: 12 }, (v, k) => k + 1).map((month => (
                        <th key={month}>
                          {month}
                        </th>
                      )))}
                    </tr>
                  </thead>
                  <tbody>
                    {config && config.get('supportedYears').map(year => (
                      <tr key={year}>
                        <td>{year}</td>
                        {this.getRequiredHours(year).map(month => (
                          <td key={shortid.generate()}>
                            {month}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {apiTokenDialogOpened && user.get('apiToken') && (
                <Modal
                  closeHandler={() => this.setState({ apiTokenDialogOpened: false })}
                  title={t('user:element.apiToken')}
                  translations={{
                    close: t('general:action.close'),
                  }}
                >
                  {user.get('apiToken')}
                </Modal>
              )}
            </div>
          )
        }
      </Layout>
    );
  }
}

ProfileComponent.defaultProps = {
  config: {},
  user: null,
};

ProfileComponent.propTypes = {
  config: ImmutablePropTypes.mapContains({}),
  fetchConfig: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchWorkHoursList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  renewUserApiToken: PropTypes.func.isRequired,
  resetUserApiToken: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: ImmutablePropTypes.mapContains({
    apiToken: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    lastName: PropTypes.string.isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
    vacations: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      vacationDays: PropTypes.number.isRequired,
      vacationDaysCorrection: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    })).isRequired,
  }),
  workHours: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default withNamespaces()(ProfileComponent);
