import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import decode from 'jwt-decode';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  ScrollView,
  TextField,
  Table,
  Toolbar,
  ToolbarItem,
} from '@react-ui-org/react-ui';
import {
  Icon,
  LoadingIcon,
} from '../Icon';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  SPECIAL_LEAVE_WORK_LOG,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
} from '../../resources/workMonth';
import { toDayDayMonthYearFormat } from '../../services/dateTimeService';
import { validateRejectWorkLog } from '../../services/validatorService';
import {
  getStatusLabel,
  getTypeLabel,
  collapseWorkLogs,
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
      lastSupportedWorkLogId: null,
      lastSupportedWorkLogType: null,
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
      showRejectWorkLogFormIsBulk: false,
      showRejectWorkLogFormType: null,
      showWorkLogDetailDialog: false,
      showWorkLogDetailDialogDateTo: null,
      showWorkLogDetailDialogIsBulk: false,
      showWorkLogDetailDialogType: null,
    };

    this.closeDeleteWorkLogForm = this.closeDeleteWorkLogForm.bind(this);
    this.closeWorkLogDetail = this.closeWorkLogDetail.bind(this);
    this.onChangeRejectWorkLogForm = this.onChangeRejectWorkLogForm.bind(this);
    this.onRejectWorkLog = this.onRejectWorkLog.bind(this);

    this.formErrorStyle = {
      color: '#a32100',
      textAlign: 'center',
    };
  }

  componentDidMount() {
    this.props.fetchConfig();

    if (this.props.token) {
      const decodedToken = decode(this.props.token);

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
      'specialLeaveWorkLogs',
      'timeOffWorkLogs',
      'vacationWorkLogs',
    ].forEach((key) => {
      specialApprovalList = specialApprovalList.concat((
        collapseWorkLogs(
          this.props.specialApprovalList.get(key),
          this.props.config.get('supportedHolidays'),
        ).map(
          (workLog) => workLog
            .set('rawId', workLog.get('id'))
            .set('id', `${workLog.get('type')}-${workLog.get('id')}`),
        )
      ));
    });

    return specialApprovalList.sortBy((workLog) => -workLog.get('date'));
  }

  handleMarkApproved(id, type, isBulk) {
    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        let action = null;

        if (isBulk) {
          switch (type) {
            case BUSINESS_TRIP_WORK_LOG:
              action = this.props.markMultipleBusinessTripWorkLogApproved;
              break;
            case HOME_OFFICE_WORK_LOG:
              action = this.props.markMultipleHomeOfficeWorkLogApproved;
              break;
            case OVERTIME_WORK_LOG:
              action = this.props.markMultipleOvertimeWorkLogApproved;
              break;
            case SPECIAL_LEAVE_WORK_LOG:
              action = this.props.markMultipleSpecialLeaveWorkLogApproved;
              break;
            case TIME_OFF_WORK_LOG:
              action = this.props.markMultipleTimeOffWorkLogApproved;
              break;
            case VACATION_WORK_LOG:
              action = this.props.markMultipleVacationWorkLogApproved;
              break;
            default:
              throw new Error(`Unknown bulk type ${type}`);
          }
        } else {
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
            case SPECIAL_LEAVE_WORK_LOG:
              action = this.props.markSpecialLeaveWorkLogApproved;
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
        }

        this.setState({
          lastApprovedWorkLogId: id,
          lastApprovedWorkLogType: type,
          lastRejectedWorkLogId: null,
          lastRejectedWorkLogType: null,
          lastSupportedWorkLogId: null,
          lastSupportedWorkLogType: null,
        });

        return action(id).then((response) => {
          this.props.fetchSpecialApprovalList(decodedToken.uid);

          return response;
        });
      }
    }

    return null;
  }

  handleMarkRejected(id, type, isBulk, rejectionMessage) {
    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        let action = null;

        if (isBulk) {
          switch (type) {
            case BUSINESS_TRIP_WORK_LOG:
              action = this.props.markMultipleBusinessTripWorkLogRejected;
              break;
            case HOME_OFFICE_WORK_LOG:
              action = this.props.markMultipleHomeOfficeWorkLogRejected;
              break;
            case OVERTIME_WORK_LOG:
              action = this.props.markMultipleOvertimeWorkLogRejected;
              break;
            case SPECIAL_LEAVE_WORK_LOG:
              action = this.props.markMultipleSpecialLeaveWorkLogRejected;
              break;
            case TIME_OFF_WORK_LOG:
              action = this.props.markMultipleTimeOffWorkLogRejected;
              break;
            case VACATION_WORK_LOG:
              action = this.props.markMultipleVacationWorkLogRejected;
              break;
            default:
              throw new Error(`Unknown bulk type ${type}`);
          }
        } else {
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
            case SPECIAL_LEAVE_WORK_LOG:
              action = this.props.markSpecialLeaveWorkLogRejected;
              break;
            case TIME_OFF_WORK_LOG:
              action = this.props.markTimeOffWorkLogRejected;
              break;
            case VACATION_WORK_LOG:
              action = this.props.markVacationWorkLogRejected;
              break;
            default:
              throw new Error(`Unknown simple type ${type}`);
          }
        }

        this.setState({
          lastApprovedWorkLogId: null,
          lastApprovedWorkLogType: null,
          lastRejectedWorkLogId: id,
          lastRejectedWorkLogType: type,
          lastSupportedWorkLogId: null,
          lastSupportedWorkLogType: null,
        });

        return action(id, { rejectionMessage }).then((response) => {
          this.props.fetchSpecialApprovalList(decodedToken.uid);

          return response;
        });
      }
    }

    return null;
  }

  handleSupport(id, type, isBulk) {
    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        let action = null;

        if (isBulk) {
          switch (type) {
            case BUSINESS_TRIP_WORK_LOG:
              action = this.props.supportMultipleBusinessTripWorkLog;
              break;
            case HOME_OFFICE_WORK_LOG:
              action = this.props.supportMultipleHomeOfficeWorkLog;
              break;
            case OVERTIME_WORK_LOG:
              action = this.props.supportMultipleOvertimeWorkLog;
              break;
            case SPECIAL_LEAVE_WORK_LOG:
              action = this.props.supportMultipleSpecialLeaveWorkLog;
              break;
            case TIME_OFF_WORK_LOG:
              action = this.props.supportMultipleTimeOffWorkLog;
              break;
            case VACATION_WORK_LOG:
              action = this.props.supportMultipleVacationWorkLog;
              break;
            default:
              throw new Error(`Unknown bulk type ${type}`);
          }
        } else {
          switch (type) {
            case BUSINESS_TRIP_WORK_LOG:
              action = this.props.supportBusinessTripWorkLog;
              break;
            case HOME_OFFICE_WORK_LOG:
              action = this.props.supportHomeOfficeWorkLog;
              break;
            case OVERTIME_WORK_LOG:
              action = this.props.supportOvertimeWorkLog;
              break;
            case SPECIAL_LEAVE_WORK_LOG:
              action = this.props.supportSpecialLeaveWorkLog;
              break;
            case TIME_OFF_WORK_LOG:
              action = this.props.supportTimeOffWorkLog;
              break;
            case VACATION_WORK_LOG:
              action = this.props.supportVacationWorkLog;
              break;
            default:
              throw new Error(`Unknown type ${type}`);
          }
        }

        this.setState({
          lastApprovedWorkLogId: null,
          lastApprovedWorkLogType: null,
          lastRejectedWorkLogId: null,
          lastRejectedWorkLogType: null,
          lastSupportedWorkLogId: id,
          lastSupportedWorkLogType: type,
        });

        return action(id).then((response) => {
          this.props.fetchSpecialApprovalList(decodedToken.uid);

          return response;
        });
      }
    }

    return null;
  }

  openRejectWorkLogForm(id, type, isBulk) {
    this.setState({
      showRejectWorkLogForm: true,
      showRejectWorkLogFormId: id,
      showRejectWorkLogFormIsBulk: isBulk,
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
      showRejectWorkLogFormIsBulk: null,
      showRejectWorkLogFormType: null,
    });
  }

  // eslint-disable-next-line react/sort-comp
  onChangeRejectWorkLogForm(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const rejectWorkLogForm = { ...prevState.rejectWorkLogForm };
      rejectWorkLogForm[eventTarget.id] = eventTarget.value;

      return { rejectWorkLogForm };
    });
  }

  openWorkLogDetail(id, type, isBulk, dateTo) {
    if (BUSINESS_TRIP_WORK_LOG === type) {
      this.props.fetchBusinessTripWorkLog(id);
    } else if (HOME_OFFICE_WORK_LOG === type) {
      this.props.fetchHomeOfficeWorkLog(id);
    } else if (OVERTIME_WORK_LOG === type) {
      this.props.fetchOvertimeWorkLog(id);
    } else if (SPECIAL_LEAVE_WORK_LOG === type) {
      this.props.fetchSpecialLeaveWorkLog(id);
    } else if (TIME_OFF_WORK_LOG === type) {
      this.props.fetchTimeOffWorkLog(id);
    } else if (VACATION_WORK_LOG === type) {
      this.props.fetchVacationWorkLog(id);
    }

    this.setState({
      showWorkLogDetailDialog: true,
      showWorkLogDetailDialogDateTo: dateTo || null,
      showWorkLogDetailDialogIsBulk: isBulk,
      showWorkLogDetailDialogType: type,
    });
  }

  closeWorkLogDetail() {
    this.setState({
      showWorkLogDetailDialog: false,
      showWorkLogDetailDialogDateTo: null,
      showWorkLogDetailDialogIsBulk: false,
      showWorkLogDetailDialogType: null,
    });
  }

  onRejectWorkLog() {
    const {
      rejectWorkLogForm,
      showRejectWorkLogFormId,
      showRejectWorkLogFormIsBulk,
      showRejectWorkLogFormType,
    } = this.state;
    const rejectWorkLogFormValidity = validateRejectWorkLog(this.props.t, rejectWorkLogForm);

    this.setState({ rejectWorkLogFormValidity });

    if (rejectWorkLogFormValidity.isValid) {
      this.handleMarkRejected(
        showRejectWorkLogFormId,
        showRejectWorkLogFormType,
        showRejectWorkLogFormIsBulk,
        rejectWorkLogForm.rejectionMessage,
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
            feedbackIcon: this.props.isPosting ? <LoadingIcon /> : null,
            label: t('general:action.reject'),
            onClick: this.onRejectWorkLog,
          },
        ]}
        onClose={this.closeDeleteWorkLogForm}
        title={t('specialApproval:modal.reject.title')}
      >
        <form>
          <p style={this.formErrorStyle}>
            {this.state.rejectWorkLogFormValidity.elements.form}
          </p>
          <p>{t('specialApproval:modal.reject.description')}</p>
          <TextField
            validationText={this.state.rejectWorkLogFormValidity.elements.rejectionMessage}
            id="rejectionMessage"
            label={t('workLog:element.rejectionMessage')}
            onChange={this.onChangeRejectWorkLogForm}
            validationState={
              this.state.rejectWorkLogFormValidity.elements.rejectionMessage !== null
                ? 'invalid'
                : null
            }
            value={this.state.rejectWorkLogForm.rejectionMessage || ''}
          />
        </form>
      </Modal>
    );
  }

  renderWorkLogDetail() {
    const { t } = this.props;

    const dateTo = this.state.showWorkLogDetailDialogDateTo;
    const isBulk = this.state.showWorkLogDetailDialogIsBulk;
    const type = this.state.showWorkLogDetailDialogType;
    let content = t('general:text.loading');

    if (BUSINESS_TRIP_WORK_LOG === type && this.props.businessTripWorkLog) {
      content = (
        <p>
          {isBulk ? t('workLog:element.dateFrom') : t('workLog:element.date')}
          {': '}
          {toDayDayMonthYearFormat(this.props.businessTripWorkLog.get('date'))}
          <br />

          {isBulk ? (
            <>
              {t('workLog:element.dateTo')}
              {': '}
              {toDayDayMonthYearFormat(dateTo)}
              <br />
            </>
          ) : null}

          {t('workLog:element.status')}
          {': '}
          {getStatusLabel(t, this.props.businessTripWorkLog.get('status'))}
          <br />

          {STATUS_REJECTED === this.props.businessTripWorkLog.get('status') && (
            <>
              {t('workLog:element.rejectionMessage')}
              {': '}
              {this.props.businessTripWorkLog.get('rejectionMessage')}
              <br />
            </>
          )}

          {t('businessTripWorkLog:element.purpose')}
          {': '}
          {this.props.businessTripWorkLog.get('purpose')}
          <br />

          {t('businessTripWorkLog:element.destination')}
          {': '}
          {this.props.businessTripWorkLog.get('destination')}
          <br />

          {t('businessTripWorkLog:element.transport')}
          {': '}
          {this.props.businessTripWorkLog.get('transport')}
          <br />

          {t('businessTripWorkLog:element.expectedDeparture')}
          {': '}
          {this.props.businessTripWorkLog.get('expectedDeparture')}
          <br />

          {t('businessTripWorkLog:element.expectedArrival')}
          {': '}
          {this.props.businessTripWorkLog.get('expectedArrival')}
        </p>
      );
    } else if (HOME_OFFICE_WORK_LOG === type && this.props.homeOfficeWorkLog) {
      content = (
        <p>
          {isBulk ? t('workLog:element.dateFrom') : t('workLog:element.date')}
          {': '}
          {toDayDayMonthYearFormat(this.props.homeOfficeWorkLog.get('date'))}
          <br />

          {isBulk ? (
            <>
              {t('workLog:element.dateTo')}
              {': '}
              {toDayDayMonthYearFormat(dateTo)}
              <br />
            </>
          ) : null}

          {t('homeOfficeWorkLog:element.comment')}
          {': '}
          {this.props.homeOfficeWorkLog.get('comment') || '-'}
          <br />

          {t('workLog:element.status')}
          {': '}
          {getStatusLabel(t, this.props.homeOfficeWorkLog.get('status'))}
          <br />

          {STATUS_REJECTED === this.props.homeOfficeWorkLog.get('status') && (
            <>
              {t('workLog:element.rejectionMessage')}
              {': '}
              {this.props.homeOfficeWorkLog.get('rejectionMessage')}
              <br />
            </>
          )}
        </p>
      );
    } else if (OVERTIME_WORK_LOG === type && this.props.overtimeWorkLog) {
      content = (
        <p>
          {isBulk ? t('workLog:element.dateFrom') : t('workLog:element.date')}
          {': '}
          {toDayDayMonthYearFormat(this.props.overtimeWorkLog.get('date'))}
          <br />

          {isBulk ? (
            <>
              {t('workLog:element.dateTo')}
              {': '}
              {toDayDayMonthYearFormat(dateTo)}
              <br />
            </>
          ) : null}

          {t('workLog:element.status')}
          {': '}
          {getStatusLabel(t, this.props.overtimeWorkLog.get('status'))}
          <br />

          {STATUS_REJECTED === this.props.overtimeWorkLog.get('status') && (
            <>
              {t('workLog:element.rejectionMessage')}
              {': '}
              {this.props.overtimeWorkLog.get('rejectionMessage')}
              <br />
            </>
          )}

          {t('overtimeWorkLog:element.reason')}
          {': '}
          {this.props.overtimeWorkLog.get('reason')}
        </p>
      );
    } else if (TIME_OFF_WORK_LOG === type && this.props.timeOffWorkLog) {
      content = (
        <p>
          {isBulk ? t('workLog:element.dateFrom') : t('workLog:element.date')}
          {': '}
          {toDayDayMonthYearFormat(this.props.timeOffWorkLog.get('date'))}
          <br />

          {isBulk ? (
            <>
              {t('workLog:element.dateTo')}
              {': '}
              {toDayDayMonthYearFormat(dateTo)}
              <br />
            </>
          ) : null}

          {t('timeOffWorkLog:element.comment')}
          {': '}
          {this.props.timeOffWorkLog.get('comment') || '-'}
          <br />

          {t('workLog:element.status')}
          {': '}
          {getStatusLabel(t, this.props.timeOffWorkLog.get('status'))}
          <br />

          {STATUS_REJECTED === this.props.timeOffWorkLog.get('status') && (
            <>
              {t('workLog:element.rejectionMessage')}
              {': '}
              {this.props.timeOffWorkLog.get('rejectionMessage')}
              <br />
            </>
          )}
        </p>
      );
    } else if (SPECIAL_LEAVE_WORK_LOG === type && this.props.specialLeaveWorkLog) {
      content = (
        <p>
          {isBulk ? t('workLog:element.dateFrom') : t('workLog:element.date')}
          {': '}
          {toDayDayMonthYearFormat(this.props.specialLeaveWorkLog.get('date'))}
          <br />

          {isBulk ? (
            <>
              {t('workLog:element.dateTo')}
              {': '}
              {toDayDayMonthYearFormat(dateTo)}
              <br />
            </>
          ) : null}

          {t('workLog:element.status')}
          {': '}
          {getStatusLabel(t, this.props.specialLeaveWorkLog.get('status'))}
          <br />

          {STATUS_REJECTED === this.props.specialLeaveWorkLog.get('status') && (
            <>
              {t('workLog:element.rejectionMessage')}
              {': '}
              {this.props.specialLeaveWorkLog.get('rejectionMessage')}
              <br />
            </>
          )}
        </p>
      );
    } else if (VACATION_WORK_LOG === type && this.props.vacationWorkLog) {
      content = (
        <p>
          {isBulk ? t('workLog:element.dateFrom') : t('workLog:element.date')}
          {': '}
          {toDayDayMonthYearFormat(this.props.vacationWorkLog.get('date'))}
          <br />

          {isBulk ? (
            <>
              {t('workLog:element.dateTo')}
              {': '}
              {toDayDayMonthYearFormat(dateTo)}
              <br />
            </>
          ) : null}

          {t('workLog:element.status')}
          {': '}
          {getStatusLabel(t, this.props.vacationWorkLog.get('status'))}
          <br />

          {STATUS_REJECTED === this.props.vacationWorkLog.get('status') && (
            <>
              {t('workLog:element.rejectionMessage')}
              {': '}
              {this.props.vacationWorkLog.get('rejectionMessage')}
              <br />
            </>
          )}
        </p>
      );
    }

    return (
      <Modal
        actions={[]}
        onClose={this.closeWorkLogDetail}
        title={getTypeLabel(t, this.state.showWorkLogDetailDialogType)}
      >
        {content}
      </Modal>
    );
  }

  render() {
    const { t } = this.props;
    const specialApprovals = this.getFilteredSpecialApprovals();

    let uid = null;

    if (this.props.token) {
      const decodedToken = decode(this.props.token);

      if (decodedToken) {
        // eslint-disable-next-line prefer-destructuring
        uid = decodedToken.uid;
      }
    }

    const lighterRow = (row) => {
      if (!row.workMonth.user.supervisor) {
        return styles.lighterRow;
      }

      return row.workMonth.user.supervisor.id !== uid ? styles.lighterRow : '';
    };

    return (
      <div>
        {specialApprovals.count() > 0 ? (
          <ScrollView direction="horizontal">
            <Table
              columns={[
                {
                  format: (row) => (
                    <span className={lighterRow(row)}>
                      {`${row.workMonth.user.firstName} ${row.workMonth.user.lastName}`}
                    </span>
                  ),
                  label: t('user:element.name'),
                  name: 'lastName',
                },
                {
                  format: (row) => {
                    if (!row.isBulk) {
                      return (
                        <span className={lighterRow(row)}>
                          {toDayDayMonthYearFormat(row.date)}
                        </span>
                      );
                    }

                    return (
                      <span className={lighterRow(row)}>
                        {`${toDayDayMonthYearFormat(row.date)} – ${toDayDayMonthYearFormat(row.dateTo)}`}
                      </span>
                    );
                  },
                  label: t('workLog:element.date'),
                  name: 'date',
                },
                {
                  format: (row) => (
                    <span className={lighterRow(row)}>
                      {getTypeLabel(t, row.type)}
                    </span>
                  ),
                  label: t('workLog:element.type'),
                  name: 'type',
                },
                {
                  format: (row) => {
                    const isAcknowledgedByMe = !!row.support.find(
                      (support) => support.supportedBy.id === uid,
                    );
                    const acknowledgeBy = row.support.map(
                      (support) => `${support.supportedBy.firstName} ${support.supportedBy.lastName}`,
                    ).join(', ');
                    let isSameIdApproved = this.state.lastApprovedWorkLogId === row.rawId;
                    let isSameIdRejected = this.state.lastRejectedWorkLogId === row.rawId;
                    let isSameIdSupported = this.state.lastSupportedWorkLogId === row.rawId;

                    if (row.isBulk && Array.isArray(this.state.lastApprovedWorkLogId)) {
                      isSameIdApproved = !!row.bulkIds.find(
                        (id) => this.state.lastApprovedWorkLogId.includes(id),
                      );
                    }

                    if (row.isBulk && Array.isArray(this.state.lastRejectedWorkLogId)) {
                      isSameIdRejected = !!row.bulkIds.find(
                        (id) => this.state.lastRejectedWorkLogId.includes(id),
                      );
                    }

                    if (row.isBulk && Array.isArray(this.state.lastSupportedWorkLogId)) {
                      isSameIdSupported = !!row.bulkIds.find(
                        (id) => this.state.lastSupportedWorkLogId.includes(id),
                      );
                    }

                    return (
                      <Toolbar dense>
                        <ToolbarItem>
                          <Button
                            label={t('specialApproval:action.workLogDetail')}
                            onClick={() => this.openWorkLogDetail(
                              row.rawId,
                              row.type,
                              row.isBulk,
                              row.dateTo,
                            )}
                            priority="outline"
                          />
                        </ToolbarItem>
                        {
                          STATUS_WAITING_FOR_APPROVAL === row.status
                          && row.workMonth.user.allSupervisors
                          && row.workMonth.user.allSupervisors.find(
                            (supervisor) => supervisor.id === uid,
                          )
                          && (
                            <>
                              <ToolbarItem>
                                <Button
                                  color="success"
                                  feedbackIcon={
                                    (
                                      this.props.isPosting
                                      && isSameIdApproved
                                      && this.state.lastApprovedWorkLogType === row.type
                                    ) ? <LoadingIcon />
                                      : null
                                  }
                                  label={t('specialApproval:action.approveWorkLog')}
                                  onClick={() => {
                                    if (row.isBulk) {
                                      return this.handleMarkApproved(
                                        row.bulkIds,
                                        row.type,
                                        row.isBulk,
                                      );
                                    }

                                    return this.handleMarkApproved(row.rawId, row.type, row.isBulk);
                                  }}
                                  priority="outline"
                                />
                              </ToolbarItem>
                              <ToolbarItem>
                                <Button
                                  color="danger"
                                  feedbackIcon={
                                    (
                                      this.props.isPosting
                                      && isSameIdRejected
                                      && this.state.lastRejectedWorkLogType === row.type
                                    ) ? <LoadingIcon />
                                      : null
                                  }
                                  label={t('specialApproval:action.rejectWorkLog')}
                                  onClick={() => {
                                    if (row.isBulk) {
                                      return this.openRejectWorkLogForm(
                                        row.bulkIds,
                                        row.type,
                                        row.isBulk,
                                      );
                                    }

                                    return this.openRejectWorkLogForm(
                                      row.rawId,
                                      row.type,
                                      row.isBulk,
                                    );
                                  }}
                                  priority="outline"
                                />
                              </ToolbarItem>
                              <ToolbarItem>
                                <Button
                                  color="warning"
                                  disabled={isAcknowledgedByMe}
                                  feedbackIcon={
                                    (
                                      this.props.isPosting
                                      && isSameIdSupported
                                      && this.state.lastSupportedWorkLogType === row.type
                                    ) ? <LoadingIcon />
                                      : null
                                  }
                                  label={
                                    isAcknowledgedByMe
                                      ? t('specialApproval:action.acknowledged')
                                      : t('specialApproval:action.acknowledge')
                                  }
                                  onClick={() => {
                                    if (row.isBulk) {
                                      return this.handleSupport(
                                        row.bulkIds,
                                        row.type,
                                        row.isBulk,
                                      );
                                    }

                                    return this.handleSupport(row.rawId, row.type, row.isBulk);
                                  }}
                                  priority="outline"
                                />
                              </ToolbarItem>
                              {
                                row.support.length > 0
                                  ? (
                                    <ToolbarItem>
                                      <div
                                        className={styles.thumbUpIcon}
                                        title={`${t('specialApproval:text.acknowledgedBy')}: ${acknowledgeBy}`}
                                      >
                                        <Icon icon="thumb_up" size="large" />
                                      </div>
                                    </ToolbarItem>
                                  ) : null
                              }
                            </>
                          )
                        }
                      </Toolbar>
                    );
                  },
                  label: t('general:element.actions'),
                  name: 'actions',
                },
              ]}
              rows={specialApprovals.toJS()}
            />
          </ScrollView>
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
  specialLeaveWorkLog: null,
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
  fetchSpecialLeaveWorkLog: PropTypes.func.isRequired,
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
  markMultipleBusinessTripWorkLogApproved: PropTypes.func.isRequired,
  markMultipleBusinessTripWorkLogRejected: PropTypes.func.isRequired,
  markMultipleHomeOfficeWorkLogApproved: PropTypes.func.isRequired,
  markMultipleHomeOfficeWorkLogRejected: PropTypes.func.isRequired,
  markMultipleOvertimeWorkLogApproved: PropTypes.func.isRequired,
  markMultipleOvertimeWorkLogRejected: PropTypes.func.isRequired,
  markMultipleSpecialLeaveWorkLogApproved: PropTypes.func.isRequired,
  markMultipleSpecialLeaveWorkLogRejected: PropTypes.func.isRequired,
  markMultipleTimeOffWorkLogApproved: PropTypes.func.isRequired,
  markMultipleTimeOffWorkLogRejected: PropTypes.func.isRequired,
  markMultipleVacationWorkLogApproved: PropTypes.func.isRequired,
  markMultipleVacationWorkLogRejected: PropTypes.func.isRequired,
  markOvertimeWorkLogApproved: PropTypes.func.isRequired,
  markOvertimeWorkLogRejected: PropTypes.func.isRequired,
  markSpecialLeaveWorkLogApproved: PropTypes.func.isRequired,
  markSpecialLeaveWorkLogRejected: PropTypes.func.isRequired,
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
      comment: PropTypes.string,
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
    specialLeaveWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      date: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf([SPECIAL_LEAVE_WORK_LOG]).isRequired,
      workMonth: ImmutablePropTypes.mapContains({
        user: ImmutablePropTypes.mapContains({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    timeOffWorkLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      comment: PropTypes.string,
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
  specialLeaveWorkLog: ImmutablePropTypes.mapContains({
    date: PropTypes.object.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
  supportBusinessTripWorkLog: PropTypes.func.isRequired,
  supportHomeOfficeWorkLog: PropTypes.func.isRequired,
  supportMultipleBusinessTripWorkLog: PropTypes.func.isRequired,
  supportMultipleHomeOfficeWorkLog: PropTypes.func.isRequired,
  supportMultipleOvertimeWorkLog: PropTypes.func.isRequired,
  supportMultipleSpecialLeaveWorkLog: PropTypes.func.isRequired,
  supportMultipleTimeOffWorkLog: PropTypes.func.isRequired,
  supportMultipleVacationWorkLog: PropTypes.func.isRequired,
  supportOvertimeWorkLog: PropTypes.func.isRequired,
  supportSpecialLeaveWorkLog: PropTypes.func.isRequired,
  supportTimeOffWorkLog: PropTypes.func.isRequired,
  supportVacationWorkLog: PropTypes.func.isRequired,
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

export default withTranslation()(SpecialApprovalListComponent);
