import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  CheckboxField,
  SelectField,
  TextField,
} from 'react-ui';
import {
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
} from '../../resources/user/actionTypes';
import { validateUser } from '../../services/validatorService';
import { getWorkHoursValue } from '../../services/workHoursService';
import Layout from '../../components/Layout';
import routes from '../../routes';

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
    this.changeVacationHandler = this.changeVacationHandler.bind(this);
    this.changeWorkHourHandler = this.changeWorkHourHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);

    this.formErrorStyle = {
      color: '#a32100',
      textAlign: 'center',
    };
  }

  componentDidMount() {
    this.props.fetchConfig().then(() => {
      const formData = Object.assign({}, this.state.formData);
      const formValidity = Object.assign({}, this.state.formValidity);

      this.props.config.get('supportedYears').forEach((year) => {
        this.state.formData.workHours[year] = [];

        for (let month = 0; month < 12; month += 1) {
          formData.workHours[year][month] = '0:00';
          formValidity.elements.workHours[year] = null;
        }

        formData.vacations[year] = '0';
        formValidity.elements.vacations[year] = null;
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
      const formData = Object.assign({}, prevState.formData);

      if (eventTarget.type === 'checkbox') {
        formData[eventTarget.id] = eventTarget.checked;
      } else {
        formData[eventTarget.id] = eventTarget.value;
      }

      return { formData };
    });
  }

  changeVacationHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const formData = Object.assign({}, prevState.formData);
      formData.vacations[eventTarget.id] = eventTarget.value;

      return { formData };
    });
  }

  changeWorkHourHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const formData = Object.assign({}, prevState.formData);
      formData.workHours[eventTarget.id] = eventTarget.value.split(',');

      return { formData };
    });
  }

  saveHandler() {
    const formValidity = validateUser(
      this.props.t,
      this.state.formData,
      this.props.userList.toJS(),
      this.props.config.get('supportedYears')
    );

    this.setState({ formValidity });

    if (formValidity.isValid) {
      const formData = Object.assign({}, this.state.formData);
      const vacations = [];
      const workHours = [];

      Object.keys(formData.vacations).forEach((year) => {
        vacations.push({
          vacationDays: parseInt(formData.vacations[year], 10),
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

      if (formData.supervisor === '') {
        formData.supervisor = null;
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

    const userList = this.props.userList.toJS().map(user => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    }));

    userList.unshift({
      label: '',
      value: null,
    });

    return (
      <Layout title={t('user:title.addUser')} loading={this.props.isFetching}>
        <form>
          <p style={this.formErrorStyle}>
            {this.state.formValidity.elements.form}
          </p>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.firstName}
            fieldId="firstName"
            label={t('user:element.firstName')}
            required
            value={this.state.formData.firstName || ''}
          />
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.lastName}
            fieldId="lastName"
            label={t('user:element.lastName')}
            required
            value={this.state.formData.lastName || ''}
          />
          <SelectField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.supervisor}
            fieldId="supervisor"
            label={t('user:element.supervisor')}
            options={userList}
            value={this.state.formData.supervisor || ''}
          />
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.email}
            fieldId="email"
            label={t('user:element.email')}
            required
            value={this.state.formData.email || ''}
          />
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.employeeId}
            fieldId="employeeId"
            label={t('user:element.employeeId')}
            required
            value={this.state.formData.employeeId || ''}
          />
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.plainPassword}
            fieldId="plainPassword"
            label={t('user:element.plainPassword')}
            type="password"
            required
            value={this.state.formData.plainPassword || ''}
          />
          <CheckboxField
            changeHandler={this.changeHandler}
            checked={this.state.formData.isActive}
            error={this.state.formValidity.elements.isActive}
            fieldId="isActive"
            label={t('user:element.isActive')}
            required
          />
          <h2>{t('user:text.vacationDays')}</h2>
          {this.props.config && this.props.config.get('supportedYears').map(year => (
            <TextField
              changeHandler={this.changeVacationHandler}
              error={this.state.formValidity.elements.vacations[year]}
              fieldId={year.toString()}
              key={year}
              label={year.toString()}
              value={this.state.formData.vacations[year] || ''}
            />
          ))}
          <h2>{t('user:text.averageWorkingHoursTitle')}</h2>
          <p>{t('user:text.averageWorkingHoursDescription')}</p>
          {this.props.config && this.props.config.get('supportedYears').map(year => (
            <TextField
              changeHandler={this.changeWorkHourHandler}
              error={this.state.formValidity.elements.workHours[year]}
              fieldId={year.toString()}
              key={year}
              label={year.toString()}
              value={
                this.state.formData.workHours[year]
                && this.state.formData.workHours[year].reduce((accValue, requiredHours) => {
                  if (!accValue) {
                    return requiredHours.toString();
                  }

                  return `${accValue},${requiredHours}`;
                }, null)
              }
            />
          ))}
          <Button
            clickHandler={this.saveHandler}
            label={t('general:action.save')}
            loading={this.props.isPosting}
            priority="primary"
          />
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

export default withNamespaces()(AddComponent);
