import { ITrackedHabit, NewTrackedHabit } from './tracked-habit.model';

export const sampleWithRequiredData: ITrackedHabit = {
  id: 25689,
};

export const sampleWithPartialData: ITrackedHabit = {
  id: 89542,
  completed: true,
};

export const sampleWithFullData: ITrackedHabit = {
  id: 41778,
  completed: true,
  trackedHabitID: 25557,
};

export const sampleWithNewData: NewTrackedHabit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
