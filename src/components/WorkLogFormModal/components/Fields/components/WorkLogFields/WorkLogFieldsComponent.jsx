import PropTypes from 'prop-types';
import React from 'react';
import {
  FormLayoutCustomField,
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
        max={23}
        min={0}
        onChange={onFormDataChange}
        label={t('workLog:element.startHour')}
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
        max={59}
        min={0}
        onChange={onFormDataChange}
        label={t('workLog:element.startMinute')}
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
        max={23}
        min={0}
        onChange={onFormDataChange}
        label={t('workLog:element.endHour')}
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
        max={59}
        min={0}
        onChange={onFormDataChange}
        label={t('workLog:element.endMinute')}
        type="number"
        validationState={formValidity.elements.endMinute ? 'invalid' : null}
        validationText={formValidity.elements.endMinute}
        value={formData.endMinute || ''}
      />
      <span className="ml-2">h</span>
    </FormLayoutCustomField>
  </>
);

WorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    endHour: PropTypes.string,
    endMinute: PropTypes.string,
    startHour: PropTypes.string,
    startMinute: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      endHour: PropTypes.string,
      endMinute: PropTypes.string,
      startHour: PropTypes.string,
      startMinute: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(WorkLogFieldsComponent);
