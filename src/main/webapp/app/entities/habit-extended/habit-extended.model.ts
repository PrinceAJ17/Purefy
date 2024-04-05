import dayjs from 'dayjs/esm';
import { INewWeeklyHabitTracker } from 'app/entities/new-weekly-habit-tracker/new-weekly-habit-tracker.model';

export interface IHabitExtended {
  id: number;
  habitExtendedID?: number | null;
  habitExtendedName?: string | null;
  habitCompletionCheckbox?: boolean | null;
  habitDate?: dayjs.Dayjs | null;
  rel1?: Pick<INewWeeklyHabitTracker, 'id' | 'recordID'> | null;
}

export type NewHabitExtended = Omit<IHabitExtended, 'id'> & { id: null };
