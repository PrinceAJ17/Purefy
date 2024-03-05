import { IGrouping } from 'app/entities/grouping/grouping.model';

export interface ILeaderBoards {
  id: number;
  standings?: string | null;
  grouping?: Pick<IGrouping, 'id'> | null;
}

export type NewLeaderBoards = Omit<ILeaderBoards, 'id'> & { id: null };
