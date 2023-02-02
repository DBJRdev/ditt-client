import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';

const SpecialLeaveWorkLogFieldsComponent = ({
  formData,
  formValidity,
  isInEditState,
  onFormDataChange,
  t,
}) => (
  <>
    <TextField
      disabled={isInEditState}
      id="dateTo"
      onChange={onFormDataChange}
      label={t('workLog:element.dateTo')}
      validationState={formValidity.elements.dateTo ? 'invalid' : null}
      validationText={formValidity.elements.dateTo}
      value={formData.dateTo || ''}
    />
    <TextField
      id="reason"
      label={t('specialLeaveWorkLog:element.reason')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.reason ? 'invalid' : null}
      validationText={formValidity.elements.reason}
      value={formData.reason || ''}
    />
  </>
);

SpecialLeaveWorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    dateTo: PropTypes.string,
    reason: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      dateTo: PropTypes.string,
      reason: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(SpecialLeaveWorkLogFieldsComponent);
