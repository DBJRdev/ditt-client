import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import decode from 'jwt-decode';
import { withTranslation } from 'react-i18next';
import {
  Button,
  CheckboxField,
  List,
  ListItem,
  Modal,
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import { LoadingIcon } from '../../components/Icon';
import {
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
} from '../../resources/user/actionTypes';
import { validateUser } from '../../services/validatorService';
import {
  getWorkHoursString,
  getWorkHoursValue,
} from '../../services/workHoursService';
import Layout from '../../components/Layout';
import routes from '../../routes';
import styles from './user.scss';

class EditComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email: null,
        employeeId: null,
        firstName: null,
        id: null,
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
          supervisor: null,
          vacations: {},
          workHours: {},
        },
        isValid: false,
      },
      showDeleteUserDialog: false,
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.changeVacationDaysHandler = this.changeVacationDaysHandler.bind(this);
    this.changeVacationDaysCorrectionHandler = this.changeVacationDaysCorrectionHandler.bind(this);
    this.changeWorkHourHandler = this.changeWorkHourHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);

    this.openDeleteUserDialog = this.openDeleteUserDialog.bind(this);
    this.closeDeleteUserDialog = this.closeDeleteUserDialog.bind(this);

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

      this.props.fetchUser(this.props.match.params.id).then(() => {
        this.props.fetchVacationList(this.props.match.params.id).then(() => {
          this.props.fetchWorkHoursList(this.props.match.params.id).then(() => {
            const {
              user,
              vacations,
              workHours,
            } = this.props;
            const mergedVacations = this.state.formData.vacations;
            const mergedWorkHours = this.state.formData.workHours;

            vacations.forEach((vacationItem) => {
              const vacationDaysUsed = user.get('yearStats')
                .find((yearStats) => yearStats.get('year') === vacationItem.get('year'))
                .get('vacationDaysUsed');
              const remainingVacationDays = vacationItem.get('vacationDays')
                + vacationItem.get('vacationDaysCorrection')
                - vacationDaysUsed;

              mergedVacations[vacationItem.get('year')] = {
                remainingVacationDays: remainingVacationDays.toString(),
                vacationDays: vacationItem.get('vacationDays').toString(),
                vacationDaysCorrection: vacationItem.get('vacationDaysCorrection').toString(),
                vacationDaysUsed: vacationDaysUsed.toString(),
              };
            });

            workHours.forEach((workHoursItem) => {
              mergedWorkHours[workHoursItem.get('year')][workHoursItem.get('month') - 1] = getWorkHoursString(workHoursItem.get('requiredHours'));
            });

            this.setState({
              formData: {
                email: user.get('email'),
                employeeId: user.get('employeeId'),
                firstName: user.get('firstName'),
                id: user.get('id'),
                isActive: user.get('isActive'),
                lastName: user.get('lastName'),
                supervisor: user.getIn(['supervisor', 'id']) ? user.getIn(['supervisor', 'id']) : null,
                vacations: mergedVacations,
                workHours: mergedWorkHours,
              },
            });
          });
        });

        this.props.fetchUserList();
      });
    });
  }

  getRequiredHours(year) {
    if (this.state.formData.workHours[year]) {
      return this.state.formData.workHours[year].reduce((accValue, requiredHours) => {
        if (!accValue) {
          return requiredHours.toString();
        }

        return `${accValue},${requiredHours}`;
      }, null);
    }

    return '';
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

      this.props.editUser(formData)
        .then((response) => {
          if (response.type === EDIT_USER_SUCCESS) {
            this.props.history.push(routes.userList);
          } else if (response.type === EDIT_USER_FAILURE) {
            formValidity.elements.form = this.props.t('user:validation.cannotEditUser');

            this.setState({ formValidity });
          }
        });
    }
  }

  deleteHandler() {
    const { formValidity } = this.state;

    this.props.deleteUser(this.props.match.params.id)
      .then((response) => {
        if (response.type === DELETE_USER_SUCCESS) {
          this.props.history.push(routes.userList);
        } else if (response.type === DELETE_USER_FAILURE) {
          formValidity.elements.form = this.props.t('user:validation.cannotDeleteUser');

          this.setState({ formValidity });
        }
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

    this.setState((prevState) => {
      const formData = { ...prevState.formData };
      formData.workHours[eventTargetId] = eventTarget.value.split(',');

      return { formData };
    });
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

  openDeleteUserDialog() {
    this.setState({ showDeleteUserDialog: true });
  }

  closeDeleteUserDialog() {
    this.setState({ showDeleteUserDialog: false });
  }

  renderDeleteWorkLogModal() {
    const { t } = this.props;

    return (
      <Modal
        actions={[
          {
            clickHandler: this.deleteHandler,
            label: t('general:action.delete'),
            loadingIcon: this.props.isPosting ? <LoadingIcon /> : null,
          },
        ]}
        closeHandler={this.closeDeleteUserDialog}
        title={t('user:modal.delete.title')}
      >
        {t('user:modal.delete.description')}
      </Modal>
    );
  }

  render() {
    const { t } = this.props;
    let loggedUserId = null;

    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        loggedUserId = decodedToken.uid;
      }
    }

    let userList = this.props.userList.toJS();
    userList = userList
      .filter((user) => user.id !== loggedUserId)
      .map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
      }));

    userList.unshift({
      label: '',
      value: null,
    });

    return (
      <Layout title={t('user:title.editUser')} loading={this.props.isFetching}>
        <div className={styles.actions}>
          <Button
            clickHandler={this.openDeleteUserDialog}
            label={t('user:action.deleteUser')}
            loadingIcon={this.props.isPosting ? <LoadingIcon /> : null}
            variant="danger"
          />
        </div>
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
                    validationState={
                      this.state.formValidity.elements.vacations[year].vacationDays ? 'invalid' : null
                    }
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
                    value={this.state.formData.vacations[year].remainingVacationDays || ''}
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
                    error={this.state.formValidity.elements.workHours[year]}
                    fullWidth
                    id={`workHours_${year.toString()}`}
                    label={year.toString()}
                    value={this.getRequiredHours(year)}
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
        {this.state.showDeleteUserDialog ? this.renderDeleteWorkLogModal() : null}
      </Layout>
    );
  }
}

EditComponent.defaultProps = {
  config: {},
  user: null,
};

EditComponent.propTypes = {
  config: ImmutablePropTypes.mapContains({}),
  deleteUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchUserList: PropTypes.func.isRequired,
  fetchVacationList: PropTypes.func.isRequired,
  fetchWorkHoursList: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: ImmutablePropTypes.mapContains({
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
  }),
  userList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
  })).isRequired,
  vacations: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    vacationDays: PropTypes.number.isRequired,
    vacationDaysCorrection: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
  workHours: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default withTranslation()(EditComponent);
