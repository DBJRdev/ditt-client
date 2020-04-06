import PropTypes from 'prop-types';
import React from 'react';
import {
  Icon,
  List,
  ListItem,
  Modal,
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import styles from '../../../WorkLogForm/WorkLogForm.scss';
import { validateWorkTimeCorrection } from '../../../../services/validatorService';

const MODE_ADD = 'MODE_ADD';
const MODE_SUBTRACT = 'MODE_SUBTRACT';

class SupervisorWorkTimeCorrectionModal extends React.Component {
  constructor(props) {
    super(props);

    const { workMonth } = props;

    let hour = '00';
    let minute = '00';
    let mode = MODE_ADD;

    if (workMonth.workTimeCorrection > 0) {
      hour = parseInt(workMonth.workTimeCorrection / 3600, 10);
      minute = parseInt((workMonth.workTimeCorrection - (hour * 3600)) / 60, 10);
    } else if (workMonth.workTimeCorrection < 0) {
      mode = MODE_SUBTRACT;
      hour = parseInt((workMonth.workTimeCorrection * -1) / 3600, 10);
      minute = parseInt(((workMonth.workTimeCorrection * -1) - (hour * 3600)) / 60, 10);
    }

    if (hour === 0) {
      minute = '00';
    }
    if (minute === 0) {
      minute = '00';
    }

    this.state = {
      formData: {
        hour,
        minute,
        mode,
      },
      formValidity: {
        elements: {
          form: null,
          hour: null,
          minute: null,
        },
        isValid: false,
      },
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
  }

  changeHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [eventTarget.id]: eventTarget.value,
      },
    }));
  }

  saveHandler() {
    const {
      onClose,
      onSetWorkTimeCorrection,
      t,
      workMonth,
    } = this.props;
    const { formData } = this.state;

    const formValidity = validateWorkTimeCorrection(t, formData);
    this.setState({ formValidity });

    if (formValidity.isValid) {
      let workTimeCorrection = (parseInt(formData.hour, 10) * 3600)
        + (parseInt(formData.minute, 10) * 60);

      if (formData.mode === MODE_SUBTRACT) {
        workTimeCorrection *= -1;
      }

      onSetWorkTimeCorrection(workMonth.id, { workTimeCorrection })
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
            clickHandler: this.saveHandler,
            label: t('workMonth:actions.setWorkTimeCorrection'),
            loadingIcon: isPosting ? <Icon icon="sync" /> : null,
          },
        ]}
        closeHandler={onClose}
        title={t('workMonth:text.workTimeCorrection')}
        translations={{ close: t('general:action.close') }}
      >
        <div className={styles.centeredLayout}>
          <List>
            <SelectField
              changeHandler={this.changeHandler}
              id="mode"
              label={t('workMonth:element.variant')}
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
            />
            <ListItem>
              <div className="mb-1 mt-2">
                {t('workMonth:element.workTimeCorrection')}
              </div>
              <div>
                <div className={styles.fieldDate}>
                  <TextField
                    autoFocus
                    changeHandler={this.changeHandler}
                    helperText={formValidity.elements.hour}
                    id="hour"
                    inputSize={2}
                    isLabelVisible={false}
                    label={t('workMonth:element.hours')}
                    required
                    value={formData.hour || ''}
                    validationState={formValidity.elements.hour ? 'invalid' : null}
                  />
                </div>
                <span className={styles.colon}>:</span>
                <div className={styles.fieldDate}>
                  <TextField
                    changeHandler={this.changeHandler}
                    helperText={formValidity.elements.minute}
                    id="minute"
                    inputSize={2}
                    isLabelVisible={false}
                    label={t('workMonth:element.minutes')}
                    required
                    value={formData.minute || ''}
                    validationState={formValidity.elements.minute ? 'invalid' : null}
                  />
                </div>
                &nbsp;h
              </div>
            </ListItem>
          </List>
        </div>
      </Modal>
    );
  }
}

SupervisorWorkTimeCorrectionModal.propTypes = {
  isPosting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSetWorkTimeCorrection: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  workMonth: PropTypes.shape({
    id: PropTypes.number.isRequired,
    workTimeCorrection: PropTypes.number.isRequired,
  }).isRequired,
};

export default withTranslation()(SupervisorWorkTimeCorrectionModal);
