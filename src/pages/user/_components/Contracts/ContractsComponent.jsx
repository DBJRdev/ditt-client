import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Table,
  Toolbar,
  ToolbarItem,
} from '@react-ui-org/react-ui';
import {
  Icon,
} from '../../../../components/Icon';
import {
  localizedMoment,
  toDayMonthYearFormat,
  toHourMinuteFormatFromInt,
} from '../../../../services/dateTimeService';
import { TERMINATE_CONTRACT_SUCCESS } from '../../../../resources/contract/actionTypes';
import { ContractModal } from '../ContractModal';
import styles from '../../user.scss';
import { canEditContract } from '../../_helpers/canEditContract';
import { TerminateContractModal } from '../TerminateContractModal';

const ContractsComponent = ({
  contracts,
  onContractAdd,
  onContractRemove,
  onContractSave,
  onContractTerminate,
  t,
  validationMessage,
  workMonths,
}) => {
  const [addModalShown, addModalShownSet] = useState(false);
  const [editModalData, editModalDataSet] = useState(null);
  const [terminateModalData, terminateModalDataSet] = useState(null);

  contracts.sort((a, b) => a.startDateTime.unix() - b.startDateTime.unix());

  return (
    <div>
      <Toolbar align="baseline" justify="space-between" nowrap>
        <ToolbarItem>
          <h2 className={styles.detailSubheader}>
            {t('user:text.contracts')}
          </h2>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            beforeLabel={<Icon icon="add" />}
            color="primary"
            label={t('user:action.addContract')}
            onClick={() => {
              addModalShownSet(true);
            }}
          />
        </ToolbarItem>
      </Toolbar>
      {validationMessage && (
        <div className="mb-5">
          <Alert
            color="danger"
            icon={<Icon icon="error" />}
          >
            <strong>
              {t('general:text.error')}
              {': '}
            </strong>
            {validationMessage}
          </Alert>
        </div>
      )}
      <Table
        columns={[
          {
            format: (row) => toDayMonthYearFormat(row.startDateTime),
            label: t('user:element.startDateTime'),
            name: 'startDateTime',
          },
          {
            format: (row) => (row.endDateTime ? toDayMonthYearFormat(row.endDateTime) : '–'),
            label: t('user:element.endDateTime'),
            name: 'endDateTime',
          },
          {
            format: (row) => (row.isDayBased ? t('user:element.dayBased') : t('user:element.flexible')),
            label: t('user:element.isDayBased'),
            name: 'isDayBased',
          },
          {
            label: t('user:element.weeklyWorkingDays'),
            name: 'weeklyWorkingDays',
          },
          {
            format: (row) => toHourMinuteFormatFromInt(row.weeklyWorkingHours * 3600),
            label: t('user:element.weeklyWorkingHours'),
            name: 'weeklyWorkingHours',
          },
          {
            format: (row) => (
              <Toolbar dense justify="end" nowrap>
                {
                  !canEditContract(row, workMonths)
                  && (row.endDateTime == null || row.endDateTime.isAfter(localizedMoment(), 'day'))
                  && (
                    <ToolbarItem>
                      <Button
                        beforeLabel={<Icon icon="event_busy" />}
                        color="danger"
                        label={t('user:action.terminateContract')}
                        labelVisibility="none"
                        onClick={() => {
                          terminateModalDataSet(row);
                        }}
                      />
                    </ToolbarItem>
                  )
                }
                <ToolbarItem>
                  <Button
                    beforeLabel={<Icon icon="delete" />}
                    color="danger"
                    disabled={!canEditContract(row, workMonths)}
                    label={t('user:action.removeContract')}
                    labelVisibility="none"
                    onClick={() => {
                      onContractRemove(row);
                    }}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    beforeLabel={<Icon icon="edit" />}
                    color="primary"
                    disabled={!canEditContract(row, workMonths)}
                    label={t('user:action.editContract')}
                    labelVisibility="none"
                    onClick={() => {
                      editModalDataSet(row);
                    }}
                  />
                </ToolbarItem>
              </Toolbar>
            ),
            label: '',
            name: 'actions',
          },
        ]}
        rows={contracts}
      />
      {addModalShown && (
        <ContractModal
          contracts={contracts}
          data={null}
          onClose={() => {
            addModalShownSet(false);
          }}
          onSave={(data) => {
            onContractAdd(data);
            addModalShownSet(false);
          }}
        />
      )}
      {editModalData && (
        <ContractModal
          data={editModalData}
          onClose={() => {
            editModalDataSet(null);
          }}
          onSave={(data) => {
            onContractSave(data);
            editModalDataSet(null);
          }}
        />
      )}
      {terminateModalData && (
        <TerminateContractModal
          contract={terminateModalData}
          onClose={() => terminateModalDataSet(null)}
          onTerminate={async (id, data) => {
            const response = await onContractTerminate(id, data);

            if (response.type === TERMINATE_CONTRACT_SUCCESS) {
              terminateModalDataSet(null);
            }

            return response;
          }}
        />
      )}
    </div>
  );
};

ContractsComponent.propTypes = {
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
  })).isRequired,
  onContractAdd: PropTypes.func.isRequired,
  onContractRemove: PropTypes.func.isRequired,
  onContractSave: PropTypes.func.isRequired,
  onContractTerminate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  validationMessage: PropTypes.string,
  workMonths: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ContractsComponent.defaultProps = {
  validationMessage: null,
};

export default withTranslation()(ContractsComponent);
