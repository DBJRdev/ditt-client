import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Modal,
  SelectField,
  TextField,
} from 'react-ui';
import {
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
  VARIANT_SICK_CHILD,
} from '../../resources/sickDayWorkLog';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../resources/workMonth';
import {
  localizedMoment,
  toDayMonthYearFormat,
  toJson,
  toMomentDateTime,
  toMomentDateTimeFromDayMonthYear,
} from '../../services/dateTimeService';
import {
  getWorkLogTimer,
  removeWorkLogTimer,
  setWorkLogTimer,
} from '../../services/storageService';
import { validateWorkLog } from '../../services/validatorService';
import styles from './WorkLogForm.scss';

class WorkLogForm extends React.Component {
  constructor(props) {
    super(props);
    let date = props.date.clone();
    let startTime = date.clone().subtract(3, 'minutes');
    let endTime = date.clone().add(3, 'minutes');

    if (props.showWorkLogTimer && getWorkLogTimer()) {
      date = toMomentDateTime(getWorkLogTimer());
      startTime = toMomentDateTime(getWorkLogTimer());
      endTime = localizedMoment();
    }

    this.state = {
      formData: {
        childDateOfBirth: null,
        childName: null,
        comment: null,
        date: toDayMonthYearFormat(date),
        dateTo: toDayMonthYearFormat(date),
        destination: null,
        endHour: endTime.format('HH'),
        endMinute: endTime.format('mm'),
        expectedArrival: null,
        expectedDeparture: null,
        purpose: null,
        reason: null,
        startHour: startTime.format('HH'),
        startMinute: startTime.format('mm'),
        transport: null,
        type: WORK_LOG,
        variant: VARIANT_WITH_NOTE,
      },
      formValidity: {
        elements: {
          childDateOfBirth: null,
          childName: null,
          comment: null,
          dateTo: null,
          destination: null,
          endHour: null,
          endMinute: null,
          expectedArrival: null,
          expectedDeparture: null,
          form: null,
          purpose: null,
          reason: null,
          startHour: null,
          startMinute: null,
          transport: null,
          type: null,
        },
        isValid: false,
      },
      workLogTimer: getWorkLogTimer() ? toMomentDateTime(getWorkLogTimer()) : null,
      workLogTimerInterval: '00:00:00',
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.initAndStartWorkLogTimer = this.initAndStartWorkLogTimer.bind(this);
    this.stopWorkLogTimer = this.stopWorkLogTimer.bind(this);

    this.workLogTimer = null;

    if (this.state.workLogTimer) {
      this.startWorkLogTimer();
    }
  }

  changeHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const formData = Object.assign({}, prevState.formData);
      formData[eventTarget.id] = eventTarget.value;

      return { formData };
    });
  }

  saveHandler() {
    const {
      config,
      date,
      user,
      workLogsOfDay,
    } = this.props;
    const { formData } = this.state;

    const modifiedFormData = Object.assign({}, formData);
    modifiedFormData.expectedArrival = formData.expectedArrival || '23:59';
    modifiedFormData.expectedDeparture = formData.expectedDeparture || '00:00';

    const formValidity = validateWorkLog(
      this.props.t,
      modifiedFormData,
      config,
      user,
      workLogsOfDay.toJS()
    );

    this.setState({ formValidity });

    if (formValidity.isValid) {
      if (formData.type === WORK_LOG) {
        clearInterval(this.workLogTimer);

        this.setState({
          workLogTimer: null,
          workLogTimerInterval: '00:00:00',
        });
        removeWorkLogTimer();
      }

      this.props.saveHandler({
        childDateOfBirth:
          (formData.type === SICK_DAY_WORK_LOG && formData.variant === VARIANT_SICK_CHILD)
            ? toMomentDateTimeFromDayMonthYear(formData.childDateOfBirth)
            : null,
        childName: (formData.type === SICK_DAY_WORK_LOG && formData.variant === VARIANT_SICK_CHILD)
          ? formData.childName
          : null,
        comment: (formData.type === HOME_OFFICE_WORK_LOG || formData.type === TIME_OFF_WORK_LOG)
          ? formData.comment
          : null,
        date: formData.type !== WORK_LOG
          ? date.clone()
          : null,
        dateTo: formData.type === VACATION_WORK_LOG
          ? toMomentDateTimeFromDayMonthYear(formData.dateTo)
          : null,
        destination: formData.type === BUSINESS_TRIP_WORK_LOG
          ? formData.destination
          : null,
        endTime: formData.type === WORK_LOG
          ? date.clone().hour(formData.endHour).minute(formData.endMinute).second(0)
          : null,
        expectedArrival: formData.type === BUSINESS_TRIP_WORK_LOG
          ? formData.expectedArrival || '23:59'
          : null,
        expectedDeparture: formData.type === BUSINESS_TRIP_WORK_LOG
          ? formData.expectedDeparture || '00:00'
          : null,
        purpose: formData.type === BUSINESS_TRIP_WORK_LOG
          ? formData.purpose
          : null,
        reason: formData.type === OVERTIME_WORK_LOG
          ? formData.reason
          : null,
        startTime: formData.type === WORK_LOG
          ? date.clone().hour(formData.startHour).minute(formData.startMinute).second(0)
          : null,
        transport: formData.type === BUSINESS_TRIP_WORK_LOG
          ? formData.transport
          : null,
        type: formData.type,
        variant: formData.type === SICK_DAY_WORK_LOG
          ? formData.variant
          : null,
      })
        .then((response) => {
          if (response.type.endsWith('WORK_LOG_FAILURE')) {
            formValidity.elements.form = response.payload.response.detail;

            this.setState({ formValidity });
          }
        });
    }
  }

  initAndStartWorkLogTimer() {
    const { formData } = this.state;
    const startTime = localizedMoment();

    this.setState({
      formData: {
        ...formData,
        date: startTime,
        endHour: startTime.format('HH'),
        endMinute: startTime.format('mm'),
        startHour: startTime.format('HH'),
        startMinute: startTime.format('mm'),
      },
      workLogTimer: startTime,
    });
    setWorkLogTimer(toJson(startTime));

    this.startWorkLogTimer();
  }

  startWorkLogTimer() {
    const {
      formData,
      workLogTimer,
    } = this.state;

    this.workLogTimer = setInterval(() => {
      const endTime = localizedMoment();
      const intervalMiliseconds = endTime.diff(workLogTimer);
      const interval = moment.utc(intervalMiliseconds);

      this.setState({
        formData: {
          ...formData,
          endHour: endTime.format('HH'),
          endMinute: endTime.format('mm'),
        },
        workLogTimerInterval: interval.format('HH:mm:ss'),
      });
    }, 1000);
  }

  stopWorkLogTimer() {
    const startTime = toMomentDateTime(getWorkLogTimer());
    const endTime = localizedMoment();
    const intervalMiliseconds = endTime.diff(this.state.workLogTimer);

    clearInterval(this.workLogTimer);

    this.setState({
      workLogTimer: null,
      workLogTimerInterval: '00:00:00',
    });
    removeWorkLogTimer();

    if (intervalMiliseconds >= 30000) {
      this.props.saveHandler({
        endTime,
        startTime,
        type: WORK_LOG,
      });
    }
  }

  renderBusinessTripWorkLogFields() {
    const { t } = this.props;

    return (
      <fieldset className={styles.fieldset}>
        <legend>{t('businessTripWorkLog:element.purpose')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.purpose}
            fieldId="purpose"
            isLabelVisible={false}
            label={t('businessTripWorkLog:element.purpose')}
            value={this.state.formData.purpose || ''}
          />
        </div>
        <legend>{t('businessTripWorkLog:element.destination')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.destination}
            fieldId="destination"
            isLabelVisible={false}
            label={t('businessTripWorkLog:element.destination')}
            value={this.state.formData.destination || ''}
          />
        </div>
        <legend>{t('businessTripWorkLog:element.transport')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.transport}
            fieldId="transport"
            isLabelVisible={false}
            label={t('businessTripWorkLog:element.transport')}
            value={this.state.formData.transport || ''}
          />
        </div>
        <legend>{t('businessTripWorkLog:element.expectedDeparture')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.expectedDeparture}
            fieldId="expectedDeparture"
            isLabelVisible={false}
            label={t('businessTripWorkLog:element.expectedDeparture')}
            value={this.state.formData.expectedDeparture || ''}
          />
        </div>
        <legend>{t('businessTripWorkLog:element.expectedArrival')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.expectedArrival}
            fieldId="expectedArrival"
            isLabelVisible={false}
            label={t('businessTripWorkLog:element.expectedArrival')}
            value={this.state.formData.expectedArrival || ''}
          />
        </div>
      </fieldset>
    );
  }

  renderHomeOfficeWorkLogFields() {
    const { t } = this.props;

    return (
      <fieldset className={styles.fieldset}>
        <legend>{t('homeOfficeWorkLog:element.comment')}</legend>
        <div style={this.fieldStyle}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.comment}
            fieldId="comment"
            isLabelVisible={false}
            label={t('homeOfficeWorkLog:element.comment')}
            value={this.state.formData.comment || ''}
          />
        </div>
      </fieldset>
    );
  }

  renderOvertimeWorkLogFields() {
    const { t } = this.props;

    return (
      <fieldset className={styles.fieldset}>
        <legend>{t('overtimeWorkLog:element.reason')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.reason}
            fieldId="reason"
            isLabelVisible={false}
            label={t('overtimeWorkLog:element.reason')}
            value={this.state.formData.reason || ''}
          />
        </div>
      </fieldset>
    );
  }

  renderSickDayWorkLogFields() {
    const { t } = this.props;

    return (
      <fieldset className={styles.fieldset}>
        <legend>{t('sickDayWorkLog:element.variant')}</legend>
        <div className={styles.field}>
          <SelectField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.variant}
            fieldId="variant"
            isLabelVisible={false}
            label={t('sickDayWorkLog:element.variant')}
            options={[
              {
                label: t('sickDayWorkLog:constant.variant.withNote'),
                value: VARIANT_WITH_NOTE,
              },
              {
                label: t('sickDayWorkLog:constant.variant.withoutNote'),
                value: VARIANT_WITHOUT_NOTE,
              },
              {
                label: t('sickDayWorkLog:constant.variant.sickChild'),
                value: VARIANT_SICK_CHILD,
              },
            ]}
            value={this.state.formData.variant || ''}
          />
        </div>
      </fieldset>
    );
  }

  renderSickDayWorkLogSickChildFields() {
    const { t } = this.props;

    return (
      <fieldset className={styles.fieldset}>
        <legend>{t('sickDayWorkLog:element.childName')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.childName}
            fieldId="childName"
            isLabelVisible={false}
            label={t('sickDayWorkLog:element.childName')}
            value={this.state.formData.childName || ''}
          />
        </div>
        <legend>{t('sickDayWorkLog:element.childDateOfBirth')}</legend>
        <div className={styles.field}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.childDateOfBirth}
            fieldId="childDateOfBirth"
            isLabelVisible={false}
            label={t('sickDayWorkLog:element.childDateOfBirth')}
            value={this.state.formData.childDateOfBirth || ''}
          />
        </div>
      </fieldset>
    );
  }

  renderTimeOffWorkLogFields() {
    const { t } = this.props;

    return (
      <fieldset className={styles.fieldset}>
        <legend>{t('timeOffWorkLog:element.comment')}</legend>
        <div style={this.fieldStyle}>
          <TextField
            changeHandler={this.changeHandler}
            error={this.state.formValidity.elements.comment}
            fieldId="comment"
            isLabelVisible={false}
            label={t('timeOffWorkLog:element.comment')}
            value={this.state.formData.comment || ''}
          />
        </div>
      </fieldset>
    );
  }

  renderVacationWorkLogFields() {
    const { t } = this.props;

    return (
      <fieldset className={styles.fieldset}>
        <legend>{t('vacationWorkLog:element.dateTo')}</legend>
        <div style={this.fieldStyle}>
          <TextField
            error={this.state.formValidity.elements.dateTo}
            changeHandler={this.changeHandler}
            fieldId="dateTo"
            isLabelVisible={false}
            label={t('vacationWorkLog:element.dateTo')}
            value={this.state.formData.dateTo || ''}
          />
        </div>
      </fieldset>
    );
  }

  renderWorkLogFields() {
    const { t } = this.props;
    const {
      formData,
      formValidity,
    } = this.state;

    return (
      <React.Fragment>
        <fieldset className={styles.fieldset}>
          <legend>{t('workLog:element.startTime')}</legend>
          <div>
            <div className={[styles.field, styles.fieldDate].join(' ')}>
              <TextField
                autoFocus
                changeHandler={this.changeHandler}
                error={formValidity.elements.startHour}
                fieldId="startHour"
                isLabelVisible={false}
                label={t('workLog:element.startHour')}
                value={formData.startHour || ''}
              />
            </div>
            :
            <div className={[styles.field, styles.fieldDate].join(' ')}>
              <TextField
                changeHandler={this.changeHandler}
                error={formValidity.elements.startMinute}
                fieldId="startMinute"
                isLabelVisible={false}
                label={t('workLog:element.startMinute')}
                value={formData.startMinute || ''}
              />
            </div>
            &nbsp;h
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>{t('workLog:element.endTime')}</legend>
          <div>
            <div className={[styles.field, styles.fieldDate].join(' ')}>
              <TextField
                changeHandler={this.changeHandler}
                error={formValidity.elements.endHour}
                fieldId="endHour"
                isLabelVisible={false}
                label={t('workLog:element.endHour')}
                value={formData.endHour || ''}
              />
            </div>
            :
            <div className={[styles.field, styles.fieldDate].join(' ')}>
              <TextField
                changeHandler={this.changeHandler}
                error={formValidity.elements.endMinute}
                fieldId="endMinute"
                isLabelVisible={false}
                label={t('workLog:element.endMinute')}
                value={formData.endMinute || ''}
              />
            </div>
            &nbsp;h
          </div>
        </fieldset>
      </React.Fragment>
    );
  }

  render() {
    const {
      showWorkLogTimer,
      t,
    } = this.props;
    const {
      formData,
      formValidity,
      workLogTimerInterval,
    } = this.state;

    return (
      <Modal
        actions={[
          {
            clickHandler: this.saveHandler,
            label: t('general:action.save'),
            loading: this.props.isPosting,
          },
        ]}
        closeHandler={this.props.closeHandler}
        title={t('workLog:modal.add.title')}
        translations={{ close: t('general:action.close') }}
      >
        <p className={styles.formErrorText}>
          {formValidity.elements.form}
        </p>
        <form>
          {this.props.showInfoText && (
            <fieldset className={styles.fieldset}>
              <div className={styles.field}>
                <p className={styles.formInfoText}>
                  {t('workLog:modal.add.alreadySendForApprovalDescription')}
                </p>
              </div>
            </fieldset>
          )}
          {showWorkLogTimer && (
            <fieldset className={styles.fieldset}>
              <div className={styles.workLogTimerButton}>
                {
                  this.state.workLogTimer
                    ? (
                      <Button
                        clickHandler={this.stopWorkLogTimer}
                        icon="stop"
                        label={`${t('workLog:action.endWork')} | ${workLogTimerInterval}`}
                        priority="primary"
                      />
                    ) : (
                      <Button
                        clickHandler={this.initAndStartWorkLogTimer}
                        icon="play_arrow"
                        label={t('workLog:action.startWork')}
                        priority="primary"
                      />
                    )
                }
              </div>
            </fieldset>
          )}
          <fieldset className={styles.fieldset}>
            <legend>
              {t((
                formData.type === VACATION_WORK_LOG
                  ? 'vacationWorkLog:element.dateFrom'
                  : 'workLog:element.date'
              ))}
            </legend>
            <div className={styles.field}>
              <TextField
                disabled
                fieldId="date"
                isLabelVisible={false}
                label={
                  t((
                    formData.type === VACATION_WORK_LOG
                      ? 'vacationWorkLog:element.dateFrom'
                      : 'workLog:element.date'
                  ))
                }
                value={toDayMonthYearFormat(this.props.date) || ''}
              />
            </div>
          </fieldset>
          <fieldset className={styles.fieldset}>
            <legend>{t('workLog:element.type')}</legend>
            <div className={styles.field}>
              <SelectField
                changeHandler={this.changeHandler}
                error={formValidity.elements.type}
                fieldId="type"
                isLabelVisible={false}
                label={t('workLog:element.type')}
                options={[
                  {
                    label: t('workMonth:constant.type.workLog'),
                    value: WORK_LOG,
                  },
                  {
                    label: t('workMonth:constant.type.businessTripWorkLog'),
                    value: BUSINESS_TRIP_WORK_LOG,
                  },
                  {
                    label: t('workMonth:constant.type.homeOfficeWorkLog'),
                    value: HOME_OFFICE_WORK_LOG,
                  },
                  {
                    label: t('workMonth:constant.type.overtimeWorkLog'),
                    value: OVERTIME_WORK_LOG,
                  },
                  {
                    label: t('workMonth:constant.type.sickDayWorkLog'),
                    value: SICK_DAY_WORK_LOG,
                  },
                  {
                    label: t('workMonth:constant.type.timeOffWorkLog'),
                    value: TIME_OFF_WORK_LOG,
                  },
                  {
                    label: t('workMonth:constant.type.vacationWorkLog'),
                    value: VACATION_WORK_LOG,
                  },
                ]}
                value={formData.type || ''}
              />
            </div>
          </fieldset>
          {
            formData.type === BUSINESS_TRIP_WORK_LOG
            && this.renderBusinessTripWorkLogFields()
          }
          {
            formData.type === HOME_OFFICE_WORK_LOG
            && this.renderHomeOfficeWorkLogFields()
          }
          {formData.type === OVERTIME_WORK_LOG && this.renderOvertimeWorkLogFields()}
          {formData.type === SICK_DAY_WORK_LOG && this.renderSickDayWorkLogFields()}
          {
            formData.type === SICK_DAY_WORK_LOG
              && formData.variant === VARIANT_SICK_CHILD
              && this.renderSickDayWorkLogSickChildFields()
          }
          {
            formData.type === TIME_OFF_WORK_LOG
            && this.renderTimeOffWorkLogFields()
          }
          {
            formData.type === VACATION_WORK_LOG
            && this.renderVacationWorkLogFields()
          }
          {formData.type === WORK_LOG && this.renderWorkLogFields()}
        </form>
      </Modal>
    );
  }
}

WorkLogForm.defaultProps = {
  showInfoText: false,
  showWorkLogTimer: false,
};

WorkLogForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  config: ImmutablePropTypes.mapContains({}).isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  isPosting: PropTypes.bool.isRequired,
  saveHandler: PropTypes.func.isRequired,
  showInfoText: PropTypes.bool,
  showWorkLogTimer: PropTypes.bool,
  t: PropTypes.func.isRequired,
  user: ImmutablePropTypes.mapContains({
    remainingVacationDaysByYear: ImmutablePropTypes.mapContains({}).isRequired,
  }).isRequired,
  workLogsOfDay: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default withNamespaces()(WorkLogForm);
