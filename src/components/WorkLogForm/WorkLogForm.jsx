import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Icon,
  List,
  ListItem,
  Modal,
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
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
      const formData = { ...prevState.formData };
      formData[eventTarget.id] = eventTarget.value;

      return { formData };
    });
  }

  saveHandler() {
    const {
      banWorkLogsOfDay,
      config,
      date,
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
        dateTo: (formData.type === SPECIAL_LEAVE_WORK_LOG || formData.type === VACATION_WORK_LOG)
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
      <>
        <ListItem>
          <TextField
            changeHandler={this.changeHandler}
            helperText={this.state.formValidity.elements.purpose}
            id="purpose"
            label={t('businessTripWorkLog:element.purpose')}
            value={this.state.formData.purpose || ''}
            validationState={this.state.formValidity.elements.purpose ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            changeHandler={this.changeHandler}
            helperText={this.state.formValidity.elements.destination}
            id="destination"
            label={t('businessTripWorkLog:element.destination')}
            value={this.state.formData.destination || ''}
            validationState={this.state.formValidity.elements.destination ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            changeHandler={this.changeHandler}
            helperText={this.state.formValidity.elements.transport}
            id="transport"
            label={t('businessTripWorkLog:element.transport')}
            value={this.state.formData.transport || ''}
            validationState={this.state.formValidity.elements.transport ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            changeHandler={this.changeHandler}
            helperText={this.state.formValidity.elements.expectedDeparture}
            id="expectedDeparture"
            label={t('businessTripWorkLog:element.expectedDeparture')}
            value={this.state.formData.expectedDeparture || ''}
            validationState={this.state.formValidity.elements.expectedDeparture ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            changeHandler={this.changeHandler}
            helperText={this.state.formValidity.elements.expectedArrival}
            id="expectedArrival"
            label={t('businessTripWorkLog:element.expectedArrival')}
            value={this.state.formData.expectedArrival || ''}
            validationState={this.state.formValidity.elements.expectedArrival ? 'invalid' : null}
          />
        </ListItem>
      </>
    );
  }

  renderHomeOfficeWorkLogFields() {
    const { t } = this.props;

    return (
      <ListItem>
        <TextField
          changeHandler={this.changeHandler}
          helperText={this.state.formValidity.elements.comment}
          id="comment"
          label={t('homeOfficeWorkLog:element.comment')}
          value={this.state.formData.comment || ''}
          validationState={this.state.formValidity.elements.comment ? 'invalid' : null}
        />
      </ListItem>
    );
  }

  renderOvertimeWorkLogFields() {
    const { t } = this.props;

    return (
      <ListItem>
        <TextField
          changeHandler={this.changeHandler}
          helperText={this.state.formValidity.elements.reason}
          id="reason"
          label={t('overtimeWorkLog:element.reason')}
          value={this.state.formData.reason || ''}
          validationState={this.state.formValidity.elements.reason ? 'invalid' : null}
        />
      </ListItem>
    );
  }

  renderSickDayWorkLogFields() {
    const { t } = this.props;

    return (
      <ListItem>
        <SelectField
          changeHandler={this.changeHandler}
          helperText={this.state.formValidity.elements.variant}
          id="variant"
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
          validationState={this.state.formValidity.elements.variant ? 'invalid' : null}
          value={this.state.formData.variant || ''}
        />
      </ListItem>
    );
  }

  renderSickDayWorkLogSickChildFields() {
    const { t } = this.props;

    return (
      <>
        <ListItem>
          <TextField
            changeHandler={this.changeHandler}
            helperText={this.state.formValidity.elements.childName}
            id="childName"
            label={t('sickDayWorkLog:element.childName')}
            value={this.state.formData.childName || ''}
            validationState={this.state.formValidity.elements.childName ? 'invalid' : null}
          />
        </ListItem>
        <ListItem>
          <TextField
            changeHandler={this.changeHandler}
            helperText={this.state.formValidity.elements.childDateOfBirth}
            id="childDateOfBirth"
            label={t('sickDayWorkLog:element.childDateOfBirth')}
            value={this.state.formData.childDateOfBirth || ''}
            validationState={this.state.formValidity.elements.childDateOfBirth ? 'invalid' : null}
          />
        </ListItem>
      </>
    );
  }

  renderSpecialLeaveWorkLogFields() {
    const { t } = this.props;

    return (
      <ListItem>
        <TextField
          helperText={this.state.formValidity.elements.dateTo}
          changeHandler={this.changeHandler}
          id="dateTo"
          label={t('vacationWorkLog:element.dateTo')}
          value={this.state.formData.dateTo || ''}
          validationState={this.state.formValidity.elements.dateTo ? 'invalid' : null}
        />
      </ListItem>
    );
  }

  renderTimeOffWorkLogFields() {
    const { t } = this.props;

    return (
      <ListItem>
        <TextField
          changeHandler={this.changeHandler}
          helperText={this.state.formValidity.elements.comment}
          id="comment"
          label={t('timeOffWorkLog:element.comment')}
          value={this.state.formData.comment || ''}
          validationState={this.state.formValidity.elements.comment ? 'invalid' : null}
        />
      </ListItem>
    );
  }

  renderVacationWorkLogFields() {
    const { t } = this.props;

    return (
      <ListItem>
        <TextField
          helperText={this.state.formValidity.elements.dateTo}
          changeHandler={this.changeHandler}
          id="dateTo"
          label={t('vacationWorkLog:element.dateTo')}
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
                changeHandler={this.changeHandler}
                helperText={formValidity.elements.startHour}
                id="startHour"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.startHour')}
                value={formData.startHour || ''}
                validationState={this.state.formValidity.elements.startHour ? 'invalid' : null}
              />
            </div>
            <span className={styles.colon}>:</span>
            <div className={styles.fieldDate}>
              <TextField
                changeHandler={this.changeHandler}
                helperText={formValidity.elements.startMinute}
                id="startMinute"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.startMinute')}
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
                changeHandler={this.changeHandler}
                helperText={formValidity.elements.endHour}
                id="endHour"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.endHour')}
                value={formData.endHour || ''}
                validationState={this.state.formValidity.elements.endHour ? 'invalid' : null}
              />
            </div>
            <span className={styles.colon}>:</span>
            <div className={styles.fieldDate}>
              <TextField
                changeHandler={this.changeHandler}
                helperText={formValidity.elements.endMinute}
                id="endMinute"
                inputSize={2}
                isLabelVisible={false}
                label={t('workLog:element.endMinute')}
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
            loadingIcon: this.props.isPosting ? <Icon icon="sync" /> : null,
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
                          clickHandler={this.stopWorkLogTimer}
                          label={`${t('workLog:action.endWork')} | ${workLogTimerInterval}`}
                        />
                      ) : (
                        <Button
                          beforeLabel={<Icon icon="play_arrow" />}
                          block
                          clickHandler={this.initAndStartWorkLogTimer}
                          label={t('workLog:action.startWork')}
                          priority="primary"
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
                        formData.type === SPECIAL_LEAVE_WORK_LOG
                        || formData.type === VACATION_WORK_LOG
                      )
                        ? 'vacationWorkLog:element.dateFrom'
                        : 'workLog:element.date'
                    ))
                  }
                  value={toDayMonthYearFormat(this.props.date) || ''}
                />
              </ListItem>
              <ListItem>
                <SelectField
                  changeHandler={this.changeHandler}
                  helperText={formValidity.elements.type}
                  id="type"
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
  showInfoText: false,
  showWorkLogTimer: false,
};

WorkLogForm.propTypes = {
  banWorkLogsOfDay: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    date: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    workTimeLimit: PropTypes.shape.isRequired,
  })).isRequired,
  closeHandler: PropTypes.func.isRequired,
  config: ImmutablePropTypes.mapContains({}).isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  isPosting: PropTypes.bool.isRequired,
  saveHandler: PropTypes.func.isRequired,
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
