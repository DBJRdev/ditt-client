export const orderTableRows = (rows, tableOrder) => {
  const d = tableOrder.direction === 'asc' ? 1 : -1;

  if (tableOrder.column === 'name') {
    rows
      .sort((rowA, rowB) => rowA.user.firstName.localeCompare(rowB.user.firstName) * d)
      .sort((rowA, rowB) => rowA.user.lastName.localeCompare(rowB.user.lastName) * d);
  }

  return rows;
};
