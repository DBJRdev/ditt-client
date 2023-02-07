import { generate } from 'shortid';
import PropTypes from 'prop-types';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  Button,
  ScrollView,
  Table,
  TextField,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import {
  VARIANT_SICK_CHILD,
  VARIANT_WITH_NOTE,
  VARIANT_WITHOUT_NOTE,
} from '../../resources/sickDayWorkLog';
import {
  localizedMoment,
  toAbsoluteHourMinuteFormatFromInt,
  toDayMonthYearFormat, toMomentDateTimeFromDayMonthYear,
} from '../../services/dateTimeService';
import {
  collapseWorkLogs,
} from '../../services/workLogService';
import Layout from '../../components/Layout';
import styles from './styles.scss';
import { orderTableRows } from './_helpers/orderTableRows';

const ChangesAndAbsenceRegistrationComponent = (props) => {
  const { fetchConfig } = props;

  const [dateFrom, setDateFrom] = useState(toDayMonthYearFormat(localizedMoment().subtract(1, 'month')));
  const [dateTo, setDateTo] = useState(toDayMonthYearFormat(localizedMoment()));

  const [dateFromError, setDateFromError] = useState(null);
  const [dateToError, setDateToError] = useState(null);

  const [tableOrder, tableOrderSet] = useState({
    column: 'lastName',
    direction: 'asc',
  });

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <Layout loading={!props.config}>
      <div className="mb-5">
        <Toolbar
          align="baseline"
          justify="space-between"
        >
          <ToolbarItem>
            <h2 className={styles.bodyTitle}>
              {props.t('hr:title.changesAndAbsenceRegistration')}
            </h2>
          </ToolbarItem>
          <ToolbarGroup dense>
            <ToolbarGroup dense>
              <ToolbarGroup dense align="middle">
                <ToolbarItem>
                  {props.t('hr:element.period')}
                  :
                </ToolbarItem>
                <ToolbarItem>
                  <TextField
                    id="dateFrom"
                    inputSize={10}
                    isLabelVisible={false}
                    label={props.t('hr:element.dateFrom')}
                    layout="horizontal"
                    onChange={(e) => setDateFrom(e.target.value)}
                    value={dateFrom || ''}
                    validationState={dateFromError ? 'invalid' : null}
                    validationText={dateFromError}
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup dense align="middle">
                <ToolbarItem>
                  <span className="ml-1 mr-1">
                    –
                  </span>
                </ToolbarItem>
                <ToolbarItem>
                  <TextField
                    id="dateTo"
                    inputSize={10}
                    isLabelVisible={false}
                    label={props.t('hr:element.dateTo')}
                    layout="horizontal"
                    onChange={(e) => setDateTo(e.target.value)}
                    value={dateTo || ''}
                    validationState={dateToError ? 'invalid' : null}
                    validationText={dateToError}
                  />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarGroup>
            <ToolbarItem>
              <Button
                feedbackIcon={props.isFetching && <LoadingIcon />}
                label={props.t('hr:action.refresh')}
                onClick={() => {
                  let hasError = false;
                  let dateFromObj;
                  let dateToObj;

                  setDateFromError(null);
                  setDateToError(null);

                  try {
                    dateFromObj = toMomentDateTimeFromDayMonthYear(dateFrom);
                  } catch (ex) {
                    setDateFromError(props.t('general:validation.invalidDate'));
                    hasError = true;
                  }

                  try {
                    dateToObj = toMomentDateTimeFromDayMonthYear(dateTo);
                  } catch (ex) {
                    setDateToError(props.t('general:validation.invalidDate'));
                    hasError = true;
                  }

                  if (!hasError) {
                    if (dateFromObj.isAfter(dateToObj, 'day')) {
                      setDateFromError(props.t('general:validation.invalidDate'));
                      return;
                    }

                    props.fetchChangesAndAbsenceRegistrations({
                      dateFrom,
                      dateTo,
                    });
                  }
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
              format: (rowData) => rowData.user.employeeId,
              isSortable: true,
              label: props.t('hr:element.employeeId'),
              name: 'employeeId',
            },
            {
              format: (rowData) => `${rowData.user.lastName} ${rowData.user.firstName}`,
              isSortable: true,
              label: props.t('hr:element.name'),
              name: 'name',
            },
            {
              format: (rowData) => {
                const changes = [];

                let currentWorkHour = rowData.workHours[0];
                for (let i = 1; i < rowData.workHours.length; i += 1) {
                  if (currentWorkHour.requiredHours > rowData.workHours[i].requiredHours) {
                    changes.push(props.t(
                      'hr:text.reductionText',
                      {
                        month: rowData.workHours[i].month.toString().padStart(2, '0'),
                        time: toAbsoluteHourMinuteFormatFromInt(rowData.workHours[i].requiredHours),
                      },
                    ));
                  } else if (currentWorkHour.requiredHours < rowData.workHours[i].requiredHours) {
                    changes.push(props.t(
                      'hr:text.increaseText',
                      {
                        month: rowData.workHours[i].month.toString().padStart(2, '0'),
                        time: toAbsoluteHourMinuteFormatFromInt(rowData.workHours[i].requiredHours),
                      },
                    ));
                  }

                  currentWorkHour = rowData.workHours[i];
                }

                return changes.map((change, index, arr) => (
                  <div
                    className={(arr.length === index + 1) ? undefined : 'mb-2'}
                    key={generate()}
                  >
                    {change}
                  </div>
                ));
              },
              label: props.t('hr:element.contractChanges'),
              name: 'contractChanges',
            },
            {
              format: (rowData) => collapseWorkLogs(
                rowData.sickDays.filter((sickDay) => sickDay.variant === VARIANT_SICK_CHILD),
                props.config.supportedHolidays,
              )
                .map((sickDay, index, arr) => (
                  <div
                    className={(arr.length === index + 1) ? undefined : 'mb-2'}
                    key={generate()}
                  >
                    {toDayMonthYearFormat(sickDay.date)}
                    {sickDay.isBulk && (
                      <>
                        {' – '}
                        {toDayMonthYearFormat(sickDay.dateTo)}
                      </>
                    )}
                    <br />
                    <span>
                      {sickDay.childName}
                      {' '}
                      (*
                      {toDayMonthYearFormat(sickDay.childDateOfBirth)}
                      )
                    </span>
                  </div>
                )),
              label: props.t('hr:element.childSickDays'),
              name: 'childSickDays',
            },
            {
              format: (rowData) => collapseWorkLogs(
                rowData.sickDays.filter((sickDay) => sickDay.variant === VARIANT_WITH_NOTE),
                props.config.supportedHolidays,
              )
                .map((sickDay, index, arr) => (
                  <div
                    className={(arr.length === index + 1) ? undefined : 'mb-2'}
                    key={generate()}
                  >
                    {toDayMonthYearFormat(sickDay.date)}
                    {sickDay.isBulk && (
                      <>
                        {' – '}
                        {toDayMonthYearFormat(sickDay.dateTo)}
                      </>
                    )}
                    <br />
                  </div>
                )),
              label: props.t('hr:element.employeeSickDaysWithNote'),
              name: 'employeeSickDays',
            },
            {
              format: (rowData) => collapseWorkLogs(
                rowData.sickDays.filter((sickDay) => sickDay.variant === VARIANT_WITHOUT_NOTE),
                props.config.supportedHolidays,
              )
                .map((sickDay, index, arr) => (
                  <div
                    className={(arr.length === index + 1) ? undefined : 'mb-2'}
                    key={generate()}
                  >
                    {toDayMonthYearFormat(sickDay.date)}
                    {sickDay.isBulk && (
                      <>
                        {' – '}
                        {toDayMonthYearFormat(sickDay.dateTo)}
                      </>
                    )}
                    <br />
                  </div>
                )),
              label: props.t('hr:element.employeeSickDaysWithoutNote'),
              name: 'employeeSickDays',
            },
          ]}
          rows={orderTableRows(props.changesAndAbsenceRegistrations || [], tableOrder)}
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

ChangesAndAbsenceRegistrationComponent.defaultProps = {
  changesAndAbsenceRegistrations: [],
  config: null,
};

ChangesAndAbsenceRegistrationComponent.propTypes = {
  changesAndAbsenceRegistrations: PropTypes.arrayOf(PropTypes.shape),
  config: PropTypes.shape({
    supportedHolidays: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }),
  fetchChangesAndAbsenceRegistrations: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(ChangesAndAbsenceRegistrationComponent);
