export interface Action {
  id: string;
  userId: string;
  userMaxActions: number;
  date: string;
  actionLeft: number;
}

export interface ActionsData {
  actions: Action[];
}
