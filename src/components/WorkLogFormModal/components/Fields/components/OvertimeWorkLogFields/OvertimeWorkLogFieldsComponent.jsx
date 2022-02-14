import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';

const OvertimeWorkLogFieldsComponent = ({
  formData,
  formValidity,
  onFormDataChange,
  t,
}) => (
  <TextField
    id="reason"
    label={t('overtimeWorkLog:element.reason')}
    onChange={onFormDataChange}
    validationState={formValidity.elements.reason ? 'invalid' : null}
    validationText={formValidity.elements.reason}
    value={formData.reason || ''}
  />
);

OvertimeWorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    reason: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      reason: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(OvertimeWorkLogFieldsComponent);
