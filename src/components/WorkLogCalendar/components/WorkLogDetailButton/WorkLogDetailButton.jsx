import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Icon,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import styles from '../../WorkLogCalendar.scss';
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
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
} from '../../../../resources/workMonth';
import {
  getSickDayVariantLabel,
  getTypeLabel,
} from '../../../../services/workLogService';
import { VARIANT_SICK_CHILD } from '../../../../resources/sickDayWorkLog';
import { toHourMinuteFormat } from '../../../../services/dateTimeService';

const WorkLogDetailButton = (props) => {
  const {
    onClick,
    workLog,
    t,
  } = props;

  const resolveLabel = (workLogData) => {
    let label = getTypeLabel(t, workLogData.type);

    if (STATUS_WAITING_FOR_APPROVAL === workLogData.status) {
      label += ` (${t('workMonth:constant.status.waiting')})`;
    } else if (STATUS_REJECTED === workLogData.status) {
      label += ` (${t('workMonth:constant.status.rejected')})`;
    }

    return label;
  };

  const createButton = (type, id, label, icon) => (
    <div
      className={styles.workLogButtonWrapper}
    >
      <Button
        beforeLabel={<Icon icon={icon} />}
        clickHandler={
          (e) => onClick(
            e,
            id,
            type,
          )
        }
        label={label}
        priority="outline"
      />
    </div>
  );

  const createDetailButton = (workLogData, icon) => createButton(
    workLogData.type,
    workLogData.id,
    resolveLabel(workLogData),
    icon,
  );

  if (workLog.type === BAN_WORK_LOG) {
    const { workTimeLimit } = workLog;
    let workTimeLimitText = '0:00';

    if (workTimeLimit !== 0) {
      const hour = parseInt(workTimeLimit / 3600, 10);
      const minute = parseInt((workTimeLimit - (hour * 3600)) / 60, 10);

      if (minute === 0) {
        workTimeLimitText = `${hour}:00`;
      } else if (minute < 10) {
        workTimeLimitText = `${hour}:0${minute}`;
      } else {
        workTimeLimitText = `${hour}:${minute}`;
      }
    }

    return createButton(
      workLog.type,
      workLog.id,
      `${resolveLabel(workLog)} (${workTimeLimitText})`,
      'block',
    );
  }

  if (workLog.type === BUSINESS_TRIP_WORK_LOG) {
    return createDetailButton(workLog, 'train');
  }

  if (workLog.type === HOME_OFFICE_WORK_LOG) {
    return createDetailButton(workLog, 'home');
  }

  if (workLog.type === MATERNITY_PROTECTION_WORK_LOG) {
    return createDetailButton(workLog, 'pregnant_woman');
  }

  if (workLog.type === OVERTIME_WORK_LOG) {
    return createDetailButton(workLog, 'hourglass_empty');
  }

  if (workLog.type === PARENTAL_LEAVE_WORK_LOG) {
    return createDetailButton(workLog, 'child_friendly');
  }

  if (workLog.type === SICK_DAY_UNPAID_WORK_LOG) {
    return createDetailButton(workLog, 'local_pharmacy');
  }

  if (workLog.type === SICK_DAY_WORK_LOG) {
    if (workLog.variant === VARIANT_SICK_CHILD) {
      return createButton(
        workLog.type,
        workLog.id,
        `${resolveLabel(workLog)} (${getSickDayVariantLabel(t, workLog.variant)})`,
        'local_hospital',
      );
    }

    return createDetailButton(workLog, 'local_hospital');
  }

  if (workLog.type === SPECIAL_LEAVE_WORK_LOG) {
    return createDetailButton(workLog, 'location_off');
  }

  if (workLog.type === TIME_OFF_WORK_LOG) {
    return createDetailButton(workLog, 'phonelink_off');
  }

  if (workLog.type === VACATION_WORK_LOG) {
    return createDetailButton(workLog, 'beach_access');
  }

  return createButton(
    workLog.type,
    workLog.id,
    `${toHourMinuteFormat(workLog.startTime)} - ${toHourMinuteFormat(workLog.endTime)}`,
    'access_time',
  );
};

WorkLogDetailButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  workLog: PropTypes.shape({
    endTime: PropTypes.shape(),
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape(),
    type: PropTypes.string.isRequired,
    variant: PropTypes.string,
  }).isRequired,
};

export default withTranslation()(WorkLogDetailButton);
