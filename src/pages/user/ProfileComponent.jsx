import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import {
  Button,
  CheckboxField,
  Icon,
  Modal,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
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
      notifications: {
        isInit: false,
        supervisorInfoFridayTime: null,
        supervisorInfoMondayTime: null,
        supervisorInfoSaturdayTime: null,
        supervisorInfoSendOnHolidays: false,
        supervisorInfoSundayTime: null,
        supervisorInfoThursdayTime: null,
        supervisorInfoTuesdayTime: null,
        supervisorInfoWednesdayTime: null,
      },
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleCheckboxWithInputChange = this.handleCheckboxWithInputChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
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

  // TODO: Replace this unsafe method
  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user: oldUser } = this.props;
    const { user } = nextProps;
    const { notifications } = this.state;

    if (
      (!notifications.isInit && user !== null)
      || (
        notifications.isInit
        && oldUser !== null
        && user !== null
        && !oldUser.get('notifications').equals(user.get('notifications'))
      )
    ) {
      this.setState((prevState) => ({
        ...prevState,
        notifications: {
          isInit: true,
          ...user.get('notifications').toJS(),
        },
      }));
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

  handleCheckboxChange(e) {
    const {
      id,
      checked,
    } = e.target;

    this.setState((prevState) => ({
      ...prevState,
      notifications: {
        ...prevState.notifications,
        [id]: checked,
      },
    }));
  }

  handleCheckboxWithInputChange(e) {
    const {
      id,
      checked,
    } = e.target;

    this.setState((prevState) => ({
      ...prevState,
      notifications: {
        ...prevState.notifications,
        [id]: checked ? '00:00' : null,
      },
    }));
  }

  handleInputChange(e) {
    const {
      id,
      value,
    } = e.target;

    this.setState((prevState) => ({
      ...prevState,
      notifications: {
        ...prevState.notifications,
        [id]: value !== '' ? value : null,
      },
    }));
  }

  handleSave() {
    const {
      editUser,
      user,
    } = this.props;
    const { notifications } = this.state;

    editUser({
      ...user.toJS(),
      notifications,
    });
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
    const {
      apiTokenDialogOpened,
      notifications,
    } = this.state;

    let loggedUserId = null;

    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        loggedUserId = decodedToken.uid;
      }
    }

    return (
      <Layout title={t('user:title.profile')} loading={this.props.isFetching}>
        {
          config && user && workHours
          && (
            <div>
              <div className={styles.centeredLayout}>
                <div className={styles.responsiveTable}>
                  <table className={styles.table}>
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
                            <div className="mt-1">
                              <Button
                                beforeLabel={<Icon icon="open_in_new" />}
                                clickHandler={() => this.setState({ apiTokenDialogOpened: true })}
                                label={t('user:action.showApiToken')}
                                size="small"
                              />
                            </div>
                          )}
                          <div className="mt-1 mb-1">
                            <Button
                              beforeLabel={<Icon icon="autorenew" />}
                              clickHandler={() => renewUserApiToken(user.get('id'))}
                              label={t('user:action.renewApiToken')}
                              loadingIcon={isPosting ? <Icon icon="sync" /> : null}
                              size="small"
                            />
                          </div>
                          {!!user.get('apiToken') && (
                            <div className="mb-1">
                              <Button
                                beforeLabel={<Icon icon="clear" />}
                                clickHandler={() => resetUserApiToken(user.get('id'))}
                                label={t('user:action.resetApiToken')}
                                loadingIcon={isPosting ? <Icon icon="sync" /> : null}
                                size="small"
                                variant="danger"
                              />
                            </div>
                          )}
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
                </div>

                <h3 className={styles.h2}>{t('user:text.vacationDays')}</h3>
                <div className={styles.responsiveTable}>
                  <table className={styles.table}>
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
                      {user.get('vacations') && user.get('vacations').map((vacation) => (
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

                <h3 className={styles.h2}>{t('user:text.averageWorkingHoursTitle')}</h3>
                <div className={styles.responsiveTable}>
                  <table className={styles.workHoursTable}>
                    <thead>
                      <tr>
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label  */}
                        <th />
                        {Array.from({ length: 12 }, (v, k) => k + 1).map(((month) => (
                          <th key={month}>
                            {month}
                          </th>
                        )))}
                      </tr>
                    </thead>
                    <tbody>
                      {config && config.get('supportedYears').map((year) => (
                        <tr key={year}>
                          <td>{year}</td>
                          {this.getRequiredHours(year).map((month) => (
                            <td key={shortid.generate()}>
                              {month}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className={styles.h2}>{t('user:text.notificationSettings')}</h3>
                <h3 className={styles.h3}>{t('user:text.supervisorInfo')}</h3>
                <div className={styles.responsiveTable}>
                  <table className={styles.table}>
                    <tbody>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <tr key={day}>
                          <td className={styles.notificationSettingsDay}>
                            {t(`general:text.${day}`)}
                          </td>
                          <td className={styles.notificationSettingsCheckbox}>
                            <CheckboxField
                              changeHandler={this.handleCheckboxWithInputChange}
                              isLabelVisible={false}
                              label=""
                              id={`supervisorInfo${day}Time`}
                              checked={notifications[`supervisorInfo${day}Time`] !== null}
                            />
                          </td>
                          <td className={styles.notificationSettingsInput}>
                            <TextField
                              changeHandler={this.handleInputChange}
                              disabled={notifications[`supervisorInfo${day}Time`] === null}
                              id={`supervisorInfo${day}Time`}
                              inputSize={5}
                              isLabelVisible={false}
                              label=""
                              type="time"
                              value={notifications[`supervisorInfo${day}Time`] || ''}
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} />
                      </tr>
                      <tr>
                        <td className={styles.notificationSettingsDay}>
                          {t('user:element.supervisorInfoSendOnHolidays')}
                        </td>
                        <td className={styles.notificationSettingsCheckbox}>
                          <CheckboxField
                            changeHandler={this.handleCheckboxChange}
                            isLabelVisible={false}
                            label=""
                            id="supervisorInfoSendOnHolidays"
                            checked={notifications.supervisorInfoSendOnHolidays}
                          />
                        </td>
                        <td className={styles.notificationSettingsInput} />
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.saveButton}>
                  <Button
                    clickHandler={this.handleSave}
                    disabled={loggedUserId === null}
                    label={t('general:action.save')}
                    loadingIcon={isPosting ? <Icon icon="sync" /> : null}
                  />
                </div>
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
  editUser: PropTypes.func.isRequired,
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

export default withTranslation()(ProfileComponent);
