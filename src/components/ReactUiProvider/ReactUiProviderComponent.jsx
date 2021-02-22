import PropTypes from 'prop-types';
import React from 'react';
import { RUIProvider } from '@react-ui-org/react-ui';
import { MODAL_PORTAL_ID } from '../../constants/ui';
import translator from '../../translator';

const ReactUiComponent = ({ children }) => {
  const globalProps = {
    Modal: {
      portalId: MODAL_PORTAL_ID,
    },
    ScrollView: {
      shadowSize: '2.5em',
    },
  };
  const translations = {
    Alert: {
      close: translator.t('general:action.close'),
    },
    Modal: {
      close: translator.t('general:action.close'),
    },
    ScrollView: {
      next: translator.t('general:action.next'),
      previous: translator.t('general:action.previous'),
    },
  };

  return (
    <RUIProvider
      globalProps={globalProps}
      translations={translations}
    >
      {children}
    </RUIProvider>
  );
};

ReactUiComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ReactUiComponent;
