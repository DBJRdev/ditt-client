import Immutable from 'immutable';
import { createDate } from '../src/services/dateTimeService';

export default Immutable.fromJS({
  supportedHolidays: [
    createDate(2018, 0, 1),
    createDate(2018, 11, 24),
    createDate(2018, 11, 25),
    createDate(2018, 11, 26),
    createDate(2018, 11, 31),
    createDate(2019, 0, 1),
    createDate(2019, 11, 24),
    createDate(2019, 11, 25),
    createDate(2019, 11, 26),
    createDate(2019, 11, 31),
    createDate(2020, 0, 1),
    createDate(2020, 11, 24),
    createDate(2020, 11, 25),
    createDate(2020, 11, 26),
    createDate(2020, 11, 31),
    createDate(2021, 0, 1),
    createDate(2021, 11, 24),
    createDate(2021, 11, 25),
    createDate(2021, 11, 26),
    createDate(2021, 11, 31),
  ],
  supportedYear: [
    2018,
    2019,
    2020,
    2021,
  ],
});
