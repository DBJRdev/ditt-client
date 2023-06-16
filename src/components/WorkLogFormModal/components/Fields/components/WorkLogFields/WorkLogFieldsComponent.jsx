import PropTypes from 'prop-types';
import React from 'react';
import {
  FormLayoutCustomField,
  CheckboxField,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';

const WorkLogFieldsComponent = ({
  formData,
  formValidity,
  onFormDataChange,
  t,
}) => (
  <>
    <FormLayoutCustomField>
      <TextField
        autoFocus
        id="startHour"
        inputSize={2}
        isLabelVisible={false}
        label={t('workLog:element.startHour')}
        max={23}
        min={0}
        onChange={onFormDataChange}
        type="number"
        validationState={formValidity.elements.startHour ? 'invalid' : null}
        validationText={formValidity.elements.startHour}
        value={formData.startHour || ''}
      />
      <span className="ml-2 mr-2">:</span>
      <TextField
        id="startMinute"
        inputSize={2}
        isLabelVisible={false}
        label={t('workLog:element.startMinute')}
        max={59}
        min={0}
        onChange={onFormDataChange}
        type="number"
        validationState={formValidity.elements.startMinute ? 'invalid' : null}
        validationText={formValidity.elements.startMinute}
        value={formData.startMinute || ''}
      />
      <span className="ml-2">h</span>
    </FormLayoutCustomField>
    <FormLayoutCustomField>
      <TextField
        id="endHour"
        inputSize={2}
        isLabelVisible={false}
        label={t('workLog:element.endHour')}
        max={23}
        min={0}
        onChange={onFormDataChange}
        type="number"
        validationState={formValidity.elements.endHour ? 'invalid' : null}
        validationText={formValidity.elements.endHour}
        value={formData.endHour || ''}
      />
      <span className="ml-2 mr-2">:</span>
      <TextField
        id="endMinute"
        inputSize={2}
        isLabelVisible={false}
        label={t('workLog:element.endMinute')}
        max={59}
        min={0}
        onChange={onFormDataChange}
        type="number"
        validationState={formValidity.elements.endMinute ? 'invalid' : null}
        validationText={formValidity.elements.endMinute}
        value={formData.endMinute || ''}
      />
      <span className="ml-2">h</span>
    </FormLayoutCustomField>
    <CheckboxField
      checked={formData.isHomeOffice ?? false}
      id="isHomeOffice"
      label={t('workLog:element.isHomeOffice')}
      onChange={onFormDataChange}
      type="number"
      validationState={formValidity.elements.isHomeOffice ? 'invalid' : null}
      validationText={formValidity.elements.isHomeOffice}
    />
  </>
);

WorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    endHour: PropTypes.string,
    endMinute: PropTypes.string,
    isHomeOffice: PropTypes.bool,
    startHour: PropTypes.string,
    startMinute: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      endHour: PropTypes.string,
      endMinute: PropTypes.string,
      isHomeOffice: PropTypes.string,
      startHour: PropTypes.string,
      startMinute: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(WorkLogFieldsComponent);
