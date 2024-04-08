import { IHabitstracking, NewHabitstracking } from './habitstracking.model';

export const sampleWithRequiredData: IHabitstracking = {
  id: 97467,
};

export const sampleWithPartialData: IHabitstracking = {
  id: 47560,
  dayOfHabit: 'Generic Outdoors Unbranded',
  weekOfHabit: 82178,
  habitIDEN: 52043,
};

export const sampleWithFullData: IHabitstracking = {
  id: 69763,
  nameOfHabit: 'ivory calculating',
  dayOfHabit: 'Guadeloupe deploy navigate',
  weekOfHabit: 29649,
  completedHabit: true,
  usernameHabit: 'matrix',
  habitIDEN: 97660,
};

export const sampleWithNewData: NewHabitstracking = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
