import { generate } from 'shortid';
import PropTypes from 'prop-types';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  Button,
  CheckboxField,
  ScrollView,
  Table,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
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
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import { orderTableRows } from './_helpers/orderTableRows';
import styles from './styles.scss';

const lighterRow = (row) => (row.user.isArchived ? styles.lighterRow : '');

const OverviewComponent = (props) => {
  const {
    fetchConfig,
    fetchYearOverview,
  } = props;

  const [includeArchived, setIncludeArchived] = useState(false);

  const [tableOrder, tableOrderSet] = useState({
    column: 'lastName',
    direction: 'asc',
  });

  useEffect(() => {
    fetchConfig();
    fetchYearOverview({});
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
    <Layout loading={props.isFetching}>
      <div className="mb-5">
        <Toolbar
          align="baseline"
          justify="space-between"
        >
          <ToolbarItem>
            <h2 className={styles.bodyTitle}>
              {props.t('hr:title.yearOverview')}
            </h2>
          </ToolbarItem>
          <ToolbarGroup>
            <ToolbarItem>
              <CheckboxField
                checked={includeArchived}
                label="Include archived users"
                onChange={() => {
                  setIncludeArchived((v) => !v);
                }}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button
                feedbackIcon={props.isFetching && <LoadingIcon />}
                label={props.t('hr:action.refresh')}
                onClick={() => {
                  fetchYearOverview({ includeArchived });
                }}
              />
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </div>
      <ScrollView direction="horizontal">
        <Table
          columns={[
            {
              format: (rowData) => (
                <span className={lighterRow(rowData)}>
                  {rowData.user.employeeId}
                </span>
              ),
              isSortable: true,
              label: props.t('hr:element.employeeId'),
              name: 'employeeId',
            },
            {
              format: (rowData) => (
                <span className={lighterRow(rowData)}>
                  {`${rowData.user.lastName} ${rowData.user.firstName}`}
                </span>
              ),
              isSortable: true,
              label: props.t('hr:element.name'),
              name: 'name',
            },
            {
              format: (rowData) => (
                <span className={lighterRow(rowData)}>
                  {sickDayFormat(VARIANT_SICK_CHILD)(rowData)}
                </span>
              ),
              label: props.t('hr:element.sickDaySickChild'),
              name: 'sickDaySickChild',
            },
            {
              format: (rowData) => (
                <span className={lighterRow(rowData)}>
                  {sickDayFormat(VARIANT_WITH_NOTE)(rowData)}
                </span>
              ),
              label: props.t('hr:element.sickDayWithNote'),
              name: 'sickDayWithNote',
            },
            {
              format: (rowData) => (
                <span className={lighterRow(rowData)}>
                  {sickDayFormat(VARIANT_WITHOUT_NOTE)(rowData)}
                </span>
              ),
              label: props.t('hr:element.sickDayWithoutNote'),
              name: 'sickDayWithoutNote',
            },
            {
              format: (rowData) => (
                <span className={lighterRow(rowData)}>
                  {rowData.sickDays
                    .filter((sickDay) => sickDay.variant === VARIANT_SICK_CHILD).length}
                </span>
              ),
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
              format: (rowData) => (
                <span className={lighterRow(rowData)}>
                  {rowData.sickDays
                    .filter((sickDay) => sickDay.variant !== VARIANT_SICK_CHILD).length}
                </span>
              ),
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
          rows={orderTableRows(props.yearOverview || [], tableOrder)}
          sort={{
            ascendingIcon: <Icon icon="arrow_upward" />,
            column: tableOrder.column,
            descendingIcon: <Icon icon="arrow_downward" />,
            direction: tableOrder.direction,
            onClick: (column, direction) => {
              tableOrderSet({
                column,
                direction: direction === 'asc' ? 'desc' : 'asc',
              });
            },
          }}
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
