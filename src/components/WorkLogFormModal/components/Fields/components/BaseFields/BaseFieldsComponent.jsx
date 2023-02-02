import PropTypes from 'prop-types';
import React from 'react';
import {
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
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
} from '../../../../../../resources/workMonth';

const BaseFieldsComponent = ({
  formData,
  formValidity,
  isInEditState,
  isWorkLogTimeActive,
  onFormDataChange,
  t,
}) => (
  <>
    <TextField
      disabled
      id="date"
      label={
        t(
          (
            formData.type === BUSINESS_TRIP_WORK_LOG
            || formData.type === HOME_OFFICE_WORK_LOG
            || formData.type === SICK_DAY_WORK_LOG
            || formData.type === SPECIAL_LEAVE_WORK_LOG
            || formData.type === TIME_OFF_WORK_LOG
            || formData.type === TRAINING_WORK_LOG
            || formData.type === VACATION_WORK_LOG
          )
            ? 'workLog:element.dateFrom'
            : 'workLog:element.date',
        )
      }
      validationState={formValidity.elements.date ? 'invalid' : null}
      validationText={formValidity.elements.date}
      value={formData.date || ''}
    />
    <SelectField
      disabled={isInEditState || isWorkLogTimeActive}
      id="type"
      label={t('workLog:element.type')}
      onChange={onFormDataChange}
      options={[
        {
          label: t('workMonth:constant.type.workLog'),
          value: WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.businessTripWorkLog'),
          value: BUSINESS_TRIP_WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.homeOfficeWorkLog'),
          value: HOME_OFFICE_WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.overtimeWorkLog'),
          value: OVERTIME_WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.sickDayWorkLog'),
          value: SICK_DAY_WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.specialLeaveWorkLog'),
          value: SPECIAL_LEAVE_WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.timeOffWorkLog'),
          value: TIME_OFF_WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.trainingWorkLog'),
          value: TRAINING_WORK_LOG,
        },
        {
          label: t('workMonth:constant.type.vacationWorkLog'),
          value: VACATION_WORK_LOG,
        },
      ]}
      validationState={formValidity.elements.type ? 'invalid' : null}
      validationText={formValidity.elements.type}
      value={formData.type || ''}
    />
  </>
);

BaseFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    date: PropTypes.string,
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
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      date: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  isWorkLogTimeActive: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(BaseFieldsComponent);
