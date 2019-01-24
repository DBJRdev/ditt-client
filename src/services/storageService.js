const workLogTimerKey = 'workLogTimer';

export const getWorkLogTimer = () => localStorage.getItem(workLogTimerKey);

export const removeWorkLogTimer = () => {
  localStorage.removeItem(workLogTimerKey);
};

export const setWorkLogTimer = (value) => {
  localStorage.setItem(workLogTimerKey, value);
};
