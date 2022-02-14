import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import { LoadingIcon } from '../../../Icon';
import {
  BAN_WORK_LOG,
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  MATERNITY_PROTECTION_WORK_LOG,
  OVERTIME_WORK_LOG,
  PARENTAL_LEAVE_WORK_LOG,
  SICK_DAY_UNPAID_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../../../resources/workMonth';
import {
  getSickDayVariantLabel,
  getStatusLabel,
  getTypeLabel,
} from '../../../../services/workLogService';
import { VARIANT_SICK_CHILD } from '../../../../resources/sickDayWorkLog';
import {
  toDayDayMonthYearFormat,
  toDayMonthYearFormat,
  toHourMinuteFormat,
} from '../../../../services/dateTimeService';
import { Loader } from '../../../Loader';

const WorkLogDetailModal = (props) => {
  const {
    banWorkLog,
    businessTripWorkLog,
    homeOfficeWorkLog,
    id,
    isInSupervisorMode,
    isPosting,
    maternityProtectionWorkLog,
    onAfterDelete,
    onClose,
    onDelete,
    overtimeWorkLog,
    parentalLeaveWorkLog,
    sickDayUnpaidWorkLog,
    sickDayWorkLog,
    specialLeaveWorkLog,
    t,
    type,
    timeOffWorkLog,
    uid,
    vacationWorkLog,
    workLog,
    workMonth,
  } = props;

  let content = <Loader />;

  if (BAN_WORK_LOG === type && banWorkLog) {
    const { workTimeLimit } = banWorkLog;
    let workTimeLimitText = '0:00';

    if (workTimeLimit !== 0) {
      const hour = parseInt(workTimeLimit / 3600, 10);
      const minute = parseInt((workTimeLimit - (hour * 3600)) / 60, 10);

      if (minute === 0) {
        workTimeLimitText = ` ${hour}:00`;
      } else if (minute < 10) {
        workTimeLimitText = ` ${hour}:0${minute}`;
      } else {
        workTimeLimitText = ` ${hour}:${minute}`;
      }
    }

    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(banWorkLog.date)}
        <br />

        {t('banWorkLog:element.workTimeLimit')}
        {': '}
        {workTimeLimitText}
        <br />
      </p>
    );
  } else if (BUSINESS_TRIP_WORK_LOG === type && businessTripWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(businessTripWorkLog.date)}
        <br />

        {t('workLog:element.status')}
        {': '}
        {getStatusLabel(t, businessTripWorkLog.status)}
        <br />

        {STATUS_REJECTED === businessTripWorkLog.status && (
          <>
            {t('workLog:element.rejectionMessage')}
            :
            {businessTripWorkLog.rejectionMessage}
            <br />
          </>
        )}

        {t('businessTripWorkLog:element.purpose')}
        {': '}
        {businessTripWorkLog.purpose}
        <br />

        {t('businessTripWorkLog:element.destination')}
        {': '}
        {businessTripWorkLog.destination}
        <br />

        {t('businessTripWorkLog:element.transport')}
        {': '}
        {businessTripWorkLog.transport}
        <br />

        {t('businessTripWorkLog:element.expectedDeparture')}
        {': '}
        {businessTripWorkLog.expectedDeparture}
        <br />

        {t('businessTripWorkLog:element.expectedArrival')}
        {': '}
        {businessTripWorkLog.expectedArrival}
      </p>
    );
  } else if (HOME_OFFICE_WORK_LOG === type && homeOfficeWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(homeOfficeWorkLog.date)}
        <br />

        {t('homeOfficeWorkLog:element.comment')}
        {': '}
        {homeOfficeWorkLog.comment || '-'}
        <br />

        {t('workLog:element.status')}
        {': '}
        {getStatusLabel(t, homeOfficeWorkLog.status)}
        <br />

        {STATUS_REJECTED === homeOfficeWorkLog.status && (
          <>
            {t('workLog:element.rejectionMessage')}
            {': '}
            {homeOfficeWorkLog.rejectionMessage}
            <br />
          </>
        )}
      </p>
    );
  } else if (MATERNITY_PROTECTION_WORK_LOG === type && maternityProtectionWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(maternityProtectionWorkLog.date)}
        <br />
      </p>
    );
  } else if (OVERTIME_WORK_LOG === type && overtimeWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(overtimeWorkLog.date)}
        <br />

        {t('workLog:element.status')}
        {': '}
        {getStatusLabel(t, overtimeWorkLog.status)}
        <br />

        {STATUS_REJECTED === overtimeWorkLog.status && (
          <>
            {t('workLog:element.rejectionMessage')}
            {': '}
            {overtimeWorkLog.rejectionMessage}
            <br />
          </>
        )}

        {t('overtimeWorkLog:element.reason')}
        {': '}
        {overtimeWorkLog.reason}
      </p>
    );
  } else if (PARENTAL_LEAVE_WORK_LOG === type && parentalLeaveWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(parentalLeaveWorkLog.date)}
        <br />
      </p>
    );
  } else if (SICK_DAY_UNPAID_WORK_LOG === type && sickDayUnpaidWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(sickDayUnpaidWorkLog.date)}
        <br />
      </p>
    );
  } else if (SICK_DAY_WORK_LOG === type && sickDayWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(sickDayWorkLog.date)}
        <br />

        {t('sickDayWorkLog:element.variant')}
        {': '}
        {getSickDayVariantLabel(t, sickDayWorkLog.variant)}
        <br />

        {VARIANT_SICK_CHILD === sickDayWorkLog.variant && (
          <>
            {`${t('sickDayWorkLog:element.childName')}: ${sickDayWorkLog.childName}`}
            <br />
            {`${t('sickDayWorkLog:element.childDateOfBirth')}: ${toDayMonthYearFormat(sickDayWorkLog.childDateOfBirth)}`}
            <br />
          </>
        )}
      </p>
    );
  } else if (SPECIAL_LEAVE_WORK_LOG === type && specialLeaveWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(specialLeaveWorkLog.date)}
        <br />

        {t('workLog:element.status')}
        {': '}
        {getStatusLabel(t, specialLeaveWorkLog.status)}
        <br />

        {STATUS_REJECTED === specialLeaveWorkLog.status && (
          <>
            {t('workLog:element.rejectionMessage')}
            {': '}
            {specialLeaveWorkLog.rejectionMessage}
            <br />
          </>
        )}
      </p>
    );
  } else if (TIME_OFF_WORK_LOG === type && timeOffWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(timeOffWorkLog.date)}
        <br />

        {t('timeOffWorkLog:element.comment')}
        {': '}
        {timeOffWorkLog.comment || '-'}
        <br />

        {t('workLog:element.status')}
        {': '}
        {getStatusLabel(t, timeOffWorkLog.status)}
        <br />

        {STATUS_REJECTED === timeOffWorkLog.status && (
          <>
            {t('workLog:element.rejectionMessage')}
            {': '}
            {timeOffWorkLog.rejectionMessage}
            <br />
          </>
        )}
      </p>
    );
  } else if (VACATION_WORK_LOG === type && vacationWorkLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(vacationWorkLog.date)}
        <br />

        {t('workLog:element.status')}
        {': '}
        {getStatusLabel(t, vacationWorkLog.status)}
        <br />

        {STATUS_REJECTED === vacationWorkLog.status && (
          <>
            {t('workLog:element.rejectionMessage')}
            {': '}
            {vacationWorkLog.rejectionMessage}
            <br />
          </>
        )}
      </p>
    );
  } else if (WORK_LOG === type && workLog) {
    content = (
      <p>
        {t('workLog:element.type')}
        {': '}
        {getTypeLabel(t, type)}
        <br />

        {t('workLog:element.date')}
        {': '}
        {toDayDayMonthYearFormat(workLog.startTime)}
        <br />

        {t('workLog:element.startTime')}
        {': '}
        {toHourMinuteFormat(workLog.startTime)}
        <br />

        {t('workLog:element.endTime')}
        {': '}
        {toHourMinuteFormat(workLog.endTime)}
      </p>
    );
  }

  const actions = [];

  if (
    (
      [
        BUSINESS_TRIP_WORK_LOG,
        HOME_OFFICE_WORK_LOG,
        OVERTIME_WORK_LOG,
        SICK_DAY_WORK_LOG,
        SPECIAL_LEAVE_WORK_LOG,
        TIME_OFF_WORK_LOG,
        VACATION_WORK_LOG,
        WORK_LOG,
      ].includes(type)
      && !isInSupervisorMode
      && workMonth.status !== STATUS_APPROVED
    ) || (
      [
        BAN_WORK_LOG,
        MATERNITY_PROTECTION_WORK_LOG,
        PARENTAL_LEAVE_WORK_LOG,
        SICK_DAY_UNPAID_WORK_LOG,
      ].includes(type)
      && isInSupervisorMode
      && workMonth.status !== STATUS_APPROVED
      && uid !== workMonth.user.id
    )
  ) {
    actions.push({
      color: 'danger',
      feedbackIcon: isPosting ? <LoadingIcon /> : null,
      label: t('general:action.delete'),
      onClick: () => onDelete(id, type).then(() => onAfterDelete()),
    });
  }

  return (
    <Modal
      actions={actions}
      onClose={onClose}
      title={t('workLog:modal.detail.title')}
    >
      {content}
    </Modal>
  );
};

WorkLogDetailModal.defaultProps = {
  banWorkLog: null,
  businessTripWorkLog: null,
  homeOfficeWorkLog: null,
  maternityProtectionWorkLog: null,
  overtimeWorkLog: null,
  parentalLeaveWorkLog: null,
  sickDayUnpaidWorkLog: null,
  sickDayWorkLog: null,
  specialLeaveWorkLog: null,
  timeOffWorkLog: null,
  vacationWorkLog: null,
  workLog: null,
  workMonth: null,
};

WorkLogDetailModal.propTypes = {
  banWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
    workTimeLimit: PropTypes.number.isRequired,
  }),
  businessTripWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
    destination: PropTypes.string.isRequired,
    expectedArrival: PropTypes.string.isRequired,
    expectedDeparture: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_REJECTED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
    transport: PropTypes.string.isRequired,
  }),
  homeOfficeWorkLog: PropTypes.shape({
    comment: PropTypes.string,
    date: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_REJECTED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
  }),
  id: PropTypes.number.isRequired,
  isInSupervisorMode: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  maternityProtectionWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
  }),
  onAfterDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  overtimeWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
    reason: PropTypes.string,
    rejectionMessage: PropTypes.string,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_REJECTED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
  }),
  parentalLeaveWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
  }),
  sickDayUnpaidWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
  }),
  sickDayWorkLog: PropTypes.shape({
    childDateOfBirth: PropTypes.shape(),
    childName: PropTypes.string,
    date: PropTypes.shape().isRequired,
    variant: PropTypes.string.isRequired,
  }),
  specialLeaveWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
    id: PropTypes.number.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_REJECTED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
  }),
  t: PropTypes.func.isRequired,
  timeOffWorkLog: PropTypes.shape({
    comment: PropTypes.string,
    date: PropTypes.shape().isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_REJECTED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
  }),
  type: PropTypes.string.isRequired,
  uid: PropTypes.number.isRequired,
  vacationWorkLog: PropTypes.shape({
    date: PropTypes.shape().isRequired,
    id: PropTypes.number.isRequired,
    rejectionMessage: PropTypes.string,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_REJECTED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
  }),
  workLog: PropTypes.shape({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  }),
  workMonth: PropTypes.shape({
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_OPENED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  }),
};

export default withTranslation()(WorkLogDetailModal);
