import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@react-ui-org/react-ui';
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
      onChange={onFormDataChange}
      label={t('workLog:element.dateTo')}
      validationState={formValidity.elements.dateTo ? 'invalid' : null}
      validationText={formValidity.elements.dateTo}
      value={formData.dateTo || ''}
    />
    <TextField
      id="purpose"
      label={t('businessTripWorkLog:element.purpose')}
      onChange={onFormDataChange}
      validationText={formValidity.elements.purpose}
      validationState={formValidity.elements.purpose ? 'invalid' : null}
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
    purpose: PropTypes.string,
    transport: PropTypes.string,
  }).isRequired,
  formValidity: PropTypes.shape({
    elements: PropTypes.shape({
      dateTo: PropTypes.string,
      destination: PropTypes.string,
      expectedArrival: PropTypes.string,
      expectedDeparture: PropTypes.string,
      purpose: PropTypes.string,
      transport: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isInEditState: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(BusinessTripWorkLogFieldsComponent);
