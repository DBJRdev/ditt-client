import Immutable from 'immutable';
import { toMomentDateTime } from '../../src/services/dateTimeService';

export default Immutable.fromJS({
  supportedHolidays: [
    toMomentDateTime('2018-01-01T00:00:00.000Z'),
    toMomentDateTime('2018-12-24T00:00:00.000Z'),
    toMomentDateTime('2018-12-25T00:00:00.000Z'),
    toMomentDateTime('2018-12-26T00:00:00.000Z'),
    toMomentDateTime('2018-12-31T00:00:00.000Z'),
  ],
  supportedYear: [
    2018,
    2019,
    2020,
    2021,
  ],
  workedHoursLimits: {
    lowerLimit: {
      changeBy: -1800,
      limit: 21600,
    },
    upperLimit: {
      changeBy: -2700,
      limit: 32400,
    },
  },
});
