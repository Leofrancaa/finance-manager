"use client";

import { useEffect, useState } from "react";
import { YearSelector } from "@/components/yearSelector";
import { MonthButtons } from "@/components/monthButton";
import { ExpenseForm } from "@/components/expenseForm";
import { ExpenseSummary } from "@/components/expenseSummary";
import { ExpenseByTypeChart } from "@/components/expenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/monthlyExpensesChart";

// Interface que representa uma despesa
interface Expense {
  _id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  installments?: number;
}

export default function HomePage() {
  // Estado para ano e mês selecionado
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Estado com todas as despesas carregadas do banco
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // 👉 Carrega as despesas uma vez ao carregar a página
  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  // 👉 Função chamada ao adicionar uma nova despesa (considera parcelas)
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

    // 👉 Gera uma despesa para cada parcela
    const generatedExpenses: Expense[] = Array.from(
      { length: totalInstallments },
      (_, i) => {
        const installmentDate = new Date(baseDate);
        installmentDate.setMonth(baseDate.getMonth() + i); // parcela mês a mês

        return {
          type: data.type,
          date: installmentDate.toISOString(),
          amount: parseFloat(valuePerInstallment.toFixed(2)), // evita erro de float
          paymentMethod: data.paymentMethod,
          installments: totalInstallments,
        };
      }
    );

    // 👉 Envia cada parcela pro backend e atualiza o estado local
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

  return (
    <main className="w-[90vw] mt-4 p-12 bg-white h-full text-black rounded-md flex flex-col gap-4">
      {/* Título da aplicação */}
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Finanças</h1>

      {/* Seletor de Ano */}
      <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />

      {/* Área com botões de mês e formulário */}
      <div className="flex gap-6">
        <div className="w-[40vw]">
          {/* Botões dos meses */}
          {selectedYear && (
            <MonthButtons
              selectedMonth={selectedMonth}
              onSelect={setSelectedMonth}
            />
          )}

          {/* Formulário para adicionar nova despesa */}
          {selectedMonth !== null && (
            <>
              <ExpenseForm onSubmit={handleAddExpense} />
            </>
          )}
        </div>

        {/* Resumo das despesas (mensal e anual) */}
        <div className="w-[40vw]">
          {selectedMonth !== null && (
            <ExpenseSummary
              expenses={expenses.map(({ _id, ...rest }) => ({
                id: _id || "",
                ...rest,
              }))}
              year={selectedYear}
              month={selectedMonth}
              onDelete={async (id) => {
                // 1. Remove do MongoDB
                await fetch(`/api/expenses/${id}`, {
                  method: "DELETE",
                });

                // 2. Remove do estado local
                setExpenses((prev) =>
                  prev.filter((expense) => expense._id !== id)
                );
              }}
            />
          )}
        </div>
      </div>

      {/* Gráficos: por tipo e por mês */}
      <div className="flex gap-4 mt-4 flex-col">
        {/* Gráfico de despesas por tipo no mês atual */}
        {selectedMonth !== null && (
          <div className="flex-1">
            <ExpenseByTypeChart
              expenses={expenses.map(({ _id, ...rest }) => ({
                id: _id || "",
                ...rest,
              }))}
              year={selectedYear}
              month={selectedMonth}
            />
          </div>
        )}

        {/* Gráfico com evolução mensal no ano atual */}
        {selectedMonth !== null && (
          <MonthlyExpensesChart
            expenses={expenses.map(({ _id, ...rest }) => ({
              id: _id || "",
              ...rest,
            }))}
            year={selectedYear}
          />
        )}
      </div>
    </main>
  );
}
