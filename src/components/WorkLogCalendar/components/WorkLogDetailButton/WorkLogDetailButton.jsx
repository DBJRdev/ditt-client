import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  ToolbarItem,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  Icon,
  LoadingIcon,
} from '../../../Icon';
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
  STATUS_REJECTED,
  STATUS_WAITING_FOR_APPROVAL,
  TIME_OFF_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../../../resources/workMonth';
import {
  getSickDayVariantLabel,
  getTypeLabel,
} from '../../../../services/workLogService';
import { VARIANT_SICK_CHILD } from '../../../../resources/sickDayWorkLog';
import {
  localizedMoment,
  toHourMinuteFormat,
} from '../../../../services/dateTimeService';

const WorkLogDetailButton = (props) => {
  const {
    currentDate,
    daysOfCurrentMonth,
    isInSupervisorMode,
    onClick,
    onDuplicateClick,
    onEditClick,
    t,
    uid,
    workLog,
    workMonth,
  } = props;
  const [isGetReqPending, setGetReqPending] = useState(false);
  const [isEditReqPending, setEditReqPending] = useState(false);
  const [isDuplicateReqPending, setDuplicateReqPending] = useState(false);

  const resolveLabel = (workLogData) => {
    let label = getTypeLabel(t, workLogData.type);

    if (STATUS_WAITING_FOR_APPROVAL === workLogData.status) {
      label += ` (${t('workMonth:constant.status.waiting')})`;
    } else if (STATUS_REJECTED === workLogData.status) {
      label += ` (${t('workMonth:constant.status.rejected')})`;
    }

    return label;
  };

  const supportsDuplicate = [BUSINESS_TRIP_WORK_LOG, HOME_OFFICE_WORK_LOG, OVERTIME_WORK_LOG,
    SICK_DAY_WORK_LOG, SPECIAL_LEAVE_WORK_LOG, TIME_OFF_WORK_LOG, VACATION_WORK_LOG, WORK_LOG];

  let isDuplicateActionDisabled = localizedMoment()
    .endOf('month')
    .isSame(currentDate, 'day');

  const foundDayOfMonth = daysOfCurrentMonth.find((day) => day.date.isSame(
    currentDate.clone().add(1, 'days'),
    'day',
  ));
  if (foundDayOfMonth) {
    isDuplicateActionDisabled = foundDayOfMonth.workLogList.find(
      (iWorkLog) => iWorkLog.type === workLog.type,
    ) !== undefined;
  }

  const isEnabled = (
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
      ].includes(workLog.type)
      && !isInSupervisorMode
      && workMonth.status !== STATUS_APPROVED
    ) || (
      [
        BAN_WORK_LOG,
        MATERNITY_PROTECTION_WORK_LOG,
        PARENTAL_LEAVE_WORK_LOG,
        SICK_DAY_UNPAID_WORK_LOG,
      ].includes(workLog.type)
      && isInSupervisorMode
      && workMonth.status !== STATUS_APPROVED
      && uid !== workMonth.user.id
    )
  ) && (
    (
      workLog.type === BUSINESS_TRIP_WORK_LOG
      && workLog
      && workLog.status === STATUS_WAITING_FOR_APPROVAL
    ) || (
      workLog.type === HOME_OFFICE_WORK_LOG
      && workLog
      && workLog.status === STATUS_WAITING_FOR_APPROVAL
    ) || (
      workLog.type === OVERTIME_WORK_LOG
      && workLog
      && workLog.status === STATUS_WAITING_FOR_APPROVAL
    ) || (
      workLog.type === SPECIAL_LEAVE_WORK_LOG
      && workLog
      && workLog.status === STATUS_WAITING_FOR_APPROVAL
    ) || (
      workLog.type === TIME_OFF_WORK_LOG
      && workLog
      && workLog.status === STATUS_WAITING_FOR_APPROVAL
    ) || (
      workLog.type === VACATION_WORK_LOG
      && workLog
      && workLog.status === STATUS_WAITING_FOR_APPROVAL
    ) || [
      BAN_WORK_LOG,
      MATERNITY_PROTECTION_WORK_LOG,
      PARENTAL_LEAVE_WORK_LOG,
      SICK_DAY_UNPAID_WORK_LOG,
      SICK_DAY_WORK_LOG,
      WORK_LOG,
    ].includes(workLog.type)
  );

  const createButton = (type, id, label, icon) => (
    <ToolbarItem>
      <ButtonGroup
        disabled={isDuplicateReqPending || isEditReqPending || isGetReqPending}
        priority="outline"
      >
        <Button
          beforeLabel={<Icon icon={icon} />}
          clickHandler={
            async (e) => {
              setGetReqPending(true);
              await onClick(
                e,
                id,
                type,
              );
              setGetReqPending(false);
            }
          }
          label={label}
          loadingIcon={isGetReqPending ? <LoadingIcon /> : null}
        />
        {isEnabled ? (
          <Button
            beforeLabel={
              isEditReqPending
                ? <LoadingIcon />
                : <Icon icon="edit" />
            }
            clickHandler={
              async (e) => {
                setEditReqPending(true);
                await onEditClick(
                  e,
                  id,
                  type,
                );
                setEditReqPending(false);
              }
            }
            label=""
            labelVisibility="none"
          />
        ) : null}
        {isEnabled && !isDuplicateActionDisabled && supportsDuplicate.includes(type) ? (
          <Button
            beforeLabel={
              isDuplicateReqPending
                ? <LoadingIcon />
                : <Icon icon="content_copy" />
            }
            clickHandler={
              (e) => {
                setDuplicateReqPending(true);

                return onDuplicateClick(
                  e,
                  id,
                  type,
                ).then((response) => {
                  setDuplicateReqPending(false);

                  return response;
                });
              }
            }
            label=""
            labelVisibility="none"
          />
        ) : null}
      </ButtonGroup>
    </ToolbarItem>
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

WorkLogDetailButton.defaultProps = {
  isInSupervisorMode: false,
  onDuplicateClick: null,
  uid: null,
};

WorkLogDetailButton.propTypes = {
  currentDate: PropTypes.instanceOf(moment).isRequired,
  daysOfCurrentMonth: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.instanceOf(moment).isRequired,
    workLogList: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  isInSupervisorMode: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func,
  onEditClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  uid: PropTypes.number,
  workLog: PropTypes.shape({
    endTime: PropTypes.shape(),
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape(),
    type: PropTypes.string.isRequired,
    variant: PropTypes.string,
  }).isRequired,
  workMonth: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default withTranslation()(WorkLogDetailButton);
