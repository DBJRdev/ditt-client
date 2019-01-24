import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment-timezone';
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

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiTokenDialogOpened: false,
    };

    this.profileTable = {
      borderCollapse: 'collapse',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '600px',
      width: '100%',
    };

    this.profileTableTitle = {
      borderBottom: '1px solid #ccc',
      borderTop: '1px solid #ccc',
      fontWeight: 'bold',
      padding: '5px 10px',
      width: '50%',
    };

    this.workHoursTitle = {
      fontSize: '1rem',
      fontWeight: '500',
      marginBottom: '1rem',
      marginTop: '3rem',
      textAlign: 'center',
    };

    this.profileTableValue = {
      borderBottom: '1px solid #ccc',
      borderTop: '1px solid #ccc',
    };

    this.workHoursTable = {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '600px',
      width: '100%',
    };

    this.responsiveTable = {
      overflowX: 'scroll',
    };

    this.apiTokenButtonsWrapper = {
      float: 'right',
    };

    this.apiTokenButton = {
      display: 'inline-block',
      marginLeft: '0.5rem',
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
    const currentYear = moment().year();

    return (
      <Layout title={t('user:title.profile')} loading={this.props.isFetching}>
        {
          config && user && workHours
          && (
            <div>
              <table style={this.profileTable}>
                <tbody>
                  <tr>
                    <td style={this.profileTableTitle}>
                      {t('user:element.firstName')}
                    </td>
                    <td style={this.profileTableValue}>
                      {user.get('firstName')}
                    </td>
                  </tr>
                  <tr>
                    <td style={this.profileTableTitle}>
                      {t('user:element.lastName')}
                    </td>
                    <td style={this.profileTableValue}>
                      {user.get('lastName')}
                    </td>
                  </tr>
                  <tr>
                    <td style={this.profileTableTitle}>
                      {t('user:element.supervisor')}
                    </td>
                    <td style={this.profileTableValue}>
                      {
                      user.get('supervisor')
                        ? `${user.getIn(['supervisor', 'firstName'])} ${user.getIn(['supervisor', 'lastName'])}`
                        : '-'
                    }
                    </td>
                  </tr>
                  <tr>
                    <td style={this.profileTableTitle}>
                      {t('user:element.email')}
                    </td>
                    <td style={this.profileTableValue}>
                      {user.get('email')}
                    </td>
                  </tr>
                  <tr>
                    <td style={this.profileTableTitle}>
                      {t('user:element.employeeId')}
                    </td>
                    <td style={this.profileTableValue}>
                      {user.get('employeeId')}
                    </td>
                  </tr>
                  <tr>
                    <td style={this.profileTableTitle}>
                      {t('user:element.vacationDays')}
                      {' '}
                      {currentYear}
                    </td>
                    <td style={this.profileTableValue}>
                      {t(
                        'user:text.vacationDaysLeft',
                        {
                          remainingDays: user.get('remainingVacationDaysByYear').get(currentYear.toString()) || 0,
                          vacationDays: user.get('vacationDays'),
                        }
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} />
                  </tr>
                  <tr>
                    <td style={this.profileTableTitle}>
                      {t('user:element.apiToken')}
                    </td>
                    <td style={this.profileTableValue}>
                      {!user.get('apiToken') && '-'}
                      {!!user.get('apiToken') && (
                        <Button
                          clickHandler={() => this.setState({ apiTokenDialogOpened: true })}
                          icon="open_in_new"
                          isLabelVisible={false}
                          label={t('user:action.showApiToken')}
                          priority="primary"
                          size="small"
                        />
                      )}
                      <div style={this.apiTokenButtonsWrapper}>
                        <div style={this.apiTokenButton}>
                          <Button
                            clickHandler={() => renewUserApiToken(user.get('id'))}
                            icon="autorenew"
                            isLabelVisible={false}
                            label={t('user:action.renewApiToken')}
                            loading={isPosting}
                            priority="primary"
                            size="small"
                          />
                        </div>
                        {!!user.get('apiToken') && (
                          <div style={this.apiTokenButton}>
                            <Button
                              clickHandler={() => resetUserApiToken(user.get('id'))}
                              icon="clear"
                              isLabelVisible={false}
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
                      <td style={this.profileTableTitle}>
                        {t('user:text.fastAccess')}
                      </td>
                      <td style={this.profileTableValue}>
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

              <h3 style={this.workHoursTitle}>{t('user:text.averageWorkingHoursTitle')}</h3>
              <div style={this.responsiveTable}>
                <table style={this.workHoursTable}>
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
                    {config && config.get('supportedYear').map(year => (
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
    remainingVacationDaysByYear: ImmutablePropTypes.mapContains({}).isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
    vacationDays: PropTypes.number.isRequired,
  }),
  workHours: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default withNamespaces()(ProfileComponent);
