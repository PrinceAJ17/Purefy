import dayjs from 'dayjs/esm';

export interface IEntriesFeature {
  id: number;
  title?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
}

export type NewEntriesFeature = Omit<IEntriesFeature, 'id'> & { id: null };
