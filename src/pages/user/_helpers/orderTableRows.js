export const orderTableRows = (rows, tableOrder) => {
  const d = tableOrder.direction === 'asc' ? 1 : -1;

  if (tableOrder.column === 'name') {
    rows
      .sort((rowA, rowB) => rowA.firstName.localeCompare(rowB.firstName) * d)
      .sort((rowA, rowB) => rowA.lastName.localeCompare(rowB.lastName) * d);
  }

  if (tableOrder.column === 'supervisorName') {
    rows
      .sort((rowA, rowB) => rowA.firstName.localeCompare(rowB.firstName) * d)
      .sort((rowA, rowB) => rowA.lastName.localeCompare(rowB.lastName) * d)
      .sort((rowA, rowB) => {
        if (rowA.supervisor) {
          return rowA.supervisor.firstName.localeCompare(rowB.supervisor?.firstName) * d;
        }

        return 1;
      })
      .sort((rowA, rowB) => {
        if (rowA.supervisor) {
          return rowA.supervisor.lastName.localeCompare(rowB.supervisor?.lastName) * d;
        }

        return 1;
      });
  }

  return rows;
};
