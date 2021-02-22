import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
  List,
  ListItem,
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
import {
  toDayMonthYearFormat,
  toMomentDateTimeFromDayMonthYear,
} from '../../../../services/dateTimeService';
import { validateSupervisorWorkLog } from '../../../../services/validatorService';
import styles from './styles.scss';

class AddSupervisorWorkLogModal extends React.Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      formData: {
        date: (data && data.date)
          ? toDayMonthYearFormat(data.date)
          : toDayMonthYearFormat(props.date),
        dateTo: (data && data.date)
          ? toDayMonthYearFormat(data.date)
          : toDayMonthYearFormat(props.date),
        hour: (data && data.workTimeLimit)
          ? Math.floor(data.workTimeLimit / 3600).toString()
          : '0',
        id: (data && data.id) || null,
        minute: (data && data.workTimeLimit)
          ? Math.floor((data.workTimeLimit % 3600) / 60).toString()
          : '00',
        type: (data && data.type) || SICK_DAY_UNPAID_WORK_LOG,
      },
      formValidity: {
        elements: {
          date: null,
          dateTo: null,
          form: null,
          hour: null,
          minute: null,
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
      const workTimeLimit = (parseInt(formData.hour, 10) * 3600)
        + (parseInt(formData.minute, 10) * 60);

      onSave({
        date: toMomentDateTimeFromDayMonthYear(formData.date),
        dateTo: toMomentDateTimeFromDayMonthYear(formData.dateTo),
        id: formData.id || null,
        type: formData.type,
        workTimeLimit,
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
            clickHandler: this.saveHandler,
            label: t('general:action.save'),
            loadingIcon: isPosting
              ? <LoadingIcon />
              : null,
          },
        ]}
        closeHandler={onClose}
        title={data ? t('workLog:modal.edit.title') : t('workLog:modal.add.title')}
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
                  disabled={Boolean(data)}
                  validationText={formValidity.elements.type}
                  id="type"
                  label={t('workLog:element.type')}
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
                  value={formData.type || ''}
                  validationState={formValidity.elements.type ? 'invalid' : null}
                />
              </ListItem>
              <ListItem>
                <TextField
                  changeHandler={this.changeHandler}
                  disabled
                  validationText={formValidity.elements.dateTo}
                  id="date"
                  label={t('workLog:element.dateFrom')}
                  value={formData.date || ''}
                  validationState={formValidity.elements.date ? 'invalid' : null}
                />
              </ListItem>
              <ListItem>
                <TextField
                  changeHandler={this.changeHandler}
                  disabled={Boolean(data)}
                  validationText={formValidity.elements.dateTo}
                  id="dateTo"
                  label={t('workLog:element.dateTo')}
                  value={formData.dateTo || ''}
                  validationState={formValidity.elements.dateTo ? 'invalid' : null}
                />
              </ListItem>
              {formData.type === BAN_WORK_LOG && (
                <ListItem>
                  <div className="mb-1">
                    {t('banWorkLog:element.workTimeLimit')}
                  </div>
                  <div>
                    <div className={styles.fieldDate}>
                      <TextField
                        autoFocus
                        changeHandler={this.changeHandler}
                        validationText={formValidity.elements.hour}
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
                        validationText={formValidity.elements.minute}
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
              )}
            </List>
          </div>
        </form>
      </Modal>
    );
  }
}

AddSupervisorWorkLogModal.defaultProps = {
  data: null,
};

AddSupervisorWorkLogModal.propTypes = {
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
  isPosting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(AddSupervisorWorkLogModal);
