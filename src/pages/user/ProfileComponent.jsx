import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import decode from 'jwt-decode';
import {
  Button,
  CheckboxField,
  Modal,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import { API_URL } from '../../../config/envspecific';
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import { ROLE_EMPLOYEE } from '../../resources/user';
import { getWorkHoursString } from '../../services/workHoursService';
import Layout from '../../components/Layout';
import routes from '../../routes';
import {
  toDayMonthYearFormat,
} from '../../services/dateTimeService';
import styles from './user.scss';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiTokenDialogOpened: false,
      iCalDialogOpened: false,
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
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        const loggedUserId = decodedToken.uid;

        this.props.fetchConfig();
        this.props.fetchUser(loggedUserId);
        this.props.fetchContractList(loggedUserId);
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
      contracts,
      editUser,
      user,
    } = this.props;
    const { notifications } = this.state;

    editUser({
      contracts: contracts.toJS(),
      ...user.toJS(),
      notifications,
    });
  }

  getICalUrl(useWebcalProtocol = true) {
    const { user } = this.props;
    let iCalUrl = API_URL;

    if (useWebcalProtocol) {
      iCalUrl = iCalUrl.replace('https', 'webcal')
        .replace('http', 'webcal');
    }

    return `${iCalUrl}/ical/${user.get('iCalToken')}/ditt.ics`;
  }

  render() {
    const {
      config,
      contracts,
      isPosting,
      renewUserApiToken,
      renewUserICalToken,
      resetUserApiToken,
      resetUserICalToken,
      t,
      user,
    } = this.props;
    const {
      apiTokenDialogOpened,
      iCalDialogOpened,
      notifications,
    } = this.state;

    let loggedUserId = null;

    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        loggedUserId = decodedToken.uid;
      }
    }

    return (
      <Layout loading={this.props.isFetching} title={t('user:title.profile')}>
        {
          config && user && contracts
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
                                label={t('user:action.showApiToken')}
                                onClick={() => this.setState({ apiTokenDialogOpened: true })}
                                size="small"
                              />
                            </div>
                          )}
                          <div className="mt-1 mb-1">
                            <Button
                              beforeLabel={<Icon icon="autorenew" />}
                              feedbackIcon={isPosting ? <LoadingIcon /> : null}
                              label={t('user:action.renewApiToken')}
                              onClick={() => renewUserApiToken(user.get('id'))}
                              size="small"
                            />
                          </div>
                          {!!user.get('apiToken') && (
                            <div className="mb-1">
                              <Button
                                beforeLabel={<Icon icon="clear" />}
                                color="danger"
                                feedbackIcon={isPosting ? <LoadingIcon /> : null}
                                label={t('user:action.resetApiToken')}
                                onClick={() => resetUserApiToken(user.get('id'))}
                                size="small"
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
                      <tr>
                        <td colSpan={2} />
                      </tr>
                      <tr>
                        <td className={styles.profileTableTitle}>
                          {t('user:element.iCal')}
                        </td>
                        <td className={styles.profileTableValue}>
                          {!user.get('iCalToken') && (
                            <div className="mb-1 mt-1">
                              <Button
                                feedbackIcon={isPosting ? <LoadingIcon /> : null}
                                label={t('user:action.enableICal')}
                                onClick={() => renewUserICalToken(user.get('id'))}
                                size="small"
                              />
                            </div>
                          )}
                          {!!user.get('iCalToken') && (
                            <>
                              <div className="mt-1 mb-1">
                                <Button
                                  beforeLabel={<Icon icon="open_in_new" />}
                                  label={t('user:action.showICalUrl')}
                                  onClick={() => this.setState({ iCalDialogOpened: true })}
                                  size="small"
                                />
                              </div>
                              <div className="mb-1 mt-1">
                                <Button
                                  label={t('user:action.downloadICal')}
                                  onClick={() => {
                                    window.location = this.getICalUrl();
                                  }}
                                  size="small"
                                />
                              </div>
                              <div className="mb-1">
                                <Button
                                  color="danger"
                                  feedbackIcon={isPosting ? <LoadingIcon /> : null}
                                  label={t('user:action.disableICal')}
                                  onClick={() => resetUserICalToken(user.get('id'))}
                                  size="small"
                                />
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {contracts && contracts.size > 0 && (
                  <>
                    <h3 className={styles.h2}>{t('user:text.contracts')}</h3>
                    <div className={styles.responsiveTable}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>{t('user:element.startDateTime')}</th>
                            <th>{t('user:element.endDateTime')}</th>
                            <th>{t('user:element.isDayBased')}</th>
                            <th>{t('user:element.weeklyWorkingDays')}</th>
                            <th>{t('user:element.weeklyWorkingHours')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contracts?.map((contract) => {
                            const daysIncluded = [
                              contract.get('isDayBased') && contract.get('isMondayIncluded') && t('general:text.Mon'),
                              contract.get('isDayBased') && contract.get('isTuesdayIncluded') && t('general:text.Tue'),
                              contract.get('isDayBased') && contract.get('isWednesdayIncluded') && t('general:text.Wed'),
                              contract.get('isDayBased') && contract.get('isThursdayIncluded') && t('general:text.Thu'),
                              contract.get('isDayBased') && contract.get('isFridayIncluded') && t('general:text.Fri'),
                            ].filter(Boolean).join(', ');

                            return (
                              <tr key={contract.get('id')}>
                                <td className={styles.vacationTableFirstCell}>
                                  {toDayMonthYearFormat(contract.get('startDateTime'))}
                                </td>
                                <td className={styles.vacationTableFirstCell}>
                                  {
                                    contract.get('endDateTime')
                                      ? toDayMonthYearFormat(contract.get('endDateTime'))
                                      : '–'
                                  }
                                </td>
                                <td className={styles.vacationTableCell}>
                                  {
                                    contract.get('isDayBased')
                                      ? t('user:element.dayBased')
                                      : t('user:element.flexible')
                                  }
                                </td>
                                <td className={styles.vacationTableCell}>
                                  {contract.get('weeklyWorkingDays')}
                                  {daysIncluded.length > 0 && (
                                    <>
                                      <br />
                                      (
                                      {daysIncluded}
                                      )
                                    </>
                                  )}
                                </td>
                                <td className={styles.vacationTableCell}>
                                  {getWorkHoursString(contract.get('weeklyWorkingHours') * 3600)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

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
                              checked={notifications[`supervisorInfo${day}Time`] !== null}
                              id={`supervisorInfo${day}Time`}
                              isLabelVisible={false}
                              label=""
                              onChange={this.handleCheckboxWithInputChange}
                            />
                          </td>
                          <td className={styles.notificationSettingsInput}>
                            <TextField
                              disabled={notifications[`supervisorInfo${day}Time`] === null}
                              id={`supervisorInfo${day}Time`}
                              inputSize={9}
                              isLabelVisible={false}
                              label=""
                              onChange={this.handleInputChange}
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
                            checked={notifications.supervisorInfoSendOnHolidays}
                            id="supervisorInfoSendOnHolidays"
                            isLabelVisible={false}
                            label=""
                            onChange={this.handleCheckboxChange}
                          />
                        </td>
                        <td className={styles.notificationSettingsInput} />
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.saveButton}>
                  <Button
                    disabled={loggedUserId === null}
                    feedbackIcon={isPosting ? <LoadingIcon /> : null}
                    label={t('general:action.save')}
                    onClick={this.handleSave}
                  />
                </div>
              </div>

              {apiTokenDialogOpened && user.get('apiToken') && (
                <Modal
                  onClose={() => this.setState({ apiTokenDialogOpened: false })}
                  title={t('user:element.apiToken')}
                >
                  {user.get('apiToken')}
                </Modal>
              )}

              {iCalDialogOpened && user.get('iCalToken') && (
                <Modal
                  onClose={() => this.setState({ iCalDialogOpened: false })}
                  title={t('user:element.iCalUrl')}
                >
                  {this.getICalUrl()}
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
  contracts: [],
  user: null,
};

ProfileComponent.propTypes = {
  config: ImmutablePropTypes.mapContains({}),
  contracts: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endDateTime: PropTypes.shape(),
    id: PropTypes.number,
    isDayBased: PropTypes.bool.isRequired,
    isFridayIncluded: PropTypes.bool.isRequired,
    isMondayIncluded: PropTypes.bool.isRequired,
    isThursdayIncluded: PropTypes.bool.isRequired,
    isTuesdayIncluded: PropTypes.bool.isRequired,
    isWednesdayIncluded: PropTypes.bool.isRequired,
    startDateTime: PropTypes.shape().isRequired,
    weeklyWorkingDays: PropTypes.number.isRequired,
    weeklyWorkingHours: PropTypes.number.isRequired,
  })),
  editUser: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  fetchContractList: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  renewUserApiToken: PropTypes.func.isRequired,
  renewUserICalToken: PropTypes.func.isRequired,
  resetUserApiToken: PropTypes.func.isRequired,
  resetUserICalToken: PropTypes.func.isRequired,
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
};

export default withTranslation()(ProfileComponent);
