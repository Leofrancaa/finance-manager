import { Expense, AddExpenseData } from "../interfaces/expense";

export async function saveExpenses(expenses: Expense[]): Promise<Expense[]> {
  const savedExpenses: Expense[] = [];

  for (const expense of expenses) {
    const response = await fetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const saved = await response.json();
    savedExpenses.push({ ...expense, id: saved.insertedId });
  }

  return savedExpenses;
}

export function generateInstallments(
  data: AddExpenseData,
  selectedYear: number,
  selectedMonth: number
): Expense[] {
  const totalInstallments = data.installments ? parseInt(data.installments) : 1;

  const baseDate = new Date(selectedYear, selectedMonth, parseInt(data.day));
  const valuePerInstallment = parseFloat(data.amount) / totalInstallments;

  return Array.from({ length: totalInstallments }, (_, i) => {
    const installmentDate = new Date(baseDate);
    installmentDate.setMonth(baseDate.getMonth() + i);

    return {
      type: data.type,
      date: installmentDate.toISOString(),
      amount: parseFloat(valuePerInstallment.toFixed(2)),
      paymentMethod: data.paymentMethod,
      installments: totalInstallments,
      note: data.note,
    };
  });
}

export function filterExpensesByMonthYear(
  expenses: Expense[],
  year: number,
  month: number
): Expense[] {
  return expenses.filter((expense) => {
    const date = new Date(expense.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}
