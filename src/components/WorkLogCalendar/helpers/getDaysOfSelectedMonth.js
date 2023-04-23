import {
  getWorkedTime,
  getWorkLogsByDay,
} from '../../../services/workLogService';

export const getDaysOfSelectedMonth = (
  config,
  selectedDate,
  workMonth,
  contracts,
) => {
  const lastDayOfMonth = selectedDate.clone().endOf('month');
  const renderingDay = selectedDate.clone().startOf('month');

  const days = [];

  while (renderingDay <= lastDayOfMonth) {
    let workLogListForRenderingDay = [];

    if (workMonth) {
      [
        'workLogs',
        'banWorkLogs',
        'businessTripWorkLogs',
        'homeOfficeWorkLogs',
        'maternityProtectionWorkLogs',
        'overtimeWorkLogs',
        'parentalLeaveWorkLogs',
        'sickDayWorkLogs',
        'sickDayUnpaidWorkLogs',
        'specialLeaveWorkLogs',
        'timeOffWorkLogs',
        'trainingWorkLogs',
        'vacationWorkLogs',
      ].forEach((key) => {
        workLogListForRenderingDay = [
          ...workLogListForRenderingDay,
          ...getWorkLogsByDay(renderingDay, workMonth[key]),
        ];
      });
    }

    days.push({
      date: renderingDay.clone(),
      workLogList: workLogListForRenderingDay,
      workTime: getWorkedTime(
        renderingDay.clone(),
        workLogListForRenderingDay,
        contracts,
        config.workedHoursLimits,
        config.supportedHolidays,
      ),
    });

    renderingDay.add(1, 'day');
  }

  return days;
};
