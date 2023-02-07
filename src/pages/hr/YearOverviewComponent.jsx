import { generate } from 'shortid';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {
  ScrollView,
  Table,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../../resources/sickDayWorkLog';
import { toDayMonthYearFormat } from '../../services/dateTimeService';
import Layout from '../../components/Layout';
import { collapseWorkLogs } from '../../services/workLogService';

const OverviewComponent = (props) => {
  const {
    fetchConfig,
    fetchYearOverview,
  } = props;

  useEffect(() => {
    fetchConfig();
    fetchYearOverview();
  }, [fetchConfig, fetchYearOverview]);

  const sickDayFormat = (variant) => (rowData) => {
    const filteredSickDays = rowData.sickDays
      .filter((sickDay) => sickDay.variant === variant);
    const collapsedSickDays = collapseWorkLogs(
      filteredSickDays,
      props.config.supportedHolidays,
    );

    return collapsedSickDays.map((sickDay, index, arr) => {
      const count = sickDay.bulkIds ? sickDay.bulkIds.length : 0;

      return (
        <div
          className={(arr.length === index + 1) ? undefined : 'mb-2'}
          key={generate()}
        >
          {toDayMonthYearFormat(sickDay.date)}
          {sickDay.isBulk && (
            <>
              {' – '}
              {toDayMonthYearFormat(sickDay.dateTo)}
              {count > 0 ? ` (${count})` : null}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <Layout title={props.t('hr:title.yearOverview')} loading={props.isFetching}>
      <ScrollView direction="horizontal">
        <Table
          columns={[
            {
              format: (rowData) => rowData.user.employeeId,
              label: props.t('hr:element.employeeId'),
              name: 'employeeId',
            },
            {
              format: (rowData) => `${rowData.user.lastName} ${rowData.user.firstName}`,
              label: props.t('hr:element.name'),
              name: 'name',
            },
            {
              format: sickDayFormat(VARIANT_SICK_CHILD),
              label: props.t('hr:element.sickDaySickChild'),
              name: 'sickDaySickChild',
            },
            {
              format: sickDayFormat(VARIANT_WITH_NOTE),
              label: props.t('hr:element.sickDayWithNote'),
              name: 'sickDayWithNote',
            },
            {
              format: sickDayFormat(VARIANT_WITHOUT_NOTE),
              label: props.t('hr:element.sickDayWithoutNote'),
              name: 'sickDayWithoutNote',
            },
            {
              format: (rowData) => rowData.sickDays
                .filter((sickDay) => sickDay.variant === VARIANT_SICK_CHILD).length,
              label: (
                <>
                  {props.t('hr:element.sickChildTotal')}
                  <br />
                  {props.t('hr:element.last365Days')}
                </>
              ),
              name: 'totalSickChild',
            },
            {
              format: (rowData) => rowData.sickDays
                .filter((sickDay) => sickDay.variant !== VARIANT_SICK_CHILD).length,
              label: (
                <>
                  {props.t('hr:element.sickDayTotal')}
                  <br />
                  {props.t('hr:element.last365Days')}
                </>
              ),
              name: 'totalSick',
            },
          ]}
          rows={props.yearOverview || []}
        />
      </ScrollView>
    </Layout>
  );
};

OverviewComponent.defaultProps = {
  config: null,
  yearOverview: [],
};

OverviewComponent.propTypes = {
  config: PropTypes.shape({
    supportedHolidays: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }),
  fetchConfig: PropTypes.func.isRequired,
  fetchYearOverview: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  yearOverview: PropTypes.arrayOf(PropTypes.shape),
};

export default withTranslation()(OverviewComponent);
