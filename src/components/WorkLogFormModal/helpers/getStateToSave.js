import {
  BUSINESS_TRIP_WORK_LOG,
  HOME_OFFICE_WORK_LOG, OVERTIME_WORK_LOG,
  SICK_DAY_WORK_LOG, SPECIAL_LEAVE_WORK_LOG,
  TIME_OFF_WORK_LOG, VACATION_WORK_LOG, WORK_LOG,
} from '../../../resources/workMonth';
import { VARIANT_SICK_CHILD } from '../../../resources/sickDayWorkLog';
import { toMomentDateTimeFromDayMonthYear } from '../../../services/dateTimeService';

export const getStateToSave = (formData, date) => ({
  childDateOfBirth:
    (formData.type === SICK_DAY_WORK_LOG && formData.variant === VARIANT_SICK_CHILD)
      ? toMomentDateTimeFromDayMonthYear(formData.childDateOfBirth)
      : null,
  childName: (formData.type === SICK_DAY_WORK_LOG && formData.variant === VARIANT_SICK_CHILD)
    ? formData.childName
    : null,
  comment: (formData.type === HOME_OFFICE_WORK_LOG || formData.type === TIME_OFF_WORK_LOG)
    ? formData.comment
    : null,
  date: formData.type !== WORK_LOG
    ? date.clone()
    : null,
  dateTo: (
    formData.type === BUSINESS_TRIP_WORK_LOG
    || formData.type === HOME_OFFICE_WORK_LOG
    || formData.type === SICK_DAY_WORK_LOG
    || formData.type === SPECIAL_LEAVE_WORK_LOG
    || formData.type === TIME_OFF_WORK_LOG
    || formData.type === VACATION_WORK_LOG
  )
    ? toMomentDateTimeFromDayMonthYear(formData.dateTo)
    : null,
  destination: formData.type === BUSINESS_TRIP_WORK_LOG
    ? formData.destination
    : null,
  endTime: formData.type === WORK_LOG
    ? date.clone().hour(formData.endHour).minute(formData.endMinute).second(0)
    : null,
  expectedArrival: formData.type === BUSINESS_TRIP_WORK_LOG
    ? formData.expectedArrival || '23:59'
    : null,
  expectedDeparture: formData.type === BUSINESS_TRIP_WORK_LOG
    ? formData.expectedDeparture || '00:00'
    : null,
  id: formData.id || null,
  purpose: formData.type === BUSINESS_TRIP_WORK_LOG
    ? formData.purpose
    : null,
  reason: formData.type === OVERTIME_WORK_LOG
    ? formData.reason
    : null,
  startTime: formData.type === WORK_LOG
    ? date.clone().hour(formData.startHour).minute(formData.startMinute).second(0)
    : null,
  transport: formData.type === BUSINESS_TRIP_WORK_LOG
    ? formData.transport
    : null,
  type: formData.type,
  variant: formData.type === SICK_DAY_WORK_LOG
    ? formData.variant
    : null,
});
