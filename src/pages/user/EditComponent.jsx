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
      },
      formValidity: {
        elements: {
          email: null,
          firstName: null,
          form: null,
          isActive: null,
          lastName: null,
          supervisor: null,
        },
        isValid: false,
      },
      showDeleteUserDialog: false,
    };

    this.changeHandler = this.changeHandler.bind(this);
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
      this.props.fetchUserList();

      const user = this.props.user.toJS();

      this.setState({
        formData: {
          email: user.email,
          firstName: user.firstName,
          id: user.id,
          isActive: user.isActive,
          lastName: user.lastName,
          supervisor: user.supervisor ? user.supervisor.id : null,
        },
      });
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
    const formValidity = validateUser(this.state.formData, this.props.userList.toJS());

    this.setState({ formValidity });

    if (formValidity.isValid) {
      this.props.editUser(this.state.formData)
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
};

export default EditComponent;
