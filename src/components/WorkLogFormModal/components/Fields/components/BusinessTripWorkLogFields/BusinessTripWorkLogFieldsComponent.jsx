import PropTypes from 'prop-types';
import React from 'react';
import {
  FormLayoutCustomField,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';

const BusinessTripWorkLogFieldsComponent = ({
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
      label={t('workLog:element.dateTo')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.dateTo ? 'invalid' : null}
      validationText={formValidity.elements.dateTo}
      value={formData.dateTo || ''}
    />
    <FormLayoutCustomField label={t('businessTripWorkLog:element.plannedStart')}>
      <TextField
        id="plannedStartHour"
        inputSize={2}
        isLabelVisible={false}
        label={t('businessTripWorkLog:element.plannedStartHour')}
        max={23}
        min={0}
        onChange={onFormDataChange}
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
        label={t('businessTripWorkLog:element.plannedStartMinute')}
        max={59}
        min={0}
        onChange={onFormDataChange}
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
        label={t('businessTripWorkLog:element.plannedEndHour')}
        max={23}
        min={0}
        onChange={onFormDataChange}
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
        label={t('businessTripWorkLog:element.plannedEndMinute')}
        max={59}
        min={0}
        onChange={onFormDataChange}
        type="number"
        validationState={formValidity.elements.plannedEndMinute ? 'invalid' : null}
        validationText={formValidity.elements.plannedEndMinute}
        value={formData.plannedEndMinute || ''}
      />
      <span className="ml-2">h</span>
    </FormLayoutCustomField>
    <TextField
      id="purpose"
      label={t('businessTripWorkLog:element.purpose')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.purpose ? 'invalid' : null}
      validationText={formValidity.elements.purpose}
      value={formData.purpose || ''}
    />
    <TextField
      id="destination"
      label={t('businessTripWorkLog:element.destination')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.destination ? 'invalid' : null}
      validationText={formValidity.elements.destination}
      value={formData.destination || ''}
    />
    <TextField
      id="transport"
      label={t('businessTripWorkLog:element.transport')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.transport ? 'invalid' : null}
      validationText={formValidity.elements.transport}
      value={formData.transport || ''}
    />
    <TextField
      id="expectedDeparture"
      label={t('businessTripWorkLog:element.expectedDeparture')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.expectedDeparture ? 'invalid' : null}
      validationText={formValidity.elements.expectedDeparture}
      value={formData.expectedDeparture || ''}
    />
    <TextField
      id="expectedArrival"
      label={t('businessTripWorkLog:element.expectedArrival')}
      onChange={onFormDataChange}
      validationState={formValidity.elements.expectedArrival ? 'invalid' : null}
      validationText={formValidity.elements.expectedArrival}
      value={formData.expectedArrival || ''}
    />
  </>
);

BusinessTripWorkLogFieldsComponent.propTypes = {
  formData: PropTypes.shape({
    dateTo: PropTypes.string,
    destination: PropTypes.string,
    expectedArrival: PropTypes.string,
    expectedDeparture: PropTypes.string,
    plannedEndHour: PropTypes.string,
    plannedEndMinute: PropTypes.string,
    plannedStartHour: PropTypes.string,
    plannedStartMinute: PropTypes.string,
    purpose: PropTypes.string,
    transport: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      dateTo: PropTypes.string,
      destination: PropTypes.string,
      expectedArrival: PropTypes.string,
      expectedDeparture: PropTypes.string,
      plannedEndHour: PropTypes.string,
      plannedEndMinute: PropTypes.string,
      plannedStartHour: PropTypes.string,
      plannedStartMinute: PropTypes.string,
      purpose: PropTypes.string,
      transport: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(BusinessTripWorkLogFieldsComponent);
