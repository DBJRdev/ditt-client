export const getWorkHoursString = (workHoursValue) => {
  const hour = Math.floor(workHoursValue);
  let minute = 0;

  if (hour > 0) {
    minute = Math.round((workHoursValue % hour) * 60);
  } else {
    minute = Math.round(workHoursValue * 60);
  }

  if (minute === 0) {
    return `${hour}:00`;
  } else if (minute < 10) {
    return `${hour}:0${minute}`;
  }

  return `${hour}:${minute}`;
};

export const getWorkHoursValue = (workHoursString) => {
  const splittedString = workHoursString.split(':');

  const hour = parseInt(splittedString[0], 10);
  const minute = parseInt(splittedString[1], 10);

  return hour + (minute / 60);
};
