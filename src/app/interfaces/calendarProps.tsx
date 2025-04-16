import { Expense } from "./expense";

export interface CalendarViewProps {
  year: number;
  month: number; // de 0 a 11
  expenses: Expense[];
}
