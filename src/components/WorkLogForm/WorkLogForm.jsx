import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button,
  List,
  ListItem,
  Modal,
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import {
  Icon,
  LoadingIcon,
} from '../Icon';
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
  SPECIAL_LEAVE_WORK_LOG,
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

    const { data } = props;

    let date = props.date.clone();
    let startTime = date.clone().subtract(3, 'minutes');
    let endTime = date.clone().add(3, 'minutes');

    if (data && data.date) {
      date = data.date;
      startTime = data.date;
      endTime = data.date;
    } else if (data && data.startTime) {
      date = data.startTime;
      startTime = data.startTime;
      endTime = data.endTime;
    } else if (props.showWorkLogTimer && getWorkLogTimer()) {
      date = toMomentDateTime(getWorkLogTimer());
      startTime = toMomentDateTime(getWorkLogTimer());
      endTime = localizedMoment();
    }

    this.state = {
      formData: {
        childDateOfBirth: (data && data.childDateOfBirth)
          ? toDayMonthYearFormat(data.childDateOfBirth)
          : null,
        childName: (data && data.childName) || null,
        comment: (data && data.comment) || null,
        date: toDayMonthYearFormat(date),
        dateTo: toDayMonthYearFormat(date),
        destination: (data && data.destination) || null,
        endHour: endTime.format('HH'),
        endMinute: endTime.format('mm'),
        expectedArrival: (data && data.expectedArrival) || null,
        expectedDeparture: (data && data.expectedDeparture) || null,
        id: (data && data.id) || null,
        purpose: (data && data.purpose) || null,
        reason: (data && data.reason) || null,
        startHour: startTime.format('HH'),
        startMinute: startTime.format('mm'),
        transport: (data && data.transport) || null,
        type: (data && data.type) || WORK_LOG,
        variant: (data && data.variant) || VARIANT_WITH_NOTE,
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
      workLogTimer: (props.showWorkLogTimer && getWorkLogTimer())
        ? toMomentDateTime(getWorkLogTimer())
        : null,
      workLogTimerInterval: '00:00:00',
    };

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.initAndStartWorkLogTimer = this.initAndStartWorkLogTimer.bind(this);
    this.stopWorkLogTimer = this.stopWorkLogTimer.bind(this);

    this.workLogTimer = null;

    if (this.state.workLogTimer) {
      this.startWorkLogTimer();
    }
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

    this.setState((prevState) => {
      const formData = { ...prevState.formData };
      formData[eventTarget.id] = eventTarget.value;

      return { formData };
    });
  }

  onSave() {
    const {
      banWorkLogsOfDay,
      config,
      date,
      showWorkLogTimer,
      user,
      workLogsOfDay,
    } = this.props;
    const { formData } = this.state;

    const modifiedFormData = { ...formData };
    modifiedFormData.expectedArrival = formData.expectedArrival || '23:59';
    modifiedFormData.expectedDeparture = formData.expectedDeparture || '00:00';

    const formValidity = validateWorkLog(
      this.props.t,
      modifiedFormData,
      config,
      user,
      workLogsOfDay.toJS(),
      banWorkLogsOfDay.toJS(),
    );

    this.setState({ formValidity });

    if (formValidity.isValid) {
      if (formData.type === WORK_LOG && showWorkLogTimer) {
        clearInterval(this.workLogTimer);

        this.setState({
          workLogTimer: null,
          workLogTimerInterval: '00:00:00',
        });
        removeWorkLogTimer();
      }

      this.props.onSave({
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
        dateTo: (
          formData.type === BUSINESS_TRIP_WORK_LOG
          || formData.type === HOME_OFFICE_WORK_LOG
          || formData.type === SICK_DAY_WORK_LOG
          || formData.type === SPECIAL_LEAVE_WORK_LOG
          || formData.type === TIME_OFF_WORK_LOG
          || formData.type === VACATION_WORK_LOG
        )
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
        id: formData.id || null,
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
    }, () => {
      setWorkLogTimer(toJson(startTime));
      this.startWorkLogTimer();
    });
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
          type: WORK_LOG,
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
      this.props.onSave({
        endTime,
        startTime,
        type: WORK_LOG,
      });
    }
  }

  renderBusinessTripWorkLogFields() {
    const {
      data,
      t,
    } = this.props;

    return (
      <>
        <ListItem>
          <TextField
            disabled={Boolean(data)}
            validationText={this.state.formValidity.elements.dateTo}
            id="dateTo"
            onChange={this.onChange}
            label={t('workLog:element.dateTo')}
            value={this.state.formData.dateTo || ''}
            validationState={this.state.formValidity.elements.dateTo ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.purpose}
            id="purpose"
            label={t('businessTripWorkLog:element.purpose')}
            onChange={this.onChange}
            value={this.state.formData.purpose || ''}
            validationState={this.state.formValidity.elements.purpose ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.destination}
            id="destination"
            label={t('businessTripWorkLog:element.destination')}
            onChange={this.onChange}
            value={this.state.formData.destination || ''}
            validationState={this.state.formValidity.elements.destination ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.transport}
            id="transport"
            label={t('businessTripWorkLog:element.transport')}
            onChange={this.onChange}
            value={this.state.formData.transport || ''}
            validationState={this.state.formValidity.elements.transport ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.expectedDeparture}
            id="expectedDeparture"
            label={t('businessTripWorkLog:element.expectedDeparture')}
            onChange={this.onChange}
            value={this.state.formData.expectedDeparture || ''}
            validationState={this.state.formValidity.elements.expectedDeparture ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.expectedArrival}
            id="expectedArrival"
            label={t('businessTripWorkLog:element.expectedArrival')}
            onChange={this.onChange}
            value={this.state.formData.expectedArrival || ''}
            validationState={this.state.formValidity.elements.expectedArrival ? 'invalid' : null}
          />
        </ListItem>
      </>
    );
  }

  renderHomeOfficeWorkLogFields() {
    const {
      data,
      t,
    } = this.props;

    return (
      <>
        <ListItem>
          <TextField
            disabled={Boolean(data)}
            validationText={this.state.formValidity.elements.dateTo}
            id="dateTo"
            label={t('workLog:element.dateTo')}
            onChange={this.onChange}
            value={this.state.formData.dateTo || ''}
            validationState={this.state.formValidity.elements.dateTo ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.comment}
            id="comment"
            label={t('homeOfficeWorkLog:element.comment')}
            onChange={this.onChange}
            value={this.state.formData.comment || ''}
            validationState={this.state.formValidity.elements.comment ? 'invalid' : null}
          />
        </ListItem>
      </>
    );
  }

  renderOvertimeWorkLogFields() {
    const { t } = this.props;

    return (
      <ListItem>
        <TextField
          validationText={this.state.formValidity.elements.reason}
          id="reason"
          label={t('overtimeWorkLog:element.reason')}
          onChange={this.onChange}
          value={this.state.formData.reason || ''}
          validationState={this.state.formValidity.elements.reason ? 'invalid' : null}
        />
      </ListItem>
    );
  }

  renderSickDayWorkLogFields() {
    const {
      data,
      t,
    } = this.props;

    return (
      <>
        <ListItem>
          <TextField
            disabled={Boolean(data)}
            validationText={this.state.formValidity.elements.dateTo}
            id="dateTo"
            label={t('workLog:element.dateTo')}
            onChange={this.onChange}
            value={this.state.formData.dateTo || ''}
            validationState={this.state.formValidity.elements.dateTo ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <SelectField
            validationText={this.state.formValidity.elements.variant}
            id="variant"
            label={t('sickDayWorkLog:element.variant')}
            onChange={this.onChange}
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
            validationState={this.state.formValidity.elements.variant ? 'invalid' : null}
            value={this.state.formData.variant || ''}
          />
        </ListItem>
      </>
    );
  }

  renderSickDayWorkLogSickChildFields() {
    const { t } = this.props;

    return (
      <>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.childName}
            id="childName"
            label={t('sickDayWorkLog:element.childName')}
            onChange={this.onChange}
            value={this.state.formData.childName || ''}
            validationState={this.state.formValidity.elements.childName ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.childDateOfBirth}
            id="childDateOfBirth"
            label={t('sickDayWorkLog:element.childDateOfBirth')}
            onChange={this.onChange}
            value={this.state.formData.childDateOfBirth || ''}
            validationState={this.state.formValidity.elements.childDateOfBirth ? 'invalid' : null}
          />
        </ListItem>
      </>
    );
  }

  renderSpecialLeaveWorkLogFields() {
    const {
      data,
      t,
    } = this.props;

    return (
      <ListItem>
        <TextField
          disabled={Boolean(data)}
          validationText={this.state.formValidity.elements.dateTo}
          id="dateTo"
          label={t('workLog:element.dateTo')}
          onChange={this.onChange}
          value={this.state.formData.dateTo || ''}
          validationState={this.state.formValidity.elements.dateTo ? 'invalid' : null}
        />
      </ListItem>
    );
  }

  renderTimeOffWorkLogFields() {
    const {
      data,
      t,
    } = this.props;

    return (
      <>
        <ListItem>
          <TextField
            disabled={Boolean(data)}
            validationText={this.state.formValidity.elements.dateTo}
            id="dateTo"
            label={t('workLog:element.dateTo')}
            onChange={this.onChange}
            value={this.state.formData.dateTo || ''}
            validationState={this.state.formValidity.elements.dateTo ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            validationText={this.state.formValidity.elements.comment}
            id="comment"
            label={t('timeOffWorkLog:element.comment')}
            onChange={this.onChange}
            value={this.state.formData.comment || ''}
            validationState={this.state.formValidity.elements.comment ? 'invalid' : null}
          />
        </ListItem>
      </>
    );
  }

  renderVacationWorkLogFields() {
    const {
      data,
      t,
    } = this.props;

    return (
      <ListItem>
        <TextField
          disabled={Boolean(data)}
          validationText={this.state.formValidity.elements.dateTo}
          id="dateTo"
          label={t('workLog:element.dateTo')}
          onChange={this.onChange}
          value={this.state.formData.dateTo || ''}
          validationState={this.state.formValidity.elements.dateTo ? 'invalid' : null}
        />
      </ListItem>
    );
  }

  renderWorkLogFields() {
    const { t } = this.props;
    const {
      formData,
      formValidity,
    } = this.state;

    return (
      <>
        <ListItem>
          <div className="mb-1">
            {t('workLog:element.startTime')}
          </div>
          <div>
            <div className={styles.fieldDate}>
              <TextField
                autoFocus
                validationText={formValidity.elements.startHour}
                id="startHour"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.startHour')}
                max={23}
                min={0}
                onChange={this.onChange}
                type="number"
                value={formData.startHour || ''}
                validationState={this.state.formValidity.elements.startHour ? 'invalid' : null}
              />
            </div>
            <span className={styles.colon}>:</span>
            <div className={styles.fieldDate}>
              <TextField
                validationText={formValidity.elements.startMinute}
                id="startMinute"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.startMinute')}
                max={59}
                min={0}
                onChange={this.onChange}
                type="number"
                value={formData.startMinute || ''}
                validationState={this.state.formValidity.elements.startMinute ? 'invalid' : null}
              />
            </div>
            &nbsp;h
          </div>
        </ListItem>
        <ListItem>
          <div className="mb-1">
            {t('workLog:element.endTime')}
          </div>
          <div>
            <div className={styles.fieldDate}>
              <TextField
                validationText={formValidity.elements.endHour}
                id="endHour"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.endHour')}
                max={23}
                min={0}
                onChange={this.onChange}
                type="number"
                value={formData.endHour || ''}
                validationState={this.state.formValidity.elements.endHour ? 'invalid' : null}
              />
            </div>
            <span className={styles.colon}>:</span>
            <div className={styles.fieldDate}>
              <TextField
                validationText={formValidity.elements.endMinute}
                id="endMinute"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.endMinute')}
                max={59}
                min={0}
                onChange={this.onChange}
                type="number"
                value={formData.endMinute || ''}
                validationState={this.state.formValidity.elements.endMinute ? 'invalid' : null}
              />
            </div>
            &nbsp;h
          </div>
        </ListItem>
      </>
    );
  }

  render() {
    const {
      data,
      showWorkLogTimer,
      t,
    } = this.props;
    const {
      formData,
      formValidity,
      workLogTimer,
      workLogTimerInterval,
    } = this.state;

    return (
      <Modal
        actions={[
          {
            feedbackIcon: this.props.isPosting ? <LoadingIcon /> : null,
            label: t('general:action.save'),
            onClick: this.onSave,
          },
        ]}
        onClose={this.props.onClose}
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
              {this.props.showInfoText && (
                <ListItem>
                  <p className={styles.formInfoText}>
                    {t('workLog:modal.add.alreadySendForApprovalDescription')}
                  </p>
                </ListItem>
              )}
              {showWorkLogTimer && (
                <ListItem>
                  {
                    this.state.workLogTimer
                      ? (
                        <Button
                          beforeLabel={<Icon icon="stop" />}
                          block
                          label={`${t('workLog:action.endWork')} | ${workLogTimerInterval}`}
                          onClick={this.stopWorkLogTimer}
                        />
                      ) : (
                        <Button
                          beforeLabel={<Icon icon="play_arrow" />}
                          block
                          label={t('workLog:action.startWork')}
                          onClick={this.initAndStartWorkLogTimer}
                        />
                      )
                  }
                </ListItem>
              )}
              <ListItem>
                <TextField
                  disabled
                  id="date"
                  label={
                    t((
                      (
                        formData.type === BUSINESS_TRIP_WORK_LOG
                        || formData.type === HOME_OFFICE_WORK_LOG
                        || formData.type === SICK_DAY_WORK_LOG
                        || formData.type === SPECIAL_LEAVE_WORK_LOG
                        || formData.type === TIME_OFF_WORK_LOG
                        || formData.type === VACATION_WORK_LOG
                      )
                        ? 'workLog:element.dateFrom'
                        : 'workLog:element.date'
                    ))
                  }
                  value={toDayMonthYearFormat(this.props.date) || ''}
                />
              </ListItem>
              <ListItem>
                <SelectField
                  disabled={Boolean(data) || (showWorkLogTimer && workLogTimer)}
                  validationText={formValidity.elements.type}
                  id="type"
                  label={t('workLog:element.type')}
                  onChange={this.onChange}
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
                      label: t('workMonth:constant.type.specialLeaveWorkLog'),
                      value: SPECIAL_LEAVE_WORK_LOG,
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
                  validationState={formValidity.elements.type ? 'invalid' : null}
                />
              </ListItem>
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
                formData.type === SPECIAL_LEAVE_WORK_LOG
                && this.renderSpecialLeaveWorkLogFields()
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
            </List>
          </div>
        </form>
      </Modal>
    );
  }
}

WorkLogForm.defaultProps = {
  data: null,
  showInfoText: false,
  showWorkLogTimer: false,
};

WorkLogForm.propTypes = {
  banWorkLogsOfDay: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    date: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    workTimeLimit: PropTypes.shape.isRequired,
  })).isRequired,
  config: ImmutablePropTypes.mapContains({}).isRequired,
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
      VACATION_WORK_LOG,
      WORK_LOG,
    ]).isRequired,
    variant: PropTypes.string,
    workTimeLimit: PropTypes.number,
  }),
  date: PropTypes.instanceOf(moment).isRequired,
  isPosting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  showInfoText: PropTypes.bool,
  showWorkLogTimer: PropTypes.bool,
  t: PropTypes.func.isRequired,
  user: ImmutablePropTypes.mapContains({
    vacations: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      remainingVacationDays: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  workLogsOfDay: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default withTranslation()(WorkLogForm);
