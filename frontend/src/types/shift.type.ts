export interface Shift {
  _id: string;
  date: string;
  startTime: Date;
  endTime: Date;
  employees?: string[];
}
