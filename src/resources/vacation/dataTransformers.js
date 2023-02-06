export const transformVacation = (data) => ({
  remainingVacationDays: data.remainingVacationDays,
  vacationDays: data.vacationDays,
  vacationDaysCorrection: data.vacationDaysCorrection,
  year: parseInt(data.year.year, 10),
});
