import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Alert,
  FormLayout,
  Grid,
  Modal,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  LoadingIcon,
} from '../Icon';
import {
  getWorkLogTimer,
  removeWorkLogTimer,
} from '../../services/storageService';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../resources/workMonth';
import { validateWorkLog } from '../../services/validatorService';
import { getWorkLogsByDay } from '../../services/workLogService';
import { WorkLogTimerButton } from '../WorkLogTimerButton';
import { getInitialState } from './helpers/getInitialState';
import { getStateToSave } from './helpers/getStateToSave';
import { Fields } from './components/Fields';

class WorkLogFormModalComponent extends React.Component {
  constructor(props) {
    super(props);

    const {
      data,
      date,
      isWorkLogTimerDisplayed,
    } = props;

    this.state = getInitialState(data, date, isWorkLogTimerDisplayed);

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange(e) {
    const eventTarget = e.target;

    if (['startHour', 'startMinute', 'endHour', 'endMinute'].includes(eventTarget.id)) {
      if (
        eventTarget.value
        && (eventTarget.value.length > 2 || Number.isNaN(eventTarget.value))
      ) {
        return;
      }

      const numericValue = parseInt(eventTarget.value, 10);
      if (
        (['startHour', 'endHour'].includes(eventTarget.id) && numericValue > 23)
        || (['startMinute', 'endMinute'].includes(eventTarget.id) && numericValue > 59)
      ) {
        return;
      }
    }

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [eventTarget.id]: eventTarget.id.startsWith('is')
          ? eventTarget.checked
          : eventTarget.value,
      },
    }));
  }

  onSave() {
    const {
      config,
      contracts,
      date,
      onAfterSave,
      onSave,
      isWorkLogTimerDisplayed,
      t,
      workMonth,
    } = this.props;
    const { formData } = this.state;

    const banWorkLogsOfDay = getWorkLogsByDay(date, workMonth.banWorkLogs);
    const workLogsOfDay = getWorkLogsByDay(date, workMonth.workLogs);

    const modifiedFormData = { ...formData };
    modifiedFormData.expectedArrival = formData.expectedArrival || '23:59';
    modifiedFormData.expectedDeparture = formData.expectedDeparture || '00:00';

    const formValidity = validateWorkLog(
      t,
      modifiedFormData,
      config,
      workMonth.user,
      workLogsOfDay,
      banWorkLogsOfDay,
      contracts,
    );

    this.setState({ formValidity });

    if (formValidity.isValid) {
      // Stops work log timer
      if (formData.type === WORK_LOG && isWorkLogTimerDisplayed) {
        removeWorkLogTimer();
      }

      onSave(getStateToSave(formData, date), config, contracts)
        .then((response) => {
          if (response.type.endsWith('WORK_LOG_SUCCESS')) {
            onAfterSave();
          } else if (response.type.endsWith('WORK_LOG_FAILURE')) {
            formValidity.elements.form = response.payload.response.detail;

            this.setState({ formValidity });
          }
        });
    }
  }

  render() {
    const {
      data,
      isPosting,
      onAfterSave,
      onClose,
      t,
      isWorkLogTimerDisplayed,
      workMonth,
    } = this.props;
    const {
      formData,
      formValidity,
    } = this.state;

    return (
      <Modal
        actions={[
          {
            feedbackIcon: isPosting ? <LoadingIcon /> : null,
            label: t('general:action.save'),
            onClick: this.onSave,
            type: 'submit',
          },
        ]}
        onClose={onClose}
        title={data ? t('workLog:modal.edit.title') : t('workLog:modal.add.title')}
      >
        {formValidity.elements.form && (
          <div className="mb-5">
            <Alert color="danger">
              {formValidity.elements.form}
            </Alert>
          </div>
        )}
        {STATUS_WAITING_FOR_APPROVAL === workMonth.status && (
          <div className="mb-5">
            <Alert color="info">
              {t('workLog:modal.add.alreadySendForApprovalDescription')}
            </Alert>
          </div>
        )}
        <Grid
          columns="1fr"
          justifyContent="center"
          justifyItems="center"
        >
          <FormLayout>
            <Fields
              formData={formData}
              formValidity={formValidity}
              isInEditState={Boolean(data)}
              isWorkLogTimeActive={Boolean(isWorkLogTimerDisplayed && getWorkLogTimer()) || false}
              onFormDataChange={this.onChange}
            />
            {isWorkLogTimerDisplayed && (
              <WorkLogTimerButton onAfterSave={onAfterSave} />
            )}
          </FormLayout>
        </Grid>
      </Modal>
    );
  }
}

WorkLogFormModalComponent.defaultProps = {
  data: null,
  isWorkLogTimerDisplayed: false,
};

WorkLogFormModalComponent.propTypes = {
  config: PropTypes.shape({}).isRequired,
  contracts: PropTypes.arrayOf(PropTypes.shape({
    endDateTime: PropTypes.shape(),
    id: PropTypes.number,
    isDayBased: PropTypes.bool.isRequired,
    isFridayIncluded: PropTypes.bool.isRequired,
    isMondayIncluded: PropTypes.bool.isRequired,
    isThursdayIncluded: PropTypes.bool.isRequired,
    isTuesdayIncluded: PropTypes.bool.isRequired,
    isWednesdayIncluded: PropTypes.bool.isRequired,
    startDateTime: PropTypes.shape().isRequired,
    weeklyWorkingDays: PropTypes.number.isRequired,
    weeklyWorkingHours: PropTypes.number.isRequired,
  })).isRequired,
  data: PropTypes.shape({
    childDateOfBirth: PropTypes.instanceOf(moment),
    childName: PropTypes.string,
    comment: PropTypes.string,
    date: PropTypes.instanceOf(moment),
    destination: PropTypes.string,
    endTime: PropTypes.instanceOf(moment),
    expectedArrival: PropTypes.string,
    expectedDeparture: PropTypes.string,
    id: PropTypes.number.isRequired,
    isHomeOffice: PropTypes.bool,
    purpose: PropTypes.string,
    reason: PropTypes.string,
    startTime: PropTypes.instanceOf(moment),
    transport: PropTypes.string,
    type: PropTypes.oneOf([
      BUSINESS_TRIP_WORK_LOG,
      HOME_OFFICE_WORK_LOG,
      OVERTIME_WORK_LOG,
      SICK_DAY_WORK_LOG,
      SPECIAL_LEAVE_WORK_LOG,
      TIME_OFF_WORK_LOG,
      TRAINING_WORK_LOG,
      VACATION_WORK_LOG,
      WORK_LOG,
    ]).isRequired,
    variant: PropTypes.string,
    workTimeLimit: PropTypes.number,
  }),
  date: PropTypes.instanceOf(moment).isRequired,
  isPosting: PropTypes.bool.isRequired,
  isWorkLogTimerDisplayed: PropTypes.bool,
  onAfterSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  workMonth: PropTypes.shape({
    banWorkLogs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    status: PropTypes.oneOf([
      STATUS_OPENED,
      STATUS_WAITING_FOR_APPROVAL,
      STATUS_APPROVED,
    ]).isRequired,
    user: PropTypes.shape({}).isRequired,
    workLogs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
};

export default withTranslation()(WorkLogFormModalComponent);
