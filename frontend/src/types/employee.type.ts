export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  startingWorkYear: number;
  department?: string;
  shifts?: string[];
}
