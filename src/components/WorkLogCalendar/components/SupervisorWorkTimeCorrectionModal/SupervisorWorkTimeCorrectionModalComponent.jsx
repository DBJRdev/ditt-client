import PropTypes from 'prop-types';
import React from 'react';
import {
  FormLayout,
  FormLayoutCustomField,
  Grid,
  Modal,
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import { LoadingIcon } from '../../../Icon';
import { validateWorkTimeCorrection } from '../../../../services/validatorService';
import {
  MODE_ADD,
  MODE_SUBTRACT,
} from './constants';
import { getInitialState } from './helpers/getInitialState';
import { getStateToSave } from './helpers/getStateToSave';

class SupervisorWorkTimeCorrectionModalComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = getInitialState(props.workMonth);

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange(e) {
    const eventTarget = e.target;

    if (
      eventTarget.id === 'hour'
      && eventTarget.value
      && (
        eventTarget.value.length > 3
        || Number.isNaN(eventTarget.value)
        || parseInt(eventTarget.value, 10) > 999
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
      onClose,
      setWorkTimeCorrection,
      t,
      workMonth,
    } = this.props;
    const { formData } = this.state;

    const formValidity = validateWorkTimeCorrection(t, formData);
    this.setState({ formValidity });

    if (formValidity.isValid) {
      setWorkTimeCorrection(workMonth.id, getStateToSave(formData))
        .then((response) => {
          if (response.type.endsWith('_FAILURE')) {
            formValidity.elements.form = response.payload.response.detail;

            this.setState({ formValidity });
          } else {
            onClose();
          }
        });
    }
  }

  render() {
    const {
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
            label: t('workMonth:actions.setWorkTimeCorrection'),
            onClick: this.onSave,
            type: 'submit',
          },
        ]}
        onClose={onClose}
        title={t('workMonth:text.workTimeCorrection')}
      >
        <Grid
          columns="1fr"
          justifyContent="center"
          justifyItems="center"
        >
          <FormLayout>
            <SelectField
              id="mode"
              label={t('workMonth:element.variant')}
              onChange={this.onChange}
              options={[
                {
                  label: t('workMonth:text.modeAdd'),
                  value: MODE_ADD,
                },
                {
                  label: t('workMonth:text.modeSubtract'),
                  value: MODE_SUBTRACT,
                },
              ]}
              required
              value={formData.mode || ''}
            />
            <FormLayoutCustomField label={t('workMonth:element.workTimeCorrection')}>
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
          </FormLayout>
        </Grid>
      </Modal>
    );
  }
}

SupervisorWorkTimeCorrectionModalComponent.propTypes = {
  isPosting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setWorkTimeCorrection: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  workMonth: PropTypes.shape({
    id: PropTypes.number.isRequired,
    workTimeCorrection: PropTypes.number.isRequired,
  }).isRequired,
};

export default withTranslation()(SupervisorWorkTimeCorrectionModalComponent);
