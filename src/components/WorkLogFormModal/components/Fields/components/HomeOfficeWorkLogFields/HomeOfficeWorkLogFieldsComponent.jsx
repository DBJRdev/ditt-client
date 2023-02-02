import PropTypes from 'prop-types';
import React from 'react';
import {
  FormLayoutCustomField,
  TextField,
} from '@react-ui-org/react-ui';
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
    <FormLayoutCustomField label={t('businessTripWorkLog:element.plannedStart')}>
      <TextField
        id="plannedStartHour"
        inputSize={2}
        isLabelVisible={false}
        max={23}
        min={0}
        onChange={onFormDataChange}
        label={t('homeOfficeWorkLog:element.plannedStartHour')}
        type="number"
        validationState={formValidity.elements.plannedStartHour ? 'invalid' : null}
        validationText={formValidity.elements.plannedStartHour}
        value={formData.plannedStartHour || ''}
      />
      <span className="ml-2 mr-2">:</span>
      <TextField
        id="plannedStartMinute"
        inputSize={2}
        isLabelVisible={false}
        max={59}
        min={0}
        onChange={onFormDataChange}
        label={t('homeOfficeWorkLog:element.plannedStartMinute')}
        type="number"
        validationState={formValidity.elements.plannedStartMinute ? 'invalid' : null}
        validationText={formValidity.elements.plannedStartMinute}
        value={formData.plannedStartMinute || ''}
      />
      <span className="ml-2">h</span>
    </FormLayoutCustomField>
    <FormLayoutCustomField label={t('businessTripWorkLog:element.plannedEnd')}>
      <TextField
        autoFocus
        id="plannedEndHour"
        inputSize={2}
        isLabelVisible={false}
        max={23}
        min={0}
        onChange={onFormDataChange}
        label={t('homeOfficeWorkLog:element.plannedEndHour')}
        type="number"
        validationState={formValidity.elements.plannedEndHour ? 'invalid' : null}
        validationText={formValidity.elements.plannedEndHour}
        value={formData.plannedEndHour || ''}
      />
      <span className="ml-2 mr-2">:</span>
      <TextField
        id="plannedEndMinute"
        inputSize={2}
        isLabelVisible={false}
        max={59}
        min={0}
        onChange={onFormDataChange}
        label={t('homeOfficeWorkLog:element.plannedEndMinute')}
        type="number"
        validationState={formValidity.elements.plannedEndMinute ? 'invalid' : null}
        validationText={formValidity.elements.plannedEndMinute}
        value={formData.plannedEndMinute || ''}
      />
      <span className="ml-2">h</span>
    </FormLayoutCustomField>
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
    plannedEndHour: PropTypes.string,
    plannedEndMinute: PropTypes.string,
    plannedStartHour: PropTypes.string,
    plannedStartMinute: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      comment: PropTypes.string,
      dateTo: PropTypes.string,
      plannedEndHour: PropTypes.string,
      plannedEndMinute: PropTypes.string,
      plannedStartHour: PropTypes.string,
      plannedStartMinute: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(HomeOfficeWorkLogFieldsComponent);
