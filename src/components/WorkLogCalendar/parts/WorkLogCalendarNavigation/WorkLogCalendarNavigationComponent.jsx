import {
  Button,
  classNames,
} from '@react-ui-org/react-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import styles from '../../WorkLogCalendar.scss';
import {
  Icon,
  LoadingIcon,
} from '../../../Icon';
import { getWorkMonthByMonth } from '../../../../services/workLogService';
import {
  toHourMinuteFormatFromInt,
  toMonthYearFormat,
} from '../../../../services/dateTimeService';
import {
  STATUS_APPROVED, STATUS_WAITING_FOR_APPROVAL,
} from '../../../../resources/workMonth';

const WorkLogCalendarNavigationComponent = ({
  fetchWorkMonthList,
  isPosting,
  markApproved,
  selectedDate,
  selectNextMonth,
  selectPreviousMonth,
  workHoursInfo,
  workMonthList,
  supervisorView,
  t,
  workMonth,
}) => (
  <nav className={styles.navigation}>
    <div className={styles.navigationPrevious}>
      <Button
        beforeLabel={<Icon icon="keyboard_arrow_left" />}
        disabled={
          !getWorkMonthByMonth(
            selectedDate.clone().subtract(1, 'month'),
            workMonthList,
          )
        }
        label={t('workLog:action.previousMonth')}
        onClick={selectPreviousMonth}
      />
    </div>
    <div>
      <div className={styles.navigationWrap}>
        <h2 className={styles.navigationTitle}>
          {toMonthYearFormat(selectedDate)}
        </h2>
        <span className={styles.navigationSubtitle}>
          {workHoursInfo && t(
            workHoursInfo.areWorkTimesSame
              ? 'workLog:text.workedAndRequiredHours'
              : 'workLog:text.workedAndRequiredHoursDiffers',
            {
              requiredHours: toHourMinuteFormatFromInt(workHoursInfo.requiredHoursWithoutLeft),
              workedHours: `${workHoursInfo.workedTime.hours() + (workHoursInfo.workedTime.days() * 24)}:${(workHoursInfo.workedTime.minutes()) < 10 ? '0' : ''}${workHoursInfo.workedTime.minutes()}`,
            },
          )}
        </span>
      </div>
      {
        supervisorView
        && workMonth.status === STATUS_WAITING_FOR_APPROVAL
        && (
          <div
            className={classNames(
              'mt-2',
              styles.tableCellHideOnPrint,
            )}
          >
            <Button
              color="success"
              feedbackIcon={isPosting ? <LoadingIcon /> : null}
              label={t('workLog:action.approveMonth')}
              onClick={() => {
                if (workMonth) {
                  markApproved(workMonth.id).then(() => {
                    fetchWorkMonthList();
                  });
                }
              }}
            />
          </div>
        )
      }
      {
        !supervisorView
        && workMonth.status === STATUS_WAITING_FOR_APPROVAL
        && <p>{t('workMonth:constant.status.waitingForApproval')}</p>
      }
      {
        workMonth.status === STATUS_APPROVED
        && <p>{t('workMonth:constant.status.approved')}</p>
      }
    </div>
    <div className={styles.navigationNext}>
      <Button
        afterLabel={<Icon icon="keyboard_arrow_right" />}
        disabled={
          !getWorkMonthByMonth(
            selectedDate.clone().add(1, 'month'),
            workMonthList,
          )
        }
        label={t('workLog:action.nextMonth')}
        onClick={selectNextMonth}
      />
    </div>
  </nav>
);

WorkLogCalendarNavigationComponent.defaultProps = {
  fetchWorkMonthList: null,
  markApproved: null,
};

WorkLogCalendarNavigationComponent.propTypes = {
  fetchWorkMonthList: PropTypes.func,
  isPosting: PropTypes.bool.isRequired,
  markApproved: PropTypes.func,
  selectNextMonth: PropTypes.func.isRequired,
  selectPreviousMonth: PropTypes.func.isRequired,
  selectedDate: PropTypes.shape({
    clone: PropTypes.func.isRequired,
    month: PropTypes.func,
    year: PropTypes.func,
  }).isRequired,
  supervisorView: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  workHoursInfo: PropTypes.shape({
    areWorkTimesSame: PropTypes.bool.isRequired,
    requiredHoursWithoutLeft: PropTypes.number.isRequired,
    workedTime: PropTypes.shape({
      days: PropTypes.func.isRequired,
      hours: PropTypes.func.isRequired,
      minutes: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  workMonth: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  workMonthList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default withTranslation()(WorkLogCalendarNavigationComponent);
