import { RecurringExpense } from "../interfaces/recurringExpense";

import { Expense } from "../interfaces/expense";

export function generateFixedExpensesForMonth(
  recurring: RecurringExpense[],
  year: number,
  month: number
): Expense[] {
  return recurring
    .filter((fix) => {
      const start = new Date(fix.startDate);
      const thisMonth = new Date(year, month, 1);
      return start <= thisMonth;
    })
    .map((fix) => ({
      id: `recurring-${fix.id}-${year}-${month + 1}`,
      type: fix.type,
      amount: fix.amount,
      date: new Date(year, month, fix.day).toISOString(),
      note: fix.note,
      paymentMethod: "default", // Add a default payment method
      fixed: true,
    }));
}
