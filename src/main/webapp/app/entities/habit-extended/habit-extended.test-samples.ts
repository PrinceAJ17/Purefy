import dayjs from 'dayjs/esm';

import { IHabitExtended, NewHabitExtended } from './habit-extended.model';

export const sampleWithRequiredData: IHabitExtended = {
  id: 3596,
};

export const sampleWithPartialData: IHabitExtended = {
  id: 57075,
  habitExtendedName: 'systematic Rupiah',
};

export const sampleWithFullData: IHabitExtended = {
  id: 65825,
  habitExtendedID: 51243,
  habitExtendedName: 'Frozen',
  habitCompletionCheckbox: false,
  habitDate: dayjs('2024-04-04T17:06'),
};

export const sampleWithNewData: NewHabitExtended = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
