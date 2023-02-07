export const orderTableRows = (rows, tableOrder) => {
  const d = tableOrder.direction === 'asc' ? 1 : -1;

  if (tableOrder.column === 'employeeId') {
    rows.sort((rowA, rowB) => rowA.user.employeeId.localeCompare(rowB.user.employeeId) * d);
  }

  if (tableOrder.column === 'name') {
    rows.sort((rowA, rowB) => rowA.user.lastName.localeCompare(rowB.user.lastName) * d);
  }

  return rows;
};
