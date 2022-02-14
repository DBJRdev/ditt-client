import {
  MODE_ADD,
  MODE_SUBTRACT,
} from '../constants';

export const getInitialState = (workMonth) => {
  let hour = '00';
  let minute = '00';
  let mode = MODE_ADD;

  if (workMonth.workTimeCorrection > 0) {
    hour = parseInt(workMonth.workTimeCorrection / 3600, 10);
    minute = parseInt((workMonth.workTimeCorrection - (hour * 3600)) / 60, 10);
  } else if (workMonth.workTimeCorrection < 0) {
    mode = MODE_SUBTRACT;
    hour = parseInt((workMonth.workTimeCorrection * -1) / 3600, 10);
    minute = parseInt(((workMonth.workTimeCorrection * -1) - (hour * 3600)) / 60, 10);
  }

  if (hour === 0) {
    minute = '00';
  }
  if (minute === 0) {
    minute = '00';
  }

  return {
    formData: {
      hour,
      minute,
      mode,
    },
    formValidity: {
      elements: {
        form: null,
        hour: null,
        minute: null,
      },
      isValid: false,
    },
  };
};
