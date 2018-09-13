import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import {
  Button,
  Modal,
  TextField,
  Table,
} from 'react-ui';
import Layout from '../../components/Layout';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
} from '../../resources/workMonth';
import { toDayMonthYearFormat } from '../../services/dateTimeService';
import { validateRejectWorkLog } from '../../services/validatorService';
import {
  getStatusLabel,
  getTypeLabel,
} from '../../services/workLogService';
import styles from './specialApproval.scss';

class ListComponent extends React.Component {
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
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        this.props.fetchSpecialApprovalList(decodedToken.uid);
      }
    }
  }

  getFilteredSpecialApprovals() {
    let specialApprovalList = Immutable.List();

    [
      'businessTripWorkLogs',
      'homeOfficeWorkLogs',
      'overtimeWorkLogs',
      'timeOffWorkLogs',
      'vacationWorkLogs',
    ].forEach((key) => {
      specialApprovalList = specialApprovalList.concat((
        this.props.specialApprovalList.get(key).map((
          workLog => workLog
            .set('rawId', workLog.get('id'))
            .set('id', `${workLog.get('type')}-${workLog.get('id')}`)
        ))
      ));
    });

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
    const rejectWorkLogFormValidity = validateRejectWorkLog(rejectWorkLogForm);

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
            rejectWorkLogFormValidity.elements.form = 'Work log cannot be rejected.';

            this.setState({ rejectWorkLogFormValidity });
          }
        });
    }
  }

  renderWorkLogForm() {
    return (
      <Modal
        actions={[
          {
            clickHandler: this.rejectWorkLogHandler,
            label: 'Reject',
            loading: this.props.isPosting,
          },
        ]}
        closeHandler={this.closeDeleteWorkLogForm}
        title="Reject"
      >
        <form>
          <p style={this.formErrorStyle}>
            {this.state.rejectWorkLogFormValidity.elements.form}
          </p>
          <p>Are you sure your want to reject this application?</p>
          <TextField
            changeHandler={this.changeRejectWorkLogFormHandler}
            error={this.state.rejectWorkLogFormValidity.elements.rejectionMessage}
            fieldId="rejectionMessage"
            label="Reason"
            value={this.state.rejectWorkLogForm.rejectionMessage || ''}
          />
        </form>
      </Modal>
    );
  }

  renderWorkLogDetail() {
    let content = 'Loading…';

    if (
      BUSINESS_TRIP_WORK_LOG === this.state.showWorkLogDetailDialogType
      && this.props.businessTripWorkLog
    ) {
      content = (
        <p>
          Date: {toDayMonthYearFormat(this.props.businessTripWorkLog.get('date'))}<br />
          Status: {getStatusLabel(this.props.businessTripWorkLog.get('status'))}<br />
          Purpose: {this.props.businessTripWorkLog.get('purpose')}<br />
          Destination: {this.props.businessTripWorkLog.get('destination')}<br />
          Transport: {this.props.businessTripWorkLog.get('transport')}<br />
          Expected departure: {this.props.businessTripWorkLog.get('expectedDeparture')}<br />
          Expected arrival: {this.props.businessTripWorkLog.get('expectedArrival')}
        </p>
      );
    }

    return (
      <Modal
        actions={[]}
        closeHandler={this.closeWorkLogDetail}
        title={getTypeLabel(this.state.showWorkLogDetailDialogType)}
      >
        {content}
      </Modal>
    );
  }

  render() {
    const specialApprovals = this.getFilteredSpecialApprovals();

    return (
      <Layout title="Special approvals" loading={this.props.isFetching}>
        {specialApprovals.count() > 0 ? (
          <Table
            columns={[
              {
                format: row => `${row.workMonth.user.firstName} ${row.workMonth.user.lastName}`,
                label: 'Name',
                name: 'lastName',
              },
              {
                format: row => toDayMonthYearFormat(row.date),
                label: 'Date',
                name: 'date',
              },
              {
                format: row => getTypeLabel(row.type),
                label: 'Type',
                name: 'type',
              },
              {
                format: row => (
                  <div>
                    <div className={styles.workLogButtonWrapper}>
                      <Button
                        clickHandler={() => this.handleMarkApproved(row.rawId, row.type)}
                        label="Approve"
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
                        label="Reject"
                        loading={
                          this.props.isPosting
                          && this.state.lastRejectedWorkLogId === row.rawId
                          && this.state.lastRejectedWorkLogType === row.type
                        }
                        priority="default"
                        variant="danger"
                      />
                    </div>
                    {BUSINESS_TRIP_WORK_LOG === row.type && (
                      <div className={styles.workLogButtonWrapper}>
                        <Button
                          clickHandler={() => this.openWorkLogDetail(row.rawId, row.type)}
                          label="Detail"
                          priority="default"
                        />
                      </div>
                    )}
                  </div>
                ),
                label: 'Actions',
                name: 'actions',
              },
            ]}
            rows={specialApprovals.toJS()}
          />
        ) : (
          <div>
            You do not seem to have any pending special approvals.
          </div>
        )}
        {this.state.showRejectWorkLogForm ? this.renderWorkLogForm() : null}
        {this.state.showWorkLogDetailDialog ? this.renderWorkLogDetail() : null}
      </Layout>
    );
  }
}

ListComponent.defaultProps = {
  businessTripWorkLog: null,
};

ListComponent.propTypes = {
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
  fetchBusinessTripWorkLog: PropTypes.func.isRequired,
  fetchSpecialApprovalList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
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
  token: PropTypes.string.isRequired,
};

export default ListComponent;
