import {
  isWorkMonthWithinContract,
} from '../../../services/contractService/isWorkMonthWithinContract';

export const getContractsOfSelectedMonth = (contracts, workMonth) => contracts
  .filter((contract) => isWorkMonthWithinContract(workMonth, contract));
