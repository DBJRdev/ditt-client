import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Alert,
  FormLayout,
  FormLayoutCustomField,
  Grid,
  Modal,
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import { LoadingIcon } from '../../../Icon';
import {
  BAN_WORK_LOG,
  MATERNITY_PROTECTION_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG,
  SICK_DAY_UNPAID_WORK_LOG,
} from '../../../../resources/workMonth';
import { validateSupervisorWorkLog } from '../../../../services/validatorService';
import { getInitialState } from './helpers/getInitialState';
import { getStateToSave } from './helpers/getStateToSave';

class SupervisorWorkLogFormModalComponent extends React.Component {
  constructor(props) {
    super(props);

    const {
      data,
      date,
    } = props;

    this.state = getInitialState(data, date);

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange(e) {
    const eventTarget = e.target;

    if (
      eventTarget.id === 'hour'
      && eventTarget.value
      && (
        eventTarget.value.length > 2
        || Number.isNaN(eventTarget.value)
        || parseInt(eventTarget.value, 10) > 23
      )
    ) {
      return;
    }

    if (
      eventTarget.id === 'minute'
      && eventTarget.value
      && (
        eventTarget.value.length > 2
        || Number.isNaN(eventTarget.value)
        || parseInt(eventTarget.value, 10) > 59
      )
    ) {
      return;
    }

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [eventTarget.id]: eventTarget.value,
      },
    }));
  }

  onSave() {
    const {
      config,
      contracts,
      onAfterSave,
      onSave,
      t,
      workMonth,
    } = this.props;
    const { formData } = this.state;

    const formValidity = validateSupervisorWorkLog(t, formData);
    this.setState({ formValidity });

    if (formValidity.isValid) {
      onSave(getStateToSave(formData, workMonth), config, contracts)
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
      onClose,
      t,
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
        <Grid
          columns="1fr"
          justifyContent="center"
          justifyItems="center"
        >
          <FormLayout>
            <SelectField
              disabled={Boolean(data)}
              id="type"
              label={t('workLog:element.type')}
              onChange={this.onChange}
              options={[
                {
                  label: t('workMonth:constant.type.banWorkLog'),
                  value: BAN_WORK_LOG,
                },
                {
                  label: t('workMonth:constant.type.maternityProtectionWorkLog'),
                  value: MATERNITY_PROTECTION_WORK_LOG,
                },
                {
                  label: t('workMonth:constant.type.parentalLeaveWorkLog'),
                  value: PARENTAL_LEAVE_WORK_LOG,
                },
                {
                  label: t('workMonth:constant.type.sickDayUnpaidWorkLog'),
                  value: SICK_DAY_UNPAID_WORK_LOG,
                },
              ]}
              validationState={formValidity.elements.type ? 'invalid' : null}
              validationText={formValidity.elements.type}
              value={formData.type || ''}
            />
            <TextField
              disabled
              id="date"
              label={t('workLog:element.dateFrom')}
              onChange={this.onChange}
              validationState={formValidity.elements.date ? 'invalid' : null}
              validationText={formValidity.elements.dateTo}
              value={formData.date || ''}
            />
            <TextField
              disabled={Boolean(data)}
              id="dateTo"
              label={t('workLog:element.dateTo')}
              onChange={this.onChange}
              validationState={formValidity.elements.dateTo ? 'invalid' : null}
              validationText={formValidity.elements.dateTo}
              value={formData.dateTo || ''}
            />
            {formData.type === BAN_WORK_LOG && (
              <FormLayoutCustomField label={t('banWorkLog:element.workTimeLimit')}>
                <TextField
                  id="hour"
                  inputSize={2}
                  isLabelVisible={false}
                  label={t('workMonth:element.hours')}
                  max={23}
                  min={0}
                  onChange={this.onChange}
                  type="number"
                  validationState={formValidity.elements.hour ? 'invalid' : null}
                  validationText={formValidity.elements.hour}
                  value={formData.hour || ''}
                />
                <span className="ml-2 mr-2">:</span>
                <TextField
                  id="minute"
                  inputSize={2}
                  isLabelVisible={false}
                  label={t('workMonth:element.minutes')}
                  max={59}
                  min={0}
                  onChange={this.onChange}
                  type="number"
                  validationState={formValidity.elements.minute ? 'invalid' : null}
                  validationText={formValidity.elements.minute}
                  value={formData.minute || ''}
                />
                <span className="ml-2">h</span>
              </FormLayoutCustomField>
            )}
          </FormLayout>
        </Grid>
      </Modal>
    );
  }
}

SupervisorWorkLogFormModalComponent.defaultProps = {
  data: null,
  isPosting: false,
};

SupervisorWorkLogFormModalComponent.propTypes = {
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
    date: PropTypes.instanceOf(moment).isRequired,
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf([
      BAN_WORK_LOG,
      MATERNITY_PROTECTION_WORK_LOG,
      PARENTAL_LEAVE_WORK_LOG,
      SICK_DAY_UNPAID_WORK_LOG,
    ]).isRequired,
    workTimeLimit: PropTypes.number,
  }),
  date: PropTypes.instanceOf(moment).isRequired,
  isPosting: PropTypes.bool,
  onAfterSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  workMonth: PropTypes.shape({}).isRequired,
};

export default withTranslation()(SupervisorWorkLogFormModalComponent);
