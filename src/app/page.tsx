"use client";

import { useEffect, useState } from "react";
import { YearSelector } from "@/components/yearSelector";
import { MonthButtons } from "@/components/monthButton";
import { ExpenseForm } from "@/components/expenseForm";
import { ExpenseSummary } from "@/components/expenseSummary";
import { ExpenseByTypeChart } from "@/components/expenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/monthlyExpensesChart";
import { CalendarView } from "../components/calendarView";

interface Expense {
  _id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  installments?: number;
  note?: string;
}

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

  const handleAddExpense = async (data: {
    type: string;
    day: string;
    amount: string;
    paymentMethod: string;
    installments?: string;
  }) => {
    const totalInstallments = data.installments
      ? parseInt(data.installments)
      : 1;

    const baseDate = new Date(selectedYear, selectedMonth!, parseInt(data.day));
    const valuePerInstallment = parseFloat(data.amount) / totalInstallments;

    const generatedExpenses: Expense[] = Array.from(
      { length: totalInstallments },
      (_, i) => {
        const installmentDate = new Date(baseDate);
        installmentDate.setMonth(baseDate.getMonth() + i);

        return {
          type: data.type,
          date: installmentDate.toISOString(),
          amount: parseFloat(valuePerInstallment.toFixed(2)),
          paymentMethod: data.paymentMethod,
          installments: totalInstallments,
        };
      }
    );

    for (const expense of generatedExpenses) {
      const response = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(expense),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const saved = await response.json();
      setExpenses((prev) => [...prev, { ...expense, _id: saved.insertedId }]);
    }
  };

  const mappedExpenses = expenses.map(({ _id, ...rest }) => ({
    id: _id || "",
    ...rest,
  }));

  return (
    <main className="w-[100vw] mt-4 bg-white h-full text-black rounded-md flex flex-col gap-4 p-10">
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
              onDelete={async (id) => {
                await fetch(`/api/expenses/${id}`, {
                  method: "DELETE",
                });

                setExpenses((prev) =>
                  prev.filter((expense) => expense._id !== id)
                );
              }}
            />
          )}
        </div>
      </div>

      <div>
        {selectedMonth !== null && (
          <CalendarView
            expenses={mappedExpenses}
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
