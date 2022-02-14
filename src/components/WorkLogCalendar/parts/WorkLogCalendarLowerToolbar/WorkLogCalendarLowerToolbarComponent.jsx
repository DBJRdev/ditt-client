import { Button } from '@react-ui-org/react-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import styles from '../../WorkLogCalendar.scss';
import {
  STATUS_OPENED,
} from '../../../../resources/workMonth';
import {
  Icon, LoadingIcon,
} from '../../../Icon';

const WorkLogCalendarLowerToolbarComponent = ({
  countWaitingForApprovalWorkLogs,
  supervisorView,
  t,
  isPosting,
  workMonth,
  markWaitingForApproval,
}) => {
  if (
    !(
      !supervisorView
      && workMonth.status === STATUS_OPENED
    )
  ) {
    return null;
  }

  return (
    <div className={styles.sendForApprovalButtonWrapper}>
      <Button
        beforeLabel={<Icon icon="send" />}
        disabled={!workMonth || !!countWaitingForApprovalWorkLogs()}
        feedbackIcon={isPosting ? <LoadingIcon /> : null}
        label={t('workLog:action.sendWorkMonthForApproval')}
        onClick={() => {
          if (workMonth) {
            markWaitingForApproval(workMonth.id);
          }
        }}
      />
    </div>
  );
};

WorkLogCalendarLowerToolbarComponent.defaultProps = {
  isPosting: false,
};

WorkLogCalendarLowerToolbarComponent.propTypes = {
  countWaitingForApprovalWorkLogs: PropTypes.func.isRequired,
  isPosting: PropTypes.bool,
  markWaitingForApproval: PropTypes.func.isRequired,
  supervisorView: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  workMonth: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default withTranslation()(WorkLogCalendarLowerToolbarComponent);
