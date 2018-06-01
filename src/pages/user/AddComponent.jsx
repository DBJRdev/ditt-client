import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
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
import { SUPPORTED_WORK_HOURS_YEARS } from '../../resources/user';
import { validateUser } from '../../services/validatorService';
import Layout from '../../components/Layout';
import routes from '../../routes';

class AddComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email: null,
        firstName: null,
        isActive: false,
        lastName: null,
        plainPassword: null,
        workHours: {},
      },
      formValidity: {
        elements: {
          email: null,
          firstName: null,
          form: null,
          isActive: null,
          lastName: null,
          plainPassword: null,
          supervisor: null,
          workHours: {},
        },
        isValid: false,
      },
    };

    SUPPORTED_WORK_HOURS_YEARS.forEach((year) => {
      this.state.formData.workHours[year] = [];

      for (let month = 0; month < 12; month += 1) {
        this.state.formData.workHours[year][month] = '0';
        this.state.formValidity.elements.workHours[year] = null;
      }
    });

    this.changeHandler = this.changeHandler.bind(this);
    this.changeWorkHourHandler = this.changeWorkHourHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);

    this.formErrorStyle = {
      color: '#a32100',
      textAlign: 'center',
    };
  }

  componentDidMount() {
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
      this.state.formData,
      this.props.userList.toJS(),
      SUPPORTED_WORK_HOURS_YEARS
    );

    this.setState({ formValidity });

    if (formValidity.isValid) {
      const formData = Object.assign({}, this.state.formData);
      const workHours = [];

      Object.keys(formData.workHours).forEach((year) => {
        formData.workHours[year].forEach((requiredHours, monthIndex) => {
          workHours.push({
            month: monthIndex + 1,
            requiredHours: parseInt(requiredHours, 10),
            year: parseInt(year, 10),
          });
        });
      });

      formData.workHours = workHours;

      this.props.addUser(formData)
        .then((response) => {
          if (response.type === ADD_USER_SUCCESS) {
            this.props.history.push(routes.userList);
          } else if (response.type === ADD_USER_FAILURE) {
            formValidity.elements.form = 'User cannot be added.';

            this.setState({ formValidity });
          }
        });
    }
  }

  render() {
    const userList = this.props.userList.toJS().map(user => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    }));

    userList.unshift({
      label: '-',
      value: null,
    });

    return (
      <Layout title="Add user" loading={this.props.isFetching}>
        <form>
          <p style={this.formErrorStyle}>
            {this.state.formValidity.elements.form}
          </p>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.firstName}
            fieldId="firstName"
            label="First name"
            required
            value={this.state.formData.firstName || ''}
          />
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.lastName}
            fieldId="lastName"
            label="Last name"
            required
            value={this.state.formData.lastName || ''}
          />
          <SelectField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.supervisor}
            fieldId="supervisor"
            label="Supervisor"
            options={userList}
            value={this.state.formData.supervisor || ''}
          />
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.email}
            fieldId="email"
            label="E-mail"
            required
            value={this.state.formData.email || ''}
          />
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.plainPassword}
            fieldId="plainPassword"
            label="Password"
            type="password"
            required
            value={this.state.formData.plainPassword || ''}
          />
          <CheckboxField
            changeHandler={this.changeHandler}
            checked={this.state.formData.isActive}
            error={this.state.formValidity.elements.isActive}
            fieldId="isActive"
            label="Active"
            required
          />
          <h2>Required working hours per month</h2>
          <p>Insert as amount of hours divided by {'","'}, starting with January.</p>
          {SUPPORTED_WORK_HOURS_YEARS.map(year => (
            <TextField
              changeHandler={this.changeWorkHourHandler}
              error={this.state.formValidity.elements.workHours[year]}
              fieldId={year.toString()}
              key={year}
              label={year.toString()}
              value={this.state.formData.workHours[year].reduce((accValue, requiredHours) => {
                if (!accValue) {
                  return requiredHours.toString();
                }

                return `${accValue},${requiredHours}`;
              }, null)}
            />
          ))}
          <Button
            clickHandler={this.saveHandler}
            label="Save"
            loading={this.props.isPosting}
            priority="primary"
          />
        </form>
      </Layout>
    );
  }
}

AddComponent.propTypes = {
  addUser: PropTypes.func.isRequired,
  fetchUserList: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  userList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
  })).isRequired,
};

export default AddComponent;