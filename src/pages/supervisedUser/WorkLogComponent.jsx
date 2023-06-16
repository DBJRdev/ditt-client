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
import {
  createDate,
  localizedMoment,
} from '../../services/dateTimeService';
import { getWorkMonthByMonth } from '../../services/workLogService';

class WorkLogComponent extends React.Component {
  constructor(props) {
    super(props);

    const { match } = props;

    this.state = {
      selectedDate: localizedMoment(),
    };

    if (match.params.year && match.params.month) {
      this.state = {
        selectedDate: createDate(
          match.params.year,
          match.params.month - 1,
          1,
        ),
      };
    }

    this.changeSelectedDate = this.changeSelectedDate.bind(this);
  }

  componentDidMount() {
    const {
      fetchConfig,
      fetchContractList,
      fetchWorkMonthList,
      match,
    } = this.props;
    const { selectedDate } = this.state;

    fetchConfig();
    fetchContractList(match.params.id);
    fetchWorkMonthList(match.params.id).then(() => {
      this.fetchWorkMonth(selectedDate);
    });
  }

  fetchWorkMonth(selectedDate) {
    const {
      fetchWorkMonth,
      workMonthList,
    } = this.props;

    const workMonth = getWorkMonthByMonth(selectedDate, workMonthList);

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
      fetchWorkMonthList,
      isFetching,
      match,
      t,
      token,
      user,
      workMonth,
      workMonthList,
    } = this.props;
    const { selectedDate } = this.state;

    let title = t('workLog:title.workLogs');

    if (workMonth) {
      const selectedUser = workMonth.user;
      const name = `${selectedUser.firstName} ${selectedUser.lastName}`;
      title = t('workLog:title.supervisedUserWorkLogs', { name });
    }

    return (
      <Layout loading={isFetching} title={title}>
        {config && (
          <WorkLogCalendar
            changeSelectedDate={this.changeSelectedDate}
            config={config}
            contracts={contracts}
            fetchWorkMonth={() => this.fetchWorkMonth(selectedDate)}
            fetchWorkMonthList={() => fetchWorkMonthList(match.params.id).then(() => {
              this.fetchWorkMonth(selectedDate);
            })}
            selectedDate={selectedDate}
            supervisorView
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      month: PropTypes.string,
      year: PropTypes.string,
    }).isRequired,
  }).isRequired,
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
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
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
