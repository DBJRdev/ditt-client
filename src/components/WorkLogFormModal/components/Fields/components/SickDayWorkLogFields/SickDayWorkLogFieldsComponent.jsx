import PropTypes from 'prop-types';
import React from 'react';
import {
  SelectField,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../../../../../../resources/sickDayWorkLog';

const SickDayWorkLogFieldsComponent = ({
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
    <SelectField
      id="variant"
      label={t('sickDayWorkLog:element.variant')}
      onChange={onFormDataChange}
      options={[
        {
          label: t('sickDayWorkLog:constant.variant.withNote'),
          value: VARIANT_WITH_NOTE,
        },
        {
          label: t('sickDayWorkLog:constant.variant.withoutNote'),
          value: VARIANT_WITHOUT_NOTE,
        },
        {
          label: t('sickDayWorkLog:constant.variant.sickChild'),
          value: VARIANT_SICK_CHILD,
        },
      ]}
      validationState={formValidity.elements.variant ? 'invalid' : null}
      validationText={formValidity.elements.variant}
      value={formData.variant || ''}
    />
    {formData.variant === VARIANT_SICK_CHILD && (
      <>
        <TextField
          id="childName"
          onChange={onFormDataChange}
          label={t('sickDayWorkLog:element.childName')}
          validationState={formValidity.elements.childName ? 'invalid' : null}
          validationText={formValidity.elements.childName}
          value={formData.childName || ''}
        />
        <TextField
          id="childDateOfBirth"
          onChange={onFormDataChange}
          label={t('sickDayWorkLog:element.childDateOfBirth')}
          validationState={formValidity.elements.childDateOfBirth ? 'invalid' : null}
          validationText={formValidity.elements.childDateOfBirth}
          value={formData.childDateOfBirth || ''}
        />
      </>
    )}
  </>
);

SickDayWorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    childDateOfBirth: PropTypes.string,
    childName: PropTypes.string,
    dateTo: PropTypes.string,
    variant: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      childDateOfBirth: PropTypes.string,
      childName: PropTypes.string,
      dateTo: PropTypes.string,
      variant: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(SickDayWorkLogFieldsComponent);
