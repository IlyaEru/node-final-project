import { User } from './user';

export interface allUserActionsData {
  data: allUserActionsDataItem[];
}

export interface allUserActionsDataItem {
  user: User;
  userLeftActions: number;
}
