export const transformWorkHours = (data) => ({
  month: parseInt(data.month, 10),
  requiredHours: data.requiredHours,
  year: parseInt(data.year.year, 10),
});
