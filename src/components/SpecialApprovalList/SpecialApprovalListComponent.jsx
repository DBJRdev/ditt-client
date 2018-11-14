import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Modal,
  TextField,
  Table,
} from 'react-ui';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
} from '../../resources/workMonth';
import {
  includesSameDate,
  isWeekend,
  toDayDayMonthYearFormat,
} from '../../services/dateTimeService';
import { validateRejectWorkLog } from '../../services/validatorService';
import {
  getStatusLabel,
  getTypeLabel,
} from '../../services/workLogService';
import styles from './SpecialApprovalListComponent.scss';

class SpecialApprovalListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastApprovedWorkLogId: null,
      lastApprovedWorkLogType: null,
      lastRejectedWorkLogId: null,
      lastRejectedWorkLogType: null,
      rejectWorkLogForm: {
        rejectionMessage: null,
      },
      rejectWorkLogFormValidity: {
        elements: {
          form: null,
          rejectionMessage: null,
        },
        isValid: false,
      },
      showRejectWorkLogForm: false,
      showRejectWorkLogFormId: null,
      showRejectWorkLogFormType: null,
      showWorkLogDetailDialog: false,
      showWorkLogDetailDialogType: null,
    };

    this.changeRejectWorkLogFormHandler = this.changeRejectWorkLogFormHandler.bind(this);
    this.closeDeleteWorkLogForm = this.closeDeleteWorkLogForm.bind(this);
    this.rejectWorkLogHandler = this.rejectWorkLogHandler.bind(this);
    this.closeWorkLogDetail = this.closeWorkLogDetail.bind(this);

    this.formErrorStyle = {
      color: '#a32100',
      textAlign: 'center',
    };
  }

  componentDidMount() {
    this.props.fetchConfig();

    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        this.props.fetchSpecialApprovalList(decodedToken.uid);
      }
    }
  }

  getFilteredSpecialApprovals() {
    let specialApprovalList = Immutable.List();

    if (!this.props.config) {
      return specialApprovalList;
    }

    [
      'businessTripWorkLogs',
      'homeOfficeWorkLogs',
      'overtimeWorkLogs',
      'timeOffWorkLogs',
    ].forEach((key) => {
      specialApprovalList = specialApprovalList.concat((
        this.props.specialApprovalList.get(key).map((
          workLog => workLog
            .set('rawId', workLog.get('id'))
            .set('id', `${workLog.get('type')}-${workLog.get('id')}`)
        ))
      ));
    });

    let vacationWorkLogs = [];
    const vacationWorkLogsByStatus = {};

    this.props.specialApprovalList.get('vacationWorkLogs')
      .map((
        workLog => workLog
          .set('rawId', workLog.get('id'))
          .set('id', `${workLog.get('type')}-${workLog.get('id')}`)
      ))
      .sortBy(workLog => workLog.get('date'))
      .forEach((workLog) => {
        if (!vacationWorkLogsByStatus[workLog.get('status')]) {
          vacationWorkLogsByStatus[workLog.get('status')] = [];
        }

        vacationWorkLogsByStatus[workLog.get('status')].push(workLog);
      });

    Object.keys(vacationWorkLogsByStatus).forEach((status) => {
      let tempVacationWorkLogs = [];
      let firstWorkLog = null;
      let nextWorkingDay = null;

      vacationWorkLogsByStatus[status].forEach((workLog) => {
        if (!firstWorkLog) {
          firstWorkLog = workLog;
          tempVacationWorkLogs.push(workLog);
        } else if (workLog.get('date').isSame(nextWorkingDay, 'day')) {
          tempVacationWorkLogs.push(workLog);
        } else {
          vacationWorkLogs.push(tempVacationWorkLogs);
          tempVacationWorkLogs = [workLog];
          firstWorkLog = workLog;
        }

        nextWorkingDay = workLog.get('date').clone().add(1, 'day');
        while (isWeekend(nextWorkingDay) || includesSameDate(nextWorkingDay, this.props.config.get('supportedHolidays'))) {
          nextWorkingDay = nextWorkingDay.add(1, 'day');
        }
      });

      vacationWorkLogs.push(tempVacationWorkLogs);
    });

    vacationWorkLogs = vacationWorkLogs.map((vacationWorkLogGroup) => {
      if (vacationWorkLogGroup.length === 1) {
        return vacationWorkLogGroup[0];
      }

      let bulkWorkLog = vacationWorkLogGroup[0];
      bulkWorkLog = bulkWorkLog.set('dateTo', vacationWorkLogGroup[vacationWorkLogGroup.length - 1].get('date'));
      bulkWorkLog = bulkWorkLog.set('bulkIds', vacationWorkLogGroup.map(workLog => workLog.get('rawId')));
      bulkWorkLog = bulkWorkLog.set('isBulk', true);

      return bulkWorkLog;
    });

    specialApprovalList = specialApprovalList.concat(vacationWorkLogs);
    specialApprovalList = specialApprovalList.sortBy(workLog => -workLog.get('date'));

    return specialApprovalList;
  }

  handleMarkApproved(id, type) {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        let action = null;

        switch (type) {
          case BUSINESS_TRIP_WORK_LOG:
            action = this.props.markBusinessTripWorkLogApproved;
            break;
          case HOME_OFFICE_WORK_LOG:
            action = this.props.markHomeOfficeWorkLogApproved;
            break;
          case OVERTIME_WORK_LOG:
            action = this.props.markOvertimeWorkLogApproved;
            break;
          case TIME_OFF_WORK_LOG:
            action = this.props.markTimeOffWorkLogApproved;
            break;
          case VACATION_WORK_LOG:
            action = this.props.markVacationWorkLogApproved;
            break;
          default:
            throw new Error(`Unknown type ${type}`);
        }

        this.setState({
          lastApprovedWorkLogId: id,
          lastApprovedWorkLogType: type,
          lastRejectedWorkLogId: null,
          lastRejectedWorkLogType: null,
        });

        return action(id).then((response) => {
          this.props.fetchSpecialApprovalList(decodedToken.uid);

          return response;
        });
      }
    }

    return null;
  }

  handleMarkRejected(id, type, rejectionMessage) {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        let action = null;

        switch (type) {
          case BUSINESS_TRIP_WORK_LOG:
            action = this.props.markBusinessTripWorkLogRejected;
            break;
          case HOME_OFFICE_WORK_LOG:
            action = this.props.markHomeOfficeWorkLogRejected;
            break;
          case OVERTIME_WORK_LOG:
            action = this.props.markOvertimeWorkLogRejected;
            break;
          case TIME_OFF_WORK_LOG:
            action = this.props.markTimeOffWorkLogRejected;
            break;
          case VACATION_WORK_LOG:
            action = this.props.markVacationWorkLogRejected;
            break;
          default:
            throw new Error(`Unknown type ${type}`);
        }

        this.setState({
          lastApprovedWorkLogId: null,
          lastApprovedWorkLogType: null,
          lastRejectedWorkLogId: id,
          lastRejectedWorkLogType: type,
        });

        return action(id, { rejectionMessage }).then((response) => {
          this.props.fetchSpecialApprovalList(decodedToken.uid);

          return response;
        });
      }
    }

    return null;
  }

  openRejectWorkLogForm(id, type) {
    this.setState({
      showRejectWorkLogForm: true,
      showRejectWorkLogFormId: id,
      showRejectWorkLogFormType: type,
    });
  }

  closeDeleteWorkLogForm() {
    this.setState({
      rejectWorkLogForm: {
        rejectionMessage: null,
      },
      showRejectWorkLogForm: false,
      showRejectWorkLogFormId: null,
      showRejectWorkLogFormType: null,
    });
  }

  changeRejectWorkLogFormHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const rejectWorkLogForm = Object.assign({}, prevState.rejectWorkLogForm);
      rejectWorkLogForm[eventTarget.id] = eventTarget.value;

      return { rejectWorkLogForm };
    });
  }

  openWorkLogDetail(id, type) {
    if (BUSINESS_TRIP_WORK_LOG === type) {
      this.props.fetchBusinessTripWorkLog(id);
    } else if (HOME_OFFICE_WORK_LOG === type) {
      this.props.fetchHomeOfficeWorkLog(id);
    } else if (OVERTIME_WORK_LOG === type) {
      this.props.fetchOvertimeWorkLog(id);
    } else if (TIME_OFF_WORK_LOG === type) {
      this.props.fetchTimeOffWorkLog(id);
    } else if (VACATION_WORK_LOG === type) {
      this.props.fetchVacationWorkLog(id);
    }

    this.setState({
      showWorkLogDetailDialog: true,
      showWorkLogDetailDialogType: type,
    });
  }

  closeWorkLogDetail() {
    this.setState({
      showWorkLogDetailDialog: false,
      showWorkLogDetailDialogType: null,
    });
  }

  rejectWorkLogHandler() {
    const {
      rejectWorkLogForm,
      showRejectWorkLogFormId,
      showRejectWorkLogFormType,
    } = this.state;
    const rejectWorkLogFormValidity = validateRejectWorkLog(this.props.t, rejectWorkLogForm);

    this.setState({ rejectWorkLogFormValidity });

    if (rejectWorkLogFormValidity.isValid) {
      this.handleMarkRejected(
        showRejectWorkLogFormId,
        showRejectWorkLogFormType,
        rejectWorkLogForm.rejectionMessage
      )
        .then((response) => {
          if (response.type.endsWith('SUCCESS')) {
            this.closeDeleteWorkLogForm();
          } else if (response.type.endsWith('FAILURE')) {
            rejectWorkLogFormValidity.elements.form = this.props.t('specialApproval:validation.cannotRejectWorkLog');

            this.setState({ rejectWorkLogFormValidity });
          }
        });
    }
  }

  renderWorkLogForm() {
    const { t } = this.props;

    return (
      <Modal
        actions={[
          {
            clickHandler: this.rejectWorkLogHandler,
            label: t('general:action.reject'),
            loading: this.props.isPosting,
          },
        ]}
        closeHandler={this.closeDeleteWorkLogForm}
        title={t('specialApproval:modal.reject.title')}
        translations={{ close: t('general:action.close') }}
      >
        <form>
          <p style={this.formErrorStyle}>
            {this.state.rejectWorkLogFormValidity.elements.form}
          </p>
          <p>{t('specialApproval:modal.reject.description')}</p>
          <TextField
            changeHandler={this.changeRejectWorkLogFormHandler}
            error={this.state.rejectWorkLogFormValidity.elements.rejectionMessage}
            fieldId="rejectionMessage"
            label={t('workLog:element.rejectionMessage')}
            value={this.state.rejectWorkLogForm.rejectionMessage || ''}
          />
        </form>
      </Modal>
    );
  }

  renderWorkLogDetail() {
    const { t } = this.props;

    const type = this.state.showWorkLogDetailDialogType;
    let content = t('general:text.loading');

    if (BUSINESS_TRIP_WORK_LOG === type && this.props.businessTripWorkLog) {
      content = (
        <p>
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.businessTripWorkLog.get('date'))}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.businessTripWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.businessTripWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.businessTripWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
          {t('businessTripWorkLog:element.purpose')}: {this.props.businessTripWorkLog.get('purpose')}<br />
          {t('businessTripWorkLog:element.destination')}: {this.props.businessTripWorkLog.get('destination')}<br />
          {t('businessTripWorkLog:element.transport')}: {this.props.businessTripWorkLog.get('transport')}<br />
          {t('businessTripWorkLog:element.expectedDeparture')}: {this.props.businessTripWorkLog.get('expectedDeparture')}<br />
          {t('businessTripWorkLog:element.expectedArrival')}: {this.props.businessTripWorkLog.get('expectedArrival')}
        </p>
      );
    } else if (HOME_OFFICE_WORK_LOG === type && this.props.homeOfficeWorkLog) {
      content = (
        <p>
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.homeOfficeWorkLog.get('date'))}<br />
          {t('homeOfficeWorkLog:element.comment')}: {this.props.homeOfficeWorkLog.get('comment')}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.homeOfficeWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.homeOfficeWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.homeOfficeWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
        </p>
      );
    } else if (OVERTIME_WORK_LOG === type && this.props.overtimeWorkLog) {
      content = (
        <p>
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.overtimeWorkLog.get('date'))}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.overtimeWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.overtimeWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.overtimeWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
          {t('overtimeWorkLog:element.reason')}: {this.props.overtimeWorkLog.get('reason')}<br />
        </p>
      );
    } else if (TIME_OFF_WORK_LOG === type && this.props.timeOffWorkLog) {
      content = (
        <p>
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.timeOffWorkLog.get('date'))}<br />
          {t('timeOffWorkLog:element.comment')}: {this.props.timeOffWorkLog.get('comment')}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.timeOffWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.timeOffWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.timeOffWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
        </p>
      );
    } else if (VACATION_WORK_LOG === type && this.props.vacationWorkLog) {
      content = (
        <p>
          {t('workLog:element.date')}: {toDayDayMonthYearFormat(this.props.vacationWorkLog.get('date'))}<br />
          {t('workLog:element.status')}: {getStatusLabel(t, this.props.vacationWorkLog.get('status'))}<br />
          {STATUS_REJECTED === this.props.vacationWorkLog.get('status') && (
            <React.Fragment>
              {t('workLog:element.rejectionMessage')}: {this.props.vacationWorkLog.get('rejectionMessage')}<br />
            </React.Fragment>
          )}
        </p>
      );
    }

    return (
      <Modal
        actions={[]}
        closeHandler={this.closeWorkLogDetail}
        title={getTypeLabel(t, this.state.showWorkLogDetailDialogType)}
        translations={{ close: t('general:action.close') }}
      >
        {content}
      </Modal>
    );
  }

  render() {
    const { t } = this.props;
    const specialApprovals = this.getFilteredSpecialApprovals();

    return (
      <div>
        {specialApprovals.count() > 0 ? (
          <Table
            columns={[
              {
                format: row => `${row.workMonth.user.firstName} ${row.workMonth.user.lastName}`,
                label: t('user:element.name'),
                name: 'lastName',
              },
              {
                format: (row) => {
                  if (!row.isBulk) {
                    return toDayDayMonthYearFormat(row.date);
                  }

                  return `${toDayDayMonthYearFormat(row.date)} – ${toDayDayMonthYearFormat(row.dateTo)}`;
                },
                label: t('workLog:element.date'),
                name: 'date',
              },
              {
                format: row => getTypeLabel(t, row.type),
                label: t('workLog:element.type'),
                name: 'type',
              },
              {
                format: row => (
                  <div>
                    <div className={styles.workLogButtonWrapper}>
                      <Button
                        clickHandler={() => this.openWorkLogDetail(row.rawId, row.type)}
                        label={t('specialApproval:action.workLogDetail')}
                        priority="default"
                      />
                    </div>
                    {STATUS_WAITING_FOR_APPROVAL === row.status && (
                      <React.Fragment>
                        <div className={styles.workLogButtonWrapper}>
                          <Button
                            clickHandler={() => this.handleMarkApproved(row.rawId, row.type)}
                            label={t('specialApproval:action.approveWorkLog')}
                            loading={
                              this.props.isPosting
                              && this.state.lastApprovedWorkLogId === row.rawId
                              && this.state.lastApprovedWorkLogType === row.type
                            }
                            priority="default"
                            variant="success"
                          />
                        </div>
                        <div className={styles.workLogButtonWrapper}>
                          <Button
                            clickHandler={() => this.openRejectWorkLogForm(row.rawId, row.type)}
                            label={t('specialApproval:action.rejectWorkLog')}
                            loading={
                              this.props.isPosting
                              && this.state.lastRejectedWorkLogId === row.rawId
                              && this.state.lastRejectedWorkLogType === row.type
                            }
                            priority="default"
                            variant="danger"
                          />
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                ),
                label: t('general:element.actions'),
                name: 'actions',
              },
            ]}
            rows={specialApprovals.toJS()}
          />
        ) : (
          <div>
            {t('specialApproval:text.emptyList')}
          </div>
        )}
        {this.state.showRejectWorkLogForm ? this.renderWorkLogForm() : null}
        {this.state.showWorkLogDetailDialog ? this.renderWorkLogDetail() : null}
      </div>
    );
  }
}

SpecialApprovalListComponent.defaultProps = {
  businessTripWorkLog: null,
  config: null,
  homeOfficeWorkLog: null,
  overtimeWorkLog: null,
  timeOffWorkLog: null,
  vacationWorkLog: null,
};

SpecialApprovalListComponent.propTypes = {
  businessTripWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    destination: PropTypes.string.isRequired,
    expectedArrival: PropTypes.string.isRequired,
    expectedDeparture: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
    transport: PropTypes.string.isRequired,
  }),
  config: ImmutablePropTypes.mapContains({}),
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  fetchHomeOfficeWorkLog: PropTypes.func.isRequired,
  fetchOvertimeWorkLog: PropTypes.func.isRequired,
  fetchSpecialApprovalList: PropTypes.func.isRequired,
  fetchTimeOffWorkLog: PropTypes.func.isRequired,
  fetchVacationWorkLog: PropTypes.func.isRequired,
  homeOfficeWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  isPosting: PropTypes.bool.isRequired,
  markBusinessTripWorkLogApproved: PropTypes.func.isRequired,
  markBusinessTripWorkLogRejected: PropTypes.func.isRequired,
  markHomeOfficeWorkLogApproved: PropTypes.func.isRequired,
  markHomeOfficeWorkLogRejected: PropTypes.func.isRequired,
  markOvertimeWorkLogApproved: PropTypes.func.isRequired,
  markOvertimeWorkLogRejected: PropTypes.func.isRequired,
  markTimeOffWorkLogApproved: PropTypes.func.isRequired,
  markTimeOffWorkLogRejected: PropTypes.func.isRequired,
  markVacationWorkLogApproved: PropTypes.func.isRequired,
  markVacationWorkLogRejected: PropTypes.func.isRequired,
  overtimeWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    reason: PropTypes.string,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  specialApprovalList: ImmutablePropTypes.mapContains({
    businessTripWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf([BUSINESS_TRIP_WORK_LOG]).isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    homeOfficeWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      comment: PropTypes.string.isRequired,
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf([HOME_OFFICE_WORK_LOG]).isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    overtimeWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf([OVERTIME_WORK_LOG]).isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    timeOffWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      comment: PropTypes.string.isRequired,
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf([TIME_OFF_WORK_LOG]).isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    vacationWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf([VACATION_WORK_LOG]).isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  timeOffWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  token: PropTypes.string.isRequired,
  vacationWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
};

export default withNamespaces()(SpecialApprovalListComponent);
