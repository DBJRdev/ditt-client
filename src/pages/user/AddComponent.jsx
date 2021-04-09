import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button,
  CheckboxField,
  List,
  ListItem,
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import { LoadingIcon } from '../../components/Icon';
import {
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
} from '../../resources/user/actionTypes';
import { validateUser } from '../../services/validatorService';
import { getWorkHoursValue } from '../../services/workHoursService';
import Layout from '../../components/Layout';
import routes from '../../routes';
import styles from './user.scss';

class AddComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email: null,
        employeeId: null,
        firstName: null,
        isActive: false,
        lastName: null,
        plainPassword: null,
        supervisor: null,
        vacations: {},
        workHours: {},
      },
      formValidity: {
        elements: {
          email: null,
          employeeId: null,
          firstName: null,
          form: null,
          isActive: null,
          lastName: null,
          plainPassword: null,
          supervisor: null,
          vacations: {},
          workHours: {},
        },
        isValid: false,
      },
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.changeVacationDaysHandler = this.changeVacationDaysHandler.bind(this);
    this.changeVacationDaysCorrectionHandler = this.changeVacationDaysCorrectionHandler.bind(this);
    this.changeWorkHourHandler = this.changeWorkHourHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);

    this.formErrorStyle = {
      color: '#a32100',
      textAlign: 'center',
    };
  }

  componentDidMount() {
    this.props.fetchConfig().then(() => {
      const formData = { ...this.state.formData };
      const formValidity = { ...this.state.formValidity };

      this.props.config.get('supportedYears').forEach((year) => {
        this.state.formData.workHours[year] = [];

        for (let month = 0; month < 12; month += 1) {
          formData.workHours[year][month] = '0:00';
          formValidity.elements.workHours[year] = null;
        }

        formData.vacations[year] = {
          remainingVacationDays: '0',
          vacationDays: '0',
          vacationDaysCorrection: '0',
          vacationDaysUsed: '0',
        };
        formValidity.elements.vacations[year] = {
          vacationDays: null,
          vacationDaysCorrection: null,
        };
      });

      this.setState({
        formData,
        formValidity,
      });
    });
    this.props.fetchUserList();
  }

  changeHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const formData = { ...prevState.formData };

      if (eventTarget.type === 'checkbox') {
        formData[eventTarget.id] = eventTarget.checked;
      } else {
        formData[eventTarget.id] = eventTarget.value;
      }

      return { formData };
    });
  }

  changeVacationDaysHandler(e) {
    const eventTarget = e.target;
    const eventTargetId = eventTarget.id.replace('vacationDays_', '');

    this.setState((prevState) => {
      const formData = { ...prevState.formData };
      const remainingVacationDays = parseInt(eventTarget.value, 10)
        + parseInt(formData.vacations[eventTargetId].vacationDaysCorrection, 10)
        - parseInt(formData.vacations[eventTargetId].vacationDaysUsed, 10);

      formData.vacations[eventTargetId] = {
        ...formData.vacations[eventTargetId],
        remainingVacationDays,
        vacationDays: eventTarget.value,
      };

      return { formData };
    });
  }

  changeVacationDaysCorrectionHandler(e) {
    const eventTarget = e.target;
    const eventTargetId = eventTarget.id.replace('vacationDaysCorrection_', '');

    this.setState((prevState) => {
      const formData = { ...prevState.formData };
      const remainingVacationDays = parseInt(formData.vacations[eventTargetId].vacationDays, 10)
        + parseInt(eventTarget.value, 10)
        - parseInt(formData.vacations[eventTargetId].vacationDaysUsed, 10);

      formData.vacations[eventTargetId] = {
        ...formData.vacations[eventTargetId],
        remainingVacationDays,
        vacationDaysCorrection: eventTarget.value,
      };
      return { formData };
    });
  }

  changeWorkHourHandler(e) {
    const eventTarget = e.target;
    const eventTargetId = eventTarget.id.replace('workHours_', '');

    if (
      eventTarget.value
      && eventTarget.value.split(',').length > 12
    ) {
      return;
    }

    this.setState((prevState) => {
      const formData = { ...prevState.formData };
      formData.workHours[eventTargetId] = eventTarget.value.split(',');

      return { formData };
    });
  }

  saveHandler() {
    const formValidity = validateUser(
      this.props.t,
      this.state.formData,
      this.props.userList.toJS(),
      this.props.config.get('supportedYears'),
    );

    this.setState({ formValidity });

    if (formValidity.isValid) {
      const formData = { ...this.state.formData };
      const vacations = [];
      const workHours = [];

      Object.keys(formData.vacations).forEach((year) => {
        vacations.push({
          vacationDays: parseInt(formData.vacations[year].vacationDays, 10),
          vacationDaysCorrection: parseInt(formData.vacations[year].vacationDaysCorrection, 10),
          year: parseInt(year, 10),
        });
      });

      formData.vacations = vacations;

      Object.keys(formData.workHours).forEach((year) => {
        formData.workHours[year].forEach((requiredHours, monthIndex) => {
          workHours.push({
            month: monthIndex + 1,
            requiredHours: getWorkHoursValue(requiredHours),
            year: parseInt(year, 10),
          });
        });
      });

      formData.workHours = workHours;

      if (formData.supervisor === '' || formData.supervisor == null) {
        formData.supervisor = null;
      } else {
        formData.supervisor = { id: formData.supervisor };
      }

      this.props.addUser(formData)
        .then((response) => {
          formValidity.elements.form = this.props.t('user:validation.cannotAddUser');

          if (response.type === ADD_USER_SUCCESS) {
            this.props.history.push(routes.userList);
          } else if (response.type === ADD_USER_FAILURE) {
            formValidity.elements.form = this.props.t('user:validation.cannotAddUser');

            this.setState({ formValidity });
          }
        });
    }
  }

  render() {
    const { t } = this.props;

    const userList = this.props.userList.toJS().map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    }));

    userList.unshift({
      label: '',
      value: null,
    });

    return (
      <Layout title={t('user:title.addUser')} loading={this.props.isFetching}>
        <form className={styles.detailPageWrapper}>
          {this.state.formValidity.elements.form && (
            <p style={this.formErrorStyle}>
              {this.state.formValidity.elements.form}
            </p>
          )}
          <List>
            <ListItem>
              <TextField
                changeHandler={this.changeHandler}
                fullWidth
                validationText={this.state.formValidity.elements.firstName}
                id="firstName"
                label={t('user:element.firstName')}
                required
                value={this.state.formData.firstName || ''}
                validationState={this.state.formValidity.elements.firstName ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                changeHandler={this.changeHandler}
                fullWidth
                validationText={this.state.formValidity.elements.lastName}
                id="lastName"
                label={t('user:element.lastName')}
                required
                value={this.state.formData.lastName || ''}
                validationState={this.state.formValidity.elements.lastName ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <SelectField
                changeHandler={this.changeHandler}
                fullWidth
                validationText={this.state.formValidity.elements.supervisor}
                id="supervisor"
                label={t('user:element.supervisor')}
                options={userList}
                value={this.state.formData.supervisor || ''}
                validationState={this.state.formValidity.elements.supervisor ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                autoComplete="off"
                changeHandler={this.changeHandler}
                fullWidth
                validationText={this.state.formValidity.elements.email}
                id="email"
                label={t('user:element.email')}
                required
                value={this.state.formData.email || ''}
                validationState={this.state.formValidity.elements.email ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                changeHandler={this.changeHandler}
                fullWidth
                validationText={this.state.formValidity.elements.employeeId}
                id="employeeId"
                label={t('user:element.employeeId')}
                required
                value={this.state.formData.employeeId || ''}
                validationState={this.state.formValidity.elements.employeeId ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                autoComplete="new-password"
                changeHandler={this.changeHandler}
                fullWidth
                validationText={this.state.formValidity.elements.plainPassword}
                id="plainPassword"
                label={t('user:element.plainPassword')}
                type="password"
                required
                value={this.state.formData.plainPassword || ''}
                validationState={this.state.formValidity.elements.plainPassword ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <CheckboxField
                changeHandler={this.changeHandler}
                checked={this.state.formData.isActive}
                error={this.state.formValidity.elements.isActive}
                id="isActive"
                label={t('user:element.isActive')}
                required
              />
            </ListItem>
            <h2 className={styles.detailSubheader}>
              {t('user:text.vacationDays')}
            </h2>
            {this.props.config && this.props.config.get('supportedYears').map((year) => {
              if (!this.state.formData.vacations[year]) {
                return null;
              }

              return (
                <div
                  className={styles.vacationsRow}
                  key={year}
                >
                  <span>{year}</span>
                  <TextField
                    changeHandler={this.changeVacationDaysHandler}
                    validationText={this.state.formValidity.elements.vacations[year].vacationDays}
                    id={`vacationDays_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.total')}
                    value={this.state.formData.vacations[year].vacationDays || ''}
                    validationState={this.state.formValidity.elements.vacations[year].vacationDays ? 'invalid' : null}
                  />
                  <TextField
                    changeHandler={this.changeVacationDaysCorrectionHandler}
                    validationText={
                      this.state.formValidity.elements.vacations[year].vacationDaysCorrection
                    }
                    id={`vacationDaysCorrection_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.correction')}
                    value={this.state.formData.vacations[year].vacationDaysCorrection || ''}
                    validationState={
                      this.state.formValidity.elements.vacations[year].vacationDaysCorrection ? 'invalid' : null
                    }
                  />
                  <TextField
                    changeHandler={() => {}}
                    disabled
                    id={`vacationDaysUsed_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.used')}
                    value={this.state.formData.vacations[year].vacationDaysUsed || ''}
                  />
                  <TextField
                    changeHandler={() => {}}
                    disabled
                    id={`remainingVacationDays_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.remaining')}
                  />
                </div>
              );
            })}
            <h2 className={styles.detailSubheader}>
              {t('user:text.averageWorkingHoursTitle')}
            </h2>
            <p>{t('user:text.averageWorkingHoursDescription')}</p>
            {this.props.config && this.props.config.get('supportedYears').map((year) => {
              if (!this.state.formData.workHours[year]) {
                return null;
              }

              return (
                <ListItem key={year}>
                  <TextField
                    changeHandler={this.changeWorkHourHandler}
                    fullWidth
                    validationText={this.state.formValidity.elements.workHours[year]}
                    id={year.toString()}
                    label={year.toString()}
                    maxLength={71}
                    pattern="((2[0-3]|1[0-9]|[0-9]):([0-5][0-9]|[0-9]|),){11}(2[0-3]|1[0-9]|[0-9]):([0-5][0-9]|[0-9])"
                    value={
                      this.state.formData.workHours[year]
                      && this.state.formData.workHours[year].reduce((accValue, requiredHours) => {
                        if (!accValue) {
                          return requiredHours.toString();
                        }

                        return `${accValue},${requiredHours}`;
                      }, null)
                    }
                    validationState={this.state.formValidity.elements.workHours[year] ? 'invalid' : null}
                  />
                </ListItem>
              );
            })}

            <ListItem>
              <Button
                clickHandler={this.saveHandler}
                label={t('general:action.save')}
                loadingIcon={this.props.isPosting ? <LoadingIcon /> : null}
              />
            </ListItem>
          </List>
        </form>
      </Layout>
    );
  }
}

AddComponent.defaultProps = {
  config: {},
};

AddComponent.propTypes = {
  addUser: PropTypes.func.isRequired,
  config: ImmutablePropTypes.mapContains({}),
  fetchConfig: PropTypes.func.isRequired,
  fetchUserList: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  userList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
  })).isRequired,
};

export default withTranslation()(AddComponent);
