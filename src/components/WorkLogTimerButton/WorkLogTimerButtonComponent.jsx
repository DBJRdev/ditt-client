import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  Icon,
  LoadingIcon,
} from '../Icon';
import {
  localizedMoment,
  toJson,
  toMomentDateTime,
} from '../../services/dateTimeService';
import {
  getWorkLogTimer,
  removeWorkLogTimer,
  setWorkLogTimer,
} from '../../services/storageService';

class WorkLogTimerButtonComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workLogTimer: getWorkLogTimer()
        ? toMomentDateTime(getWorkLogTimer())
        : null,
      workLogTimerInterval: '00:00:00',
    };

    this.initAndStartWorkLogTimer = this.initAndStartWorkLogTimer.bind(this);
    this.stopWorkLogTimer = this.stopWorkLogTimer.bind(this);

    this.workLogTimer = null;

    if (this.state.workLogTimer) {
      this.startWorkLogTimer();
    }
  }

  initAndStartWorkLogTimer(e) {
    e.stopPropagation();

    const startTime = localizedMoment();

    this.setState({
      workLogTimer: startTime,
    }, () => {
      setWorkLogTimer(toJson(startTime));
      this.startWorkLogTimer();
    });
  }

  startWorkLogTimer() {
    const { workLogTimer } = this.state;

    this.workLogTimer = setInterval(() => {
      const endTime = localizedMoment();
      const intervalMilliSeconds = endTime.diff(workLogTimer);
      const interval = moment.utc(intervalMilliSeconds);

      this.setState({
        workLogTimerInterval: interval.format('HH:mm:ss'),
      });
    }, 1000);
  }

  stopWorkLogTimer(e) {
    e.stopPropagation();

    const {
      onAfterSave,
      onSave,
    } = this.props;

    const startTime = toMomentDateTime(getWorkLogTimer()).second(0);
    let endTime = localizedMoment().second(0);

    if (startTime.unix() === endTime.unix()) {
      endTime = endTime.add(1, 'minutes');
    }

    clearInterval(this.workLogTimer);

    this.setState({
      workLogTimer: null,
      workLogTimerInterval: '00:00:00',
    });
    removeWorkLogTimer();

    onSave(
      {
        endTime,
        startTime,
      },
    )
      .then((response) => {
        if (response.type.endsWith('WORK_LOG_SUCCESS')) {
          onAfterSave();
        }
      });
  }

  render() {
    const {
      isPosting,
      t,
    } = this.props;
    const {
      workLogTimer,
      workLogTimerInterval,
    } = this.state;

    if (workLogTimer) {
      return (
        <Button
          beforeLabel={<Icon icon="stop" />}
          block
          label={`${t('workLog:action.endWork')} | ${workLogTimerInterval}`}
          onClick={this.stopWorkLogTimer}
        />
      );
    }

    return (
      <Button
        beforeLabel={<Icon icon="play_arrow" />}
        block
        feedbackIcon={isPosting ? <LoadingIcon /> : null}
        label={t('workLog:action.startWork')}
        onClick={this.initAndStartWorkLogTimer}
      />
    );
  }
}

WorkLogTimerButtonComponent.defaultProps = {
  isPosting: false,
};

WorkLogTimerButtonComponent.propTypes = {
  isPosting: PropTypes.bool,
  onAfterSave: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(WorkLogTimerButtonComponent);
