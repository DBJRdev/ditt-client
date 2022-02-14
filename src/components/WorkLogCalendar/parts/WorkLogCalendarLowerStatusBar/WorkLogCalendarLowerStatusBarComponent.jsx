import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import styles from '../../WorkLogCalendar.scss';
import {
  STATUS_APPROVED,
} from '../../../../resources/workMonth';
import { toHourMinuteFormatFromInt } from '../../../../services/dateTimeService';

const WorkLogCalendarLowerStatusBarComponent = ({
  status,
  t,
  workHoursInfo,
}) => {
  if (
    !(
      status === STATUS_APPROVED && workHoursInfo
    )
  ) {
    return null;
  }

  return (
    <p className={styles.statusAtEndOfMonth}>
      {t(
        'workLog:text.statusAtEndOfMonth',
        { hours: toHourMinuteFormatFromInt(-workHoursInfo.requiredHoursLeft, true) },
      )}
    </p>
  );
};

WorkLogCalendarLowerStatusBarComponent.propTypes = {
  status: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  workHoursInfo: PropTypes.shape({
    requiredHoursLeft: PropTypes.number.isRequired,
  }).isRequired,
};

export default withTranslation()(WorkLogCalendarLowerStatusBarComponent);
