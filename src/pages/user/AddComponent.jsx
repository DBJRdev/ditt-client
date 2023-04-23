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
import Layout from '../../components/Layout';
import routes from '../../routes';
import styles from './user.scss';
import { Contracts } from './_components/Contracts';

class AddComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        contracts: [],
        email: null,
        employeeId: null,
        firstName: null,
        isActive: false,
        lastName: null,
        plainPassword: null,
        supervisor: null,
        vacations: {},
      },
      formValidity: {
        elements: {
          contracts: null,
          email: null,
          employeeId: null,
          firstName: null,
          form: null,
          isActive: null,
          lastName: null,
          plainPassword: null,
          supervisor: null,
          vacations: {},
        },
        isValid: false,
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onChangeVacationDays = this.onChangeVacationDays.bind(this);
    this.onChangeVacationDaysCorrection = this.onChangeVacationDaysCorrection.bind(this);
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

      Object.keys(formData.vacations).forEach((year) => {
        vacations.push({
          vacationDays: parseInt(formData.vacations[year].vacationDays, 10),
          vacationDaysCorrection: parseInt(formData.vacations[year].vacationDaysCorrection, 10),
          year: parseInt(year, 10),
        });
      });

      formData.vacations = vacations;

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
      <Layout loading={this.props.isFetching} title={t('user:title.addUser')}>
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
                id="firstName"
                label={t('user:element.firstName')}
                onChange={this.onChange}
                required
                validationState={this.state.formValidity.elements.firstName ? 'invalid' : null}
                validationText={this.state.formValidity.elements.firstName}
                value={this.state.formData.firstName || ''}
              />
            </ListItem>
            <ListItem>
              <TextField
                fullWidth
                id="lastName"
                label={t('user:element.lastName')}
                onChange={this.onChange}
                required
                validationState={this.state.formValidity.elements.lastName ? 'invalid' : null}
                validationText={this.state.formValidity.elements.lastName}
                value={this.state.formData.lastName || ''}
              />
            </ListItem>
            <ListItem>
              <SelectField
                fullWidth
                id="supervisor"
                label={t('user:element.supervisor')}
                onChange={this.onChange}
                options={userList}
                validationState={this.state.formValidity.elements.supervisor ? 'invalid' : null}
                validationText={this.state.formValidity.elements.supervisor}
                value={this.state.formData.supervisor || ''}
              />
            </ListItem>
            <ListItem>
              <TextField
                autoComplete="off"
                fullWidth
                id="email"
                label={t('user:element.email')}
                onChange={this.onChange}
                required
                validationState={this.state.formValidity.elements.email ? 'invalid' : null}
                validationText={this.state.formValidity.elements.email}
                value={this.state.formData.email || ''}
              />
            </ListItem>
            <ListItem>
              <TextField
                fullWidth
                id="employeeId"
                label={t('user:element.employeeId')}
                onChange={this.onChange}
                required
                validationState={this.state.formValidity.elements.employeeId ? 'invalid' : null}
                validationText={this.state.formValidity.elements.employeeId}
                value={this.state.formData.employeeId || ''}
              />
            </ListItem>
            <ListItem>
              <TextField
                autoComplete="new-password"
                fullWidth
                id="plainPassword"
                label={t('user:element.plainPassword')}
                onChange={this.onChange}
                required
                type="password"
                validationState={this.state.formValidity.elements.plainPassword ? 'invalid' : null}
                validationText={this.state.formValidity.elements.plainPassword}
                value={this.state.formData.plainPassword || ''}
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
            <Contracts
              contracts={this.state.formData.contracts}
              onContractAdd={(contract) => {
                this.setState((prevState) => ({
                  formData: {
                    ...prevState.formData,
                    contracts: [
                      ...prevState.formData.contracts,
                      contract,
                    ],
                  },
                }));
              }}
              onContractRemove={(contract) => {
                this.setState((prevState) => ({
                  formData: {
                    ...prevState.formData,
                    // eslint-disable-next-line no-underscore-dangle
                    contracts: prevState.formData.contracts.filter((c) => c._id !== contract._id),
                  },
                }));
              }}
              onContractSave={(contract) => {
                this.setState((prevState) => ({
                  formData: {
                    ...prevState.formData,
                    contracts: prevState.formData.contracts.map((c) => {
                      // eslint-disable-next-line no-underscore-dangle
                      if (c._id === contract._id) {
                        return contract;
                      }

                      return c;
                    }),
                  },
                }));
              }}
              onContractTerminate={() => {
              }}
              validationMessage={this.state.formValidity.elements.contracts}
              workMonths={[]}
            />
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
                    id={`vacationDays_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.total')}
                    onChange={this.onChangeVacationDays}
                    validationState={this.state.formValidity.elements.vacations[year].vacationDays ? 'invalid' : null}
                    validationText={this.state.formValidity.elements.vacations[year].vacationDays}
                    value={this.state.formData.vacations[year].vacationDays || ''}
                  />
                  <TextField
                    id={`vacationDaysCorrection_${year.toString()}`}
                    inputSize={6}
                    label={t('vacation:text.correction')}
                    onChange={this.onChangeVacationDaysCorrection}
                    validationState={
                      this.state.formValidity.elements.vacations[year].vacationDaysCorrection ? 'invalid' : null
                    }
                    validationText={
                      this.state.formValidity.elements.vacations[year].vacationDaysCorrection
                    }
                    value={this.state.formData.vacations[year].vacationDaysCorrection || ''}
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
