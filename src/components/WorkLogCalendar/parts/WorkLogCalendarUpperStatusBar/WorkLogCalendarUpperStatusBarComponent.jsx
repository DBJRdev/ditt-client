import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  STATUS_OPENED,
} from '../../../../resources/workMonth';

const WorkLogCalendarUpperStatusBarComponent = ({
  supervisorView,
  status,
  t,
}) => {
  if (
    !(supervisorView && status === STATUS_OPENED)
  ) {
    return null;
  }

  return (
    <p>
      {t('workLog:text.openedWorkMonth')}
    </p>
  );
};

WorkLogCalendarUpperStatusBarComponent.propTypes = {
  status: PropTypes.string.isRequired,
  supervisorView: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(WorkLogCalendarUpperStatusBarComponent);
