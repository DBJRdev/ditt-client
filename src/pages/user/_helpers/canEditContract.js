import { STATUS_OPENED } from '../../../resources/workMonth';
import {
  isWorkMonthWithinContract,
} from '../../../services/contractService/isWorkMonthWithinContract';

export const canEditContract = (contract, workMonths) => {
  if (contract.id == null) {
    return true;
  }

  for (let i = 0; i < workMonths.length; i += 1) {
    const workMonth = workMonths[i];

    if (workMonth.status !== STATUS_OPENED && isWorkMonthWithinContract(workMonth, contract)) {
      return false;
    }
  }

  return true;
};
