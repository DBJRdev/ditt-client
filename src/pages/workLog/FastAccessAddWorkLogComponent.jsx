import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '../../components/Icon';
import { WorkLogFormModal } from '../../components/WorkLogFormModal';
import { ROLE_EMPLOYEE } from '../../resources/user';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../resources/workMonth';
import {
  localizedMoment,
} from '../../services/dateTimeService';
import { getWorkMonthByMonth } from '../../services/workLogService';
import { Loader } from '../../components/Loader';
import styles from './workLog.scss';

class FastAccessAddWorkLogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClosed: false,
      isSaved: false,
      selectedDate: localizedMoment(),
    };
  }

  componentDidMount() {
    const {
      fetchConfig,
      fetchUserByApiToken,
      fetchWorkMonth,
      fetchWorkMonthList,
      match,
    } = this.props;
    const { selectedDate } = this.state;

    fetchUserByApiToken(match.params.apiToken).then((userResponse) => {
      if (userResponse.error || !userResponse.payload.roles.includes(ROLE_EMPLOYEE)) {
        this.setState({ isClosed: true });
      }

      fetchConfig();
      fetchWorkMonthList(userResponse.payload.id).then((workMonthListResponse) => {
        const filterWorkMonth = (data) => ({
          id: data.id,
          month: parseInt(data.month, 10),
          status: data.status,
          user: data.user,
          year: parseInt(data.year.year, 10),
        });
        const workMonth = getWorkMonthByMonth(
          selectedDate,
          workMonthListResponse.payload.map(filterWorkMonth),
        );

        if (workMonth) {
          fetchWorkMonth(workMonth.id);
        }
      });
    });
  }

  render() {
    const {
      config,
      isFetching,
      workMonth,
      workMonthList,
    } = this.props;
    const {
      isClosed,
      isSaved,
      selectedDate,
    } = this.state;

    if (!config || !workMonthList || !workMonth || isFetching) {
      return (
        <div className={styles.centeredText}>
          <Loader />
        </div>
      );
    }

    if (isSaved) {
      return (
        <div className={styles.savedIcon}>
          <Icon icon="check_circle" size="larger" />
        </div>
      );
    }

    if (isClosed) {
      return (
        <div className={styles.closeIcon}>
          <Icon icon="cancel" size="larger" />
        </div>
      );
    }

    return (
      <WorkLogFormModal
        date={selectedDate}
        isWorkLogTimerDisplayed
        onAfterSave={() => this.setState({ isSaved: true })}
        onClose={() => this.setState({ isClosed: true })}
      />
    );
  }
}

FastAccessAddWorkLogComponent.defaultProps = {
  config: {},
  workMonth: null,
  workMonthList: null,
};

FastAccessAddWorkLogComponent.propTypes = {
  config: PropTypes.shape({}),
  fetchConfig: PropTypes.func.isRequired,
  fetchUserByApiToken: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      apiToken: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  workMonth: PropTypes.shape({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    status: PropTypes.oneOf([
      STATUS_APPROVED,
      STATUS_OPENED,
      STATUS_WAITING_FOR_APPROVAL,
    ]).isRequired,
    workLogs: PropTypes.arrayOf(PropTypes.shape({
      endTime: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      isHomeOffice: PropTypes.bool.isRequired,
      startTime: PropTypes.shape.isRequired,
    })).isRequired,
    year: PropTypes.number,
  }),
  workMonthList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    year: PropTypes.number.isRequired,
  })),
};

export default FastAccessAddWorkLogComponent;
