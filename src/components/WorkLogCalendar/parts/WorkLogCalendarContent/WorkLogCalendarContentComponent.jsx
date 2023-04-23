import {
  Button,
  ScrollView,
  Toolbar,
  ToolbarItem,
  classNames,
} from '@react-ui-org/react-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import styles from '../../WorkLogCalendar.scss';
import {
  Icon,
} from '../../../Icon';
import {
  includesSameDate,
  isWeekend, localizedMoment, toDayFormat, toDayMonthYearFormat,
  toHourMinuteFormatFromInt,
} from '../../../../services/dateTimeService';
import {
  STATUS_APPROVED,
} from '../../../../resources/workMonth';
import { WorkLogDetailButton } from '../../components/WorkLogDetailButton';
import { ROLE_SUPER_ADMIN } from '../../../../resources/user';
import { WorkLogTimerButton } from '../../../WorkLogTimerButton';

const WorkLogCalendarContentComponent = ({
  config,
  contractsOfSelectedMonth,
  canAddWorkLog,
  canAddSupervisorWorkLog,
  fetchWorkMonth,
  daysOfSelectedMonth,
  openWorkLogDetailModal,
  openEditWorkLogFormModal,
  openSupervisorWorkLogFormModal,
  openWorkLogFormModal,
  workHoursInfo,
  supervisorView,
  t,
  user,
  workMonth,
}) => {
  const date = localizedMoment();

  let workTimeCorrectionText = null;
  const workTimeCorrection = Math.abs(workMonth.workTimeCorrection);
  if (workTimeCorrection !== 0) {
    const hour = parseInt(workTimeCorrection / 3600, 10);
    const minute = parseInt((workTimeCorrection - (hour * 3600)) / 60, 10);
    let minuteText = minute;

    if (minute === 0) {
      minuteText = '00';
    } else if (minute < 10) {
      minuteText = `0${minute}`;
    }

    if (workMonth.workTimeCorrection > 0) {
      workTimeCorrectionText = `${t('workLog:text.correction')}: + ${hour}:${minuteText} h`;
    } else {
      workTimeCorrectionText = `${t('workLog:text.correction')}: - ${hour}:${minuteText} h`;
    }
  }

  return (
    <div className={styles.scrollViewWrapper}>
      <ScrollView direction="horizontal">
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              {workMonth.status !== STATUS_APPROVED && workHoursInfo && workHoursInfo.requiredHoursLeft !== 0 && (
              <tr>
                <td
                  className={styles.tableCellRight}
                  colSpan={(canAddWorkLog || canAddSupervisorWorkLog) ? 4 : 3}
                >
                  {t(
                    'workLog:text.differenceFromPreviousMonth',
                    { hours: toHourMinuteFormatFromInt(-workHoursInfo.requiredHoursLeft, true) },
                  )}
                </td>
              </tr>
              )}
              {workTimeCorrectionText && (
              <tr>
                <td
                  className={styles.tableCellRight}
                  colSpan={(canAddWorkLog || canAddSupervisorWorkLog) ? 4 : 3}
                >
                  {workTimeCorrectionText}
                </td>
              </tr>
              )}
              {daysOfSelectedMonth.map((day) => {
                const validContractThisDay = contractsOfSelectedMonth.find((contract) => {
                  if (contract.endDateTime == null) {
                    return contract.startDateTime.isSameOrBefore(day.date, 'day');
                  }

                  return contract.startDateTime.isSameOrBefore(day.date, 'day') && contract.endDateTime.isSameOrAfter(day.date, 'day');
                });

                const isWorkingDay = validContractThisDay
                  && (
                    (
                      validContractThisDay.isDayBased
                      && (
                        (validContractThisDay.isMondayIncluded && day.date.day() === 1)
                        || (validContractThisDay.isTuesdayIncluded && day.date.day() === 2)
                        || (validContractThisDay.isWednesdayIncluded && day.date.day() === 3)
                        || (validContractThisDay.isThursdayIncluded && day.date.day() === 4)
                        || (validContractThisDay.isFridayIncluded && day.date.day() === 5)
                      )
                    ) || !validContractThisDay.isDayBased
                  );

                const canAddWorkLogAsUserThisDay = canAddWorkLog && validContractThisDay;
                const canAddWorkLogAsSupervisorThisDay = canAddSupervisorWorkLog && validContractThisDay;
                const canAddWorkLogThisDay = canAddWorkLogAsUserThisDay || canAddWorkLogAsSupervisorThisDay;

                let rowClassName = (
                  isWeekend(day.date)
                    || includesSameDate(day.date, config.supportedHolidays)
                    || !isWorkingDay
                ) ? styles.tableRowWeekend
                  : styles.tableRow;

                if (canAddWorkLogThisDay) {
                  rowClassName = `${rowClassName} ${styles.tableRowAddWorkLog}`;
                }

                let onRowClick;
                if (canAddWorkLogAsUserThisDay) {
                  onRowClick = () => openWorkLogFormModal(day.date);
                } else if (canAddWorkLogAsSupervisorThisDay) {
                  onRowClick = () => openSupervisorWorkLogFormModal(day.date);
                }

                return (
                  <tr
                    className={rowClassName}
                    key={day.date.date()}
                    onClick={onRowClick}
                  >
                    <td className={styles.dateTableCell}>
                      <div className={styles.date}>
                        {toDayMonthYearFormat(day.date)}
                      </div>
                      <div className={styles.dayInWeek}>
                        {toDayFormat(day.date)}
                      </div>
                    </td>
                    <td
                      className={styles.tableCell}
                    >
                      <Toolbar dense>
                        {day.workLogList.map((workLog) => (
                          <WorkLogDetailButton
                            currentDate={day.date}
                            daysOfCurrentMonth={daysOfSelectedMonth}
                            fetchWorkMonth={fetchWorkMonth}
                            isInSupervisorMode={
                            supervisorView && user.roles.includes(ROLE_SUPER_ADMIN)
                          }
                            key={`${workLog.type}_${workLog.id}`}
                            onClick={openWorkLogDetailModal}
                            onEditClick={openEditWorkLogFormModal}
                            uid={user.uid}
                            workLog={workLog}
                            workMonth={workMonth}
                          />
                        ))}
                        {
                        day.date.isSame(date, 'day')
                        && canAddWorkLogAsUserThisDay
                        && (
                          <ToolbarItem>
                            <WorkLogTimerButton onAfterSave={fetchWorkMonth} />
                          </ToolbarItem>
                        )
                      }
                      </Toolbar>
                    </td>
                    {
                      !canAddWorkLogThisDay
                      && (
                        <td
                          className={classNames(
                            styles.tableCellRight,
                            styles.tableCellHideOnPrint,
                          )}
                        />
                      )
                    }
                    {
                      canAddWorkLogAsUserThisDay
                      && (
                        <td
                          className={classNames(
                            styles.tableCellRight,
                            styles.tableCellHideOnPrint,
                          )}
                        >
                          <div className={styles.addWorkLogButtonWrapper}>
                            <Button
                              beforeLabel={<Icon icon="add" />}
                              label={t('workLog:action.addWorkLog')}
                              labelVisibility="none"
                              onClick={() => openWorkLogFormModal(day.date)}
                            />
                          </div>
                        </td>
                      )
                    }
                    {
                      canAddWorkLogAsSupervisorThisDay
                      && (
                        <td className={styles.tableCellRight}>
                          <div className={styles.addWorkLogButtonWrapper}>
                            <Button
                              beforeLabel={<Icon icon="add" />}
                              label={t('workLog:action.addWorkLog')}
                              labelVisibility="none"
                              onClick={() => openSupervisorWorkLogFormModal(day.date)}
                            />
                          </div>
                        </td>
                      )
                    }
                    <td
                      className={
                      [
                        day.workTime.isWorkTimeCorrected
                          ? styles.tableCellRightWithCorrectedTime
                          : styles.tableCellRight,
                        workHoursInfo.toWork > 0 ? styles.tableCellRightWithWorkedHoursLeft : '',
                        workHoursInfo.toWork < 0 ? styles.tableCellRightWithWorkedHoursOvertime : '',
                      ].join(' ')
                    }
                    >
                      <div>
                        {
                        day.workTime.isWorkTimeCorrected
                          ? (
                            <Icon icon="update" />
                          ) : null
                      }
                        {
                        (workHoursInfo && workHoursInfo.areWorkTimesSame)
                          ? (
                            <>
                              {day.workTime.workTime.hours()}
                              :
                              {day.workTime.workTime.minutes() < 10 && '0'}
                              {day.workTime.workTime.minutes()}
                            </>
                          ) : '-:--'
                      }
                      &nbsp;h
                      </div>
                      {
                      day.date.isSame(date, 'day')
                      && canAddWorkLog
                      && workHoursInfo
                      && workHoursInfo.toWork !== 0 && (
                        <div className={styles.dailyStatusOfWorkedHours}>
                          {-workHoursInfo.toWork > 0 ? '+' : ''}
                          {toHourMinuteFormatFromInt(-workHoursInfo.toWork)}
                          &nbsp;h
                        </div>
                      )
                    }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ScrollView>
    </div>
  );
};

WorkLogCalendarContentComponent.propTypes = {
  canAddSupervisorWorkLog: PropTypes.bool.isRequired,
  canAddWorkLog: PropTypes.bool.isRequired,
  config: PropTypes.shape({
    supportedHolidays: PropTypes.arrayOf(PropTypes.shape).isRequired,
  }).isRequired,
  contractsOfSelectedMonth: PropTypes.arrayOf(PropTypes.shape({
    endDateTime: PropTypes.shape(),
    id: PropTypes.number,
    isDayBased: PropTypes.bool.isRequired,
    isFridayIncluded: PropTypes.bool.isRequired,
    isMondayIncluded: PropTypes.bool.isRequired,
    isThursdayIncluded: PropTypes.bool.isRequired,
    isTuesdayIncluded: PropTypes.bool.isRequired,
    isWednesdayIncluded: PropTypes.bool.isRequired,
    startDateTime: PropTypes.shape().isRequired,
    weeklyWorkingDays: PropTypes.number.isRequired,
    weeklyWorkingHours: PropTypes.number.isRequired,
  })).isRequired,
  daysOfSelectedMonth: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  openEditWorkLogFormModal: PropTypes.func.isRequired,
  openSupervisorWorkLogFormModal: PropTypes.func.isRequired,
  openWorkLogDetailModal: PropTypes.func.isRequired,
  openWorkLogFormModal: PropTypes.func.isRequired,
  supervisorView: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    uid: PropTypes.number.isRequired,
  }).isRequired,
  workHoursInfo: PropTypes.shape({
    areWorkTimesSame: PropTypes.bool.isRequired,
    requiredHoursLeft: PropTypes.number.isRequired,
    requiredHoursWithoutLeft: PropTypes.number.isRequired,
    toWork: PropTypes.number.isRequired,
    workedTime: PropTypes.shape({
      days: PropTypes.func.isRequired,
      hours: PropTypes.func.isRequired,
      minutes: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  workMonth: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    workTimeCorrection: PropTypes.number.isRequired,
  }).isRequired,
};

export default withTranslation()(WorkLogCalendarContentComponent);
