import { MODE_SUBTRACT } from '../constants';

export const getStateToSave = (formData) => {
  let workTimeCorrection = (parseInt(formData.hour, 10) * 3600)
    + (parseInt(formData.minute, 10) * 60);

  if (formData.mode === MODE_SUBTRACT) {
    workTimeCorrection *= -1;
  }

  return { workTimeCorrection };
};
