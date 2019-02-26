import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { withNamespaces } from 'react-i18next';
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
        vacationDays: null,
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
          vacationDays: null,
          workHours: {},
        },
        isValid: false,
      },
      showDeleteUserDialog: false,
    };

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
    this.props.fetchConfig().then(() => {
      const formData = Object.assign({}, this.state.formData);
      const formValidity = Object.assign({}, this.state.formValidity);

      this.props.config.get('supportedYears').forEach((year) => {
        this.state.formData.workHours[year] = [];

        for (let month = 0; month < 12; month += 1) {
          formData.workHours[year][month] = '0:00';
          formValidity.elements.workHours[year] = null;
        }
      });

      this.setState({
        formData,
        formValidity,
      });

      this.props.fetchUser(this.props.match.params.id).then(() => {
        this.props.fetchWorkHoursList(this.props.match.params.id).then(() => {
          const {
            user,
            workHours,
          } = this.props;
          const mergedWorkHours = this.state.formData.workHours;

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
              vacationDays: user.get('vacationDays'),
              workHours: mergedWorkHours,
            },
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
      this.props.config.get('supportedYears')
    );

    this.setState({ formValidity });

    if (formValidity.isValid) {
      const formData = Object.assign({}, this.state.formData);
      const workHours = [];

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

  changeWorkHourHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const formData = Object.assign({}, prevState.formData);
      formData.workHours[eventTarget.id] = eventTarget.value.split(',');

      return { formData };
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
            loading: this.props.isPosting,
          },
        ]}
        closeHandler={this.closeDeleteUserDialog}
        title={t('user:modal.delete.title')}
        translations={{ close: t('general:action.close') }}
      >
        {t('user:modal.delete.description')}
      </Modal>
    );
  }

  render() {
    const { t } = this.props;
    let loggedUserId = null;

    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        loggedUserId = decodedToken.uid;
      }
    }

    let userList = this.props.userList.toJS();
    userList = userList
      .map(user => ({
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
            priority="primary"
            variant="danger"
          />
        </div>
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
            disabled={this.state.formData.id === loggedUserId}
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
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.vacationDays}
            fieldId="vacationDays"
            label={t('user:element.vacationDays')}
            type="text"
            value={this.state.formData.vacationDays || '0'}
          />
          <h2>{t('user:text.averageWorkingHoursTitle')}</h2>
          <p>{t('user:text.averageWorkingHoursDescription')}</p>
          {this.props.config && this.props.config.get('supportedYears').map(year => (
            <TextField
              changeHandler={this.changeWorkHourHandler}
              error={this.state.formValidity.elements.workHours[year]}
              fieldId={year.toString()}
              key={year}
              label={year.toString()}
              value={this.getRequiredHours(year)}
            />
          ))}
          <Button
            clickHandler={this.saveHandler}
            label={t('general:action.save')}
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
    vacationDays: PropTypes.number.isRequired,
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

export default withNamespaces()(EditComponent);
