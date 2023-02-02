import PropTypes from 'prop-types';
import React from 'react';
import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG,
  OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG,
  SPECIAL_LEAVE_WORK_LOG,
  TIME_OFF_WORK_LOG,
  TRAINING_WORK_LOG,
  VACATION_WORK_LOG,
  WORK_LOG,
} from '../../../../resources/workMonth';
import { BaseFields } from './components/BaseFields';
import { BusinessTripWorkLogFields } from './components/BusinessTripWorkLogFields';
import { HomeOfficeWorkLogFields } from './components/HomeOfficeWorkLogFields';
import { OvertimeWorkLogFields } from './components/OvertimeWorkLogFields';
import { SickDayWorkLogFields } from './components/SickDayWorkLogFields';
import { SpecialLeaveWorkLogFields } from './components/SpecialLeaveWorkLogFields';
import { TimeOffWorkLogFields } from './components/TimeOffWorkLogFields';
import { TrainingWorkLogFields } from './components/TrainingWorkLogFields';
import { VacationWorkLogFields } from './components/VacationWorkLogFields';
import { WorkLogFields } from './components/WorkLogFields';

export const FieldsComponent = ({
  formData,
  formValidity,
  isInEditState,
  isWorkLogTimeActive,
  onFormDataChange,
}) => {
  const { type } = formData;

  let TypeBasedForm = null;
  if (type === BUSINESS_TRIP_WORK_LOG) {
    TypeBasedForm = BusinessTripWorkLogFields;
  } else if (type === HOME_OFFICE_WORK_LOG) {
    TypeBasedForm = HomeOfficeWorkLogFields;
  } else if (type === OVERTIME_WORK_LOG) {
    TypeBasedForm = OvertimeWorkLogFields;
  } else if (type === SICK_DAY_WORK_LOG) {
    TypeBasedForm = SickDayWorkLogFields;
  } else if (type === SPECIAL_LEAVE_WORK_LOG) {
    TypeBasedForm = SpecialLeaveWorkLogFields;
  } else if (type === TIME_OFF_WORK_LOG) {
    TypeBasedForm = TimeOffWorkLogFields;
  } else if (type === TRAINING_WORK_LOG) {
    TypeBasedForm = TrainingWorkLogFields;
  } else if (type === VACATION_WORK_LOG) {
    TypeBasedForm = VacationWorkLogFields;
  } else if (type === WORK_LOG) {
    TypeBasedForm = WorkLogFields;
  }

  return (
    <>
      <BaseFields
        formData={formData}
        formValidity={formValidity}
        isInEditState={isInEditState}
        isWorkLogTimeActive={isWorkLogTimeActive}
        onFormDataChange={onFormDataChange}
      />
      <TypeBasedForm
        formData={formData}
        formValidity={formValidity}
        isInEditState={isInEditState}
        isWorkLogTimeActive={isWorkLogTimeActive}
        onFormDataChange={onFormDataChange}
      />
    </>
  );
};

FieldsComponent.propTypes = {
  formData: PropTypes.shape({
    type: PropTypes.oneOf([
      BUSINESS_TRIP_WORK_LOG,
      HOME_OFFICE_WORK_LOG,
      OVERTIME_WORK_LOG,
      SICK_DAY_WORK_LOG,
      SPECIAL_LEAVE_WORK_LOG,
      TIME_OFF_WORK_LOG,
      TRAINING_WORK_LOG,
      VACATION_WORK_LOG,
      WORK_LOG,
    ]).isRequired,
  }).isRequired,
  formValidity: PropTypes.shape({}).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  isWorkLogTimeActive: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
};

export default FieldsComponent;
