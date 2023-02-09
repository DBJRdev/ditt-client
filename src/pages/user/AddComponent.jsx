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

    this.onChange = this.onChange.bind(this);
    this.onChangeVacationDays = this.onChangeVacationDays.bind(this);
    this.onChangeVacationDaysCorrection = this.onChangeVacationDaysCorrection.bind(this);
    this.onChangeWorkHour = this.onChangeWorkHour.bind(this);
    this.onSave = this.onSave.bind(this);

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
    this.props.fetchUserListPartial();
  }

  onChange(e) {
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

  onChangeVacationDays(e) {
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

  onChangeVacationDaysCorrection(e) {
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

  onChangeWorkHour(e) {
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

  onSave() {
    const formValidity = validateUser(
      this.props.t,
      this.state.formData,
      this.props.userListPartial.toJS(),
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

    const userList = this.props.userListPartial.toJS().map((user) => ({
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
                fullWidth
                validationText={this.state.formValidity.elements.firstName}
                id="firstName"
                label={t('user:element.firstName')}
                onChange={this.onChange}
                required
                value={this.state.formData.firstName || ''}
                validationState={this.state.formValidity.elements.firstName ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                fullWidth
                validationText={this.state.formValidity.elements.lastName}
                id="lastName"
                label={t('user:element.lastName')}
                onChange={this.onChange}
                required
                value={this.state.formData.lastName || ''}
                validationState={this.state.formValidity.elements.lastName ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <SelectField
                fullWidth
                validationText={this.state.formValidity.elements.supervisor}
                id="supervisor"
                label={t('user:element.supervisor')}
                onChange={this.onChange}
                options={userList}
                value={this.state.formData.supervisor || ''}
                validationState={this.state.formValidity.elements.supervisor ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                autoComplete="off"
                fullWidth
                validationText={this.state.formValidity.elements.email}
                id="email"
                label={t('user:element.email')}
                onChange={this.onChange}
                required
                value={this.state.formData.email || ''}
                validationState={this.state.formValidity.elements.email ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                fullWidth
                validationText={this.state.formValidity.elements.employeeId}
                id="employeeId"
                label={t('user:element.employeeId')}
                onChange={this.onChange}
                required
                value={this.state.formData.employeeId || ''}
                validationState={this.state.formValidity.elements.employeeId ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <TextField
                autoComplete="new-password"
                fullWidth
                validationText={this.state.formValidity.elements.plainPassword}
                id="plainPassword"
                label={t('user:element.plainPassword')}
                type="password"
                onChange={this.onChange}
                required
                value={this.state.formData.plainPassword || ''}
                validationState={this.state.formValidity.elements.plainPassword ? 'invalid' : null}
              />
            </ListItem>
            <ListItem>
              <CheckboxField
                checked={this.state.formData.isActive}
                id="isActive"
                label={t('user:element.isActive')}
                onChange={this.onChange}
                required
                validationState={this.state.formValidity.elements.isActive ? 'invalid' : null}
                validationText={this.state.formValidity.elements.isActive}
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
                    validationText={this.state.formValidity.elements.vacations[year].vacationDays}
                    id={`vacationDays_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.total')}
                    onChange={this.onChangeVacationDays}
                    value={this.state.formData.vacations[year].vacationDays || ''}
                    validationState={this.state.formValidity.elements.vacations[year].vacationDays ? 'invalid' : null}
                  />
                  <TextField
                    validationText={
                      this.state.formValidity.elements.vacations[year].vacationDaysCorrection
                    }
                    id={`vacationDaysCorrection_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.correction')}
                    onChange={this.onChangeVacationDaysCorrection}
                    value={this.state.formData.vacations[year].vacationDaysCorrection || ''}
                    validationState={
                      this.state.formValidity.elements.vacations[year].vacationDaysCorrection ? 'invalid' : null
                    }
                  />
                  <TextField
                    disabled
                    id={`vacationDaysUsed_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.used')}
                    onChange={() => {}}
                    value={this.state.formData.vacations[year].vacationDaysUsed || ''}
                  />
                  <TextField
                    disabled
                    id={`remainingVacationDays_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.remaining')}
                    onChange={() => {}}
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
                    fullWidth
                    validationText={this.state.formValidity.elements.workHours[year]}
                    id={year.toString()}
                    label={year.toString()}
                    maxLength={71}
                    onChange={this.onChangeWorkHour}
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
                feedbackIcon={this.props.isPosting ? <LoadingIcon /> : null}
                label={t('general:action.save')}
                onClick={this.onSave}
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
  fetchUserListPartial: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  userListPartial: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
  })).isRequired,
};

export default withTranslation()(AddComponent);
