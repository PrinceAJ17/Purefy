import { IHabit } from 'app/entities/habit/habit.model';
import { INewWeeklyHabitTracker } from 'app/entities/new-weekly-habit-tracker/new-weekly-habit-tracker.model';

export interface ITrackedHabit {
  id: number;
  completed?: boolean | null;
  trackedHabitID?: number | null;
  rel1?: Pick<IHabit, 'id' | 'habitName'> | null;
  rel2?: Pick<INewWeeklyHabitTracker, 'id' | 'recordID'> | null;
}

export type NewTrackedHabit = Omit<ITrackedHabit, 'id'> & { id: null };
