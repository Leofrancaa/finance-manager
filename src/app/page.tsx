"use client";

import { useEffect, useState } from "react";
import { YearSelector } from "@/components/yearSelector";
import { MonthButtons } from "@/components/monthButton";
import { ExpenseForm } from "@/components/expenseForm";
import { ExpenseSummary } from "@/components/expenseSummary";
import { ExpenseByTypeChart } from "@/components/expenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/monthlyExpensesChart";
import { CalendarView } from "@/components/calendarView";

import { Expense, AddExpenseData, MappedExpense } from "./interfaces/expense";

import {
  generateInstallments,
  saveExpenses,
  filterExpensesByMonthYear,
} from "./utils/expense";

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  const handleAddExpense = async (data: AddExpenseData) => {
    const newExpenses = generateInstallments(
      data,
      selectedYear,
      selectedMonth!
    );
    const saved = await saveExpenses(newExpenses);
    setExpenses((prev) => [...prev, ...saved]);
  };

  const mappedExpenses: MappedExpense[] = expenses.map(({ _id, ...rest }) => ({
    id: _id || "",
    ...rest,
  }));

  const handleDelete = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    setExpenses((prev) => prev.filter((expense) => expense._id !== id));
  };

  const filteredExpenses = filterExpensesByMonthYear(
    mappedExpenses,
    selectedYear,
    selectedMonth!
  );

  return (
    <main className="w-[100vw] mt-4 bg-gray-200 h-full text-black rounded-md flex flex-col gap-4 p-10">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Finanças</h1>

      <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />

      <div className="flex gap-6">
        <div className="w-[45vw]">
          {selectedYear && (
            <MonthButtons
              selectedMonth={selectedMonth}
              onSelect={setSelectedMonth}
            />
          )}
          {selectedMonth !== null && (
            <ExpenseForm onSubmit={handleAddExpense} />
          )}
        </div>

        <div className="w-[50vw]">
          {selectedMonth !== null && (
            <ExpenseSummary
              expenses={mappedExpenses}
              year={selectedYear}
              month={selectedMonth}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <div>
        {selectedMonth !== null && (
          <CalendarView
            expenses={filteredExpenses}
            year={selectedYear}
            month={selectedMonth}
          />
        )}
      </div>

      <div className="flex gap-4 mt-4 flex-col">
        {selectedMonth !== null && (
          <div className="flex-1">
            <ExpenseByTypeChart
              expenses={mappedExpenses}
              year={selectedYear}
              month={selectedMonth}
            />
          </div>
        )}
        {selectedMonth !== null && (
          <MonthlyExpensesChart expenses={mappedExpenses} year={selectedYear} />
        )}
      </div>
    </main>
  );
}
