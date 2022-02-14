import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';

const HomeOfficeWorkLogFieldsComponent = ({
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
      id="comment"
      label={t('homeOfficeWorkLog:element.comment')}
      onChange={onFormDataChange}
      validationText={formValidity.elements.comment}
      validationState={formValidity.elements.comment ? 'invalid' : null}
      value={formData.comment || ''}
    />
  </>
);

HomeOfficeWorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    comment: PropTypes.string,
    dateTo: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      comment: PropTypes.string,
      dateTo: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(HomeOfficeWorkLogFieldsComponent);
