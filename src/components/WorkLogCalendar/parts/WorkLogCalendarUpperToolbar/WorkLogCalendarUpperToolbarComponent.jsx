import { Button } from '@react-ui-org/react-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import styles from '../../WorkLogCalendar.scss';
import {
  STATUS_APPROVED,
} from '../../../../resources/workMonth';
import { ROLE_SUPER_ADMIN } from '../../../../resources/user';

const WorkLogCalendarUpperToolbarComponent = ({
  exportData,
  openSupervisorWorkTimeCorrectionModal,
  supervisorView,
  t,
  user,
  workMonth,
}) => {
  if (
    !(
      supervisorView
      && user.roles.includes(ROLE_SUPER_ADMIN)
      && (user.uid !== workMonth.user.id)
    )
  ) {
    return null;
  }

  if (workMonth.status === STATUS_APPROVED) {
    return (
      <div className={styles.tableToolbar}>
        <Button
          label={t('workMonth:actions.export')}
          onClick={exportData}
        />
      </div>
    );
  }

  return (
    <div className={styles.tableToolbar}>
      <Button
        label={t('workMonth:actions.setWorkTimeCorrection')}
        onClick={openSupervisorWorkTimeCorrectionModal}
      />
    </div>
  );
};

WorkLogCalendarUpperToolbarComponent.propTypes = {
  exportData: PropTypes.func.isRequired,
  openSupervisorWorkTimeCorrectionModal: PropTypes.func.isRequired,
  supervisorView: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    uid: PropTypes.number.isRequired,
  }).isRequired,
  workMonth: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withTranslation()(WorkLogCalendarUpperToolbarComponent);
