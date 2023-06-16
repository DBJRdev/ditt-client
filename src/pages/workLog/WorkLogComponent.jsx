import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { WorkLogCalendar } from '../../components/WorkLogCalendar';
import Layout from '../../components/Layout';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../resources/workMonth';
import { localizedMoment } from '../../services/dateTimeService';
import { getWorkMonthByMonth } from '../../services/workLogService';

class WorkLogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: localizedMoment(),
    };

    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.fetchWorkMonth = this.fetchWorkMonth.bind(this);
  }

  componentDidMount() {
    const {
      fetchConfig,
      fetchContractList,
      fetchWorkMonthList,
      user,
    } = this.props;
    const { selectedDate } = this.state;

    fetchConfig();
    fetchContractList(user.uid);
    fetchWorkMonthList(user.uid).then(() => {
      this.fetchWorkMonth(selectedDate);
    });
  }

  fetchWorkMonth(selectedDateOverride = null) {
    const {
      fetchWorkMonth,
      workMonthList,
    } = this.props;
    const { selectedDate } = this.state;

    const workMonth = getWorkMonthByMonth(
      selectedDateOverride ?? selectedDate,
      workMonthList,
    );

    if (workMonth) {
      return fetchWorkMonth(workMonth.id);
    }

    return null;
  }

  changeSelectedDate(selectedDate) {
    this.fetchWorkMonth(selectedDate).then(() => this.setState({ selectedDate }));
  }

  render() {
    const {
      config,
      contracts,
      isFetching,
      isPosting,
      t,
      token,
      user,
      workMonth,
      workMonthList,
    } = this.props;
    const { selectedDate } = this.state;

    return (
      <Layout
        loading={isFetching}
        title={t('workLog:title.workLogs')}
      >
        {config && (
          <WorkLogCalendar
            changeSelectedDate={this.changeSelectedDate}
            config={config}
            contracts={contracts}
            fetchWorkMonth={this.fetchWorkMonth}
            isPosting={isPosting}
            selectedDate={selectedDate}
            token={token}
            user={user}
            workMonth={workMonth}
            workMonthList={workMonthList}
          />
        )}
      </Layout>
    );
  }
}

WorkLogComponent.defaultProps = {
  config: {},
  contracts: [],
  workMonth: null,
};

WorkLogComponent.propTypes = {
  config: PropTypes.shape({}),
  contracts: PropTypes.arrayOf(PropTypes.shape({
    endDateTime: PropTypes.shape(),
    id: PropTypes.number,
    isDayBased: PropTypes.bool.isRequired,
    isFridayIncluded: PropTypes.bool.isRequired,
    isMondayIncluded: PropTypes.bool.isRequired,
    isThursdayIncluded: PropTypes.bool.isRequired,
    isTuesdayIncluded: PropTypes.bool.isRequired,
    isWednesdayIncluded: PropTypes.bool.isRequired,
    startDateTime: PropTypes.shape().isRequired,
    weeklyWorkingDays: PropTypes.number.isRequired,
    weeklyWorkingHours: PropTypes.number.isRequired,
  })),
  fetchConfig: PropTypes.func.isRequired,
  fetchContractList: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.shape({
    exp: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    uid: PropTypes.number.isRequired,
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
  })).isRequired,
};

export default withTranslation()(WorkLogComponent);
