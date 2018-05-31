import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import {
  Button,
  CheckboxField,
  Modal,
  SelectField,
  TextField,
} from 'react-ui';
import {
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
} from '../../resources/user/actionTypes';
import { validateUser } from '../../services/validatorService';
import Layout from '../../components/Layout';
import routes from '../../routes';
import { SUPPORTED_WORK_HOURS_YEARS } from '../../resources/user';

class EditComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email: null,
        firstName: null,
        id: null,
        isActive: false,
        lastName: null,
        plainPassword: null,
        supervisor: null,
        workHours: {},
      },
      formValidity: {
        elements: {
          email: null,
          firstName: null,
          form: null,
          isActive: null,
          lastName: null,
          supervisor: null,
          workHours: {},
        },
        isValid: false,
      },
      showDeleteUserDialog: false,
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
    this.props.fetchUser(this.props.match.params.id).then(() => {
      this.props.fetchWorkHoursList(this.props.match.params.id).then(() => {
        const {
          user,
          workHours,
        } = this.props;
        const mergedWorkHours = this.state.formData.workHours;

        workHours.forEach((workHoursItem) => {
          mergedWorkHours[workHoursItem.get('year')][workHoursItem.get('month') - 1] = workHoursItem.get('requiredHours');
        });

        this.setState({
          formData: {
            email: user.get('email'),
            firstName: user.get('firstName'),
            id: user.get('id'),
            isActive: user.get('isActive'),
            lastName: user.get('lastName'),
            supervisor: user.getIn(['supervisor', 'id']) ? user.getIn(['supervisor', 'id']) : null,
            workHours: mergedWorkHours,
          },
        });
      });

      this.props.fetchUserList();
    });
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

  deleteHandler() {
    const { formValidity } = this.state;

    this.props.deleteUser(this.props.match.params.id)
      .then((response) => {
        if (response.type === DELETE_USER_SUCCESS) {
          this.props.history.push(routes.userList);
        } else if (response.type === DELETE_USER_FAILURE) {
          formValidity.elements.form = 'User cannot be deleted.';

          this.setState({ formValidity });
        }
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

      this.props.editUser(formData)
        .then((response) => {
          if (response.type === EDIT_USER_SUCCESS) {
            this.props.history.push(routes.userList);
          } else if (response.type === EDIT_USER_FAILURE) {
            formValidity.elements.form = 'User cannot be edited.';

            this.setState({ formValidity });
          }
        });
    }
  }

  openDeleteUserDialog() {
    this.setState({ showDeleteUserDialog: true });
  }

  closeDeleteUserDialog() {
    this.setState({ showDeleteUserDialog: false });
  }

  renderDeleteWorkLogModal() {
    return (
      <Modal
        actions={[
          {
            clickHandler: this.deleteHandler,
            label: 'Delete',
            loading: this.props.isPosting,
          },
        ]}
        closeHandler={this.closeDeleteUserDialog}
        title="Delete user"
      >
        Are you sure that you want to delete this user?
      </Modal>
    );
  }

  render() {
    let loggedUserId = null;

    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        loggedUserId = decodedToken.uid;
      }
    }

    let userList = this.props.userList.toJS();
    userList = userList
      .filter(user => user.id !== loggedUserId)
      .map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
      }));

    userList.unshift({
      label: '',
      value: null,
    });

    return (
      <Layout title="Edit user" loading={this.props.isFetching}>
        <Button
          clickHandler={this.openDeleteUserDialog}
          label="Delete"
          priority="primary"
          variant="danger"
        />
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
            disabled={this.state.formData.id === loggedUserId}
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
          <p>Insert as amount of hours divided by {'";"'}, starting with January.</p>
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
        {this.state.showDeleteUserDialog ? this.renderDeleteWorkLogModal() : null}
      </Layout>
    );
  }
}

EditComponent.defaultProps = {
  user: null,
};

EditComponent.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchUserList: PropTypes.func.isRequired,
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
  workHours: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default EditComponent;
