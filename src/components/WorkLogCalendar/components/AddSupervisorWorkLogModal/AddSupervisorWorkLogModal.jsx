import moment from 'moment';
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
import {
  MATERNITY_PROTECTION_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG,
} from '../../../../resources/workMonth';
import {
  toDayMonthYearFormat,
  toMomentDateTimeFromDayMonthYear,
} from '../../../../services/dateTimeService';
import { validateSupervisorWorkLog } from '../../../../services/validatorService';
import styles from './styles.scss';

class AddSupervisorWorkLogModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        date: toDayMonthYearFormat(props.date),
        dateTo: toDayMonthYearFormat(props.date),
        type: MATERNITY_PROTECTION_WORK_LOG,
      },
      formValidity: {
        elements: {
          date: null,
          dateTo: null,
          form: null,
          type: null,
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
      onSave,
      t,
    } = this.props;
    const { formData } = this.state;

    const formValidity = validateSupervisorWorkLog(t, formData);
    this.setState({ formValidity });

    if (formValidity.isValid) {
      onSave({
        date: toMomentDateTimeFromDayMonthYear(formData.date),
        dateTo: toMomentDateTimeFromDayMonthYear(formData.dateTo),
        type: formData.type,
      })
        .then((response) => {
          if (response.type.endsWith('WORK_LOG_FAILURE')) {
            formValidity.elements.form = response.payload.response.detail;

            this.setState({ formValidity });
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
            label: t('general:action.save'),
            loadingIcon: isPosting
              ? <Icon icon="sync" />
              : null,
          },
        ]}
        closeHandler={onClose}
        title={t('workLog:modal.add.title')}
        translations={{ close: t('general:action.close') }}
      >
        {formValidity.elements.form && (
          <p className={styles.formErrorText}>
            {formValidity.elements.form}
          </p>
        )}
        <form>
          <div className={styles.centeredLayout}>
            <List>
              <ListItem>
                <SelectField
                  changeHandler={this.changeHandler}
                  helperText={formValidity.elements.type}
                  id="type"
                  label={t('workLog:element.type')}
                  options={[
                    {
                      label: t('workMonth:constant.type.maternityProtectionWorkLog'),
                      value: MATERNITY_PROTECTION_WORK_LOG,
                    },
                    {
                      label: t('workMonth:constant.type.parentalLeaveWorkLog'),
                      value: PARENTAL_LEAVE_WORK_LOG,
                    },
                  ]}
                  value={formData.type || ''}
                  validationState={formValidity.elements.type ? 'invalid' : null}
                />
              </ListItem>
              <ListItem>
                <TextField
                  changeHandler={this.changeHandler}
                  disabled
                  helperText={formValidity.elements.dateTo}
                  id="date"
                  label={t('workLog:element.dateFrom')}
                  value={formData.date || ''}
                  validationState={formValidity.elements.date ? 'invalid' : null}
                />
              </ListItem>
              <ListItem>
                <TextField
                  changeHandler={this.changeHandler}
                  helperText={formValidity.elements.dateTo}
                  id="dateTo"
                  label={t('vacationWorkLog:element.dateTo')}
                  value={formData.dateTo || ''}
                  validationState={formValidity.elements.dateTo ? 'invalid' : null}
                />
              </ListItem>
            </List>
          </div>
        </form>
      </Modal>
    );
  }
}

AddSupervisorWorkLogModal.propTypes = {
  date: PropTypes.instanceOf(moment).isRequired,
  isPosting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(AddSupervisorWorkLogModal);
