export const getWorkHoursString = (workHoursValue) => {
  const hour = Math.floor(workHoursValue / 3600);
  const minute = Math.floor((workHoursValue - (hour * 3600)) / 60);

  if (minute === 0) {
    return `${hour}:00`;
  }

  if (minute < 10) {
    return `${hour}:0${minute}`;
  }

  return `${hour}:${minute}`;
};

export const getWorkHoursValue = (workHoursString) => {
  const splittedString = workHoursString.split(':');

  const hour = parseInt(splittedString[0], 10);
  const minute = parseInt(splittedString[1], 10);

  return (hour * 3600) + (minute * 60);
};
