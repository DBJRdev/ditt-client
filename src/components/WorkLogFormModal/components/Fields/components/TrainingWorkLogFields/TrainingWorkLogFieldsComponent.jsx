import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';

const TrainingWorkLogFieldsComponent = ({
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
      nlabel={t('workLog:element.dateTo')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.dateTo ? 'invalid' : null}
      validationText={formValidity.elements.dateTo}
      value={formData.dateTo || ''}
    />
    <TextField
      id="title"
      label={t('trainingWorkLog:element.title')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.title ? 'invalid' : null}
      validationText={formValidity.elements.title}
      value={formData.title || ''}
    />
    <TextField
      id="comment"
      label={t('trainingWorkLog:element.comment')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.comment ? 'invalid' : null}
      validationText={formValidity.elements.comment}
      value={formData.comment || ''}
    />
  </>
);

TrainingWorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    comment: PropTypes.string,
    dateTo: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      comment: PropTypes.string,
      dateTo: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(TrainingWorkLogFieldsComponent);
