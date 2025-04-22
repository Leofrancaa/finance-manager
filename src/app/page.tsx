"use client";

import { useEffect, useState } from "react";
import { YearSelector } from "@/components/yearSelector";
import { MonthButtons } from "@/components/monthButton";
import { ExpenseForm } from "@/components/expenseForm";
import { ExpenseSummary } from "@/components/expenseSummary";
import { ExpenseByTypeChart } from "@/components/expenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/monthlyExpensesChart";
import { CalendarView } from "@/components/calendarView";
import { Expense, AddExpenseData, Income } from "./interfaces/expense";
import { IncomeForm } from "@/components/incomeForm";
import { IncomeDashboard } from "@/components/incomeDashboard";
import { filterExpensesByMonthYear } from "./utils/expense";

interface RecurringExpense {
  id: string;
  type: string;
  amount: number;
  note?: string;
  day: number;
  startDate: string;
  paymentMethod: string;
  fixed?: boolean;
}

// Gera várias instâncias para os meses do ano do gasto fixo
function generateAllFixedExpensesForYear(
  recurringList: RecurringExpense[],
  year: number
): Expense[] {
  const fixeds: Expense[] = [];
  recurringList.forEach((fix) => {
    const start = new Date(fix.startDate);
    if (start.getFullYear() > year) return;
    const startMonth = start.getFullYear() === year ? start.getMonth() : 0;
    const endMonth = 11;
    for (let m = startMonth; m <= endMonth; m++) {
      fixeds.push({
        id: `recurring-${fix.id}-${year}-${m + 1}`,
        type: fix.type,
        amount: fix.amount,
        note: fix.note,
        date: new Date(year, m, fix.day ?? 1).toISOString(),
        fixed: true,
        paymentMethod: fix.paymentMethod || "default",
        startDate: fix.startDate,
        day: fix.day,
      });
    }
  });
  return fixeds;
}

function sanitize(expenses: Expense[]): Expense[] {
  const ids = new Set<string>();
  return expenses.map((e) => {
    let realId = e.id || generateUniqueId();
    while (ids.has(realId)) {
      realId = generateUniqueId();
    }
    ids.add(realId);
    return { ...e, id: realId };
  });
}

function generateUniqueId(prefix = "expense") {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
}

// Para receitas
function generateIncomeId() {
  return `income-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
}

export default function HomePage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Receitas
  const [incomes, setIncomes] = useState<Income[]>([]);

  // Carregar receitas do localStorage (padrão conforme gerenciador atual)
  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("incomes") || "[]");
    setIncomes(loaded || []);
  }, []);
  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);
  const handleAddIncome = (income: Omit<Income, "id">) => {
    setIncomes((prev) => [...prev, { ...income, id: generateIncomeId() }]);
  };

  // Carregar despesas avulsas do backend
  useEffect(() => {
    setLoading(true);
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) =>
        setExpenses(
          (data || []).map((e: Partial<Expense>) => ({
            ...e,
            id: e.id || e._id || generateUniqueId(),
            paymentMethod: e.paymentMethod || "default",
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  // Carregar gastos fixos recorrentes do backend, via API
  useEffect(() => {
    async function fetchRecurring() {
      try {
        const res = await fetch("/api/recurring-expenses");
        const arr = await res.json();
        setRecurringExpenses(
          (arr || []).map(
            (r: Partial<RecurringExpense & { _id?: string }>) => ({
              ...r,
              id: r.id || r._id || generateUniqueId("recurring"),
              paymentMethod: r.paymentMethod || "default",
            })
          )
        );
      } catch {
        alert("Erro ao carregar gastos fixos do servidor.");
        setRecurringExpenses([]);
      }
    }
    fetchRecurring();
  }, []);

  // Todas despesas do ano (fixas + avulsas)
  const fixedExpensesYear = generateAllFixedExpensesForYear(
    recurringExpenses,
    selectedYear
  );
  const allMappedExpenses: Expense[] = sanitize([
    ...expenses,
    ...fixedExpensesYear,
  ]);
  const filteredExpenses = filterExpensesByMonthYear(
    allMappedExpenses,
    selectedYear,
    selectedMonth
  );

  // Adicionar despesa (PATCH para gastos fixos via endpoint apropriado)
  const handleAddExpense = async (data: AddExpenseData) => {
    if (selectedMonth === null) return;

    if (data.fixed) {
      // Enviar gasto fixo ao backend, não só localStorage!
      const recurring = {
        type: data.type,
        amount: Number(data.amount),
        note: data.note,
        paymentMethod: data.paymentMethod || "default",
        day: data.day ? Number(data.day) : 1,
        startDate: new Date(
          selectedYear,
          selectedMonth,
          data.day ? Number(data.day) : 1
        )
          .toISOString()
          .slice(0, 10),
        fixed: true,
      };

      try {
        const resp = await fetch("/api/recurring-expenses", {
          method: "POST",
          body: JSON.stringify(recurring),
          headers: { "Content-Type": "application/json" },
        });
        if (!resp.ok) throw new Error("Erro ao salvar gasto fixo no servidor.");
        const saved = await resp.json();
        setRecurringExpenses((prev) => [
          ...prev,
          { ...recurring, id: saved.id || saved._id },
        ]);
      } catch {
        alert("Erro ao salvar gasto fixo.");
      }
    } else if (
      data.paymentMethod === "cartão de crédito" &&
      data.installments &&
      Number(data.installments) > 1
    ) {
      // Parcelados
      const partes = Number(data.installments);
      const valorParcela = Number(data.amount) / partes;
      const novaData = new Date(
        selectedYear,
        selectedMonth,
        data.day ? Number(data.day) : 1
      );
      const novasParcelas = Array.from({ length: partes }).map((_, idx) => {
        const dt = new Date(novaData);
        dt.setMonth(dt.getMonth() + idx);
        return {
          ...data,
          id: generateUniqueId(),
          date: dt.toISOString(),
          amount: valorParcela,
          installments: partes,
          installmentNumber: idx + 1,
          paymentMethod: "cartão de crédito",
          fixed: false,
          day: Number(data.day), // Ensure day is a number
          note:
            partes > 1
              ? `${data.note ? data.note + " - " : ""}Parcela ${
                  idx + 1
                } de ${partes}`
              : data.note,
        };
      });
      setExpenses((prev) => [...prev, ...novasParcelas]);
      // (Opcional) envie também ao backend cada parcela, se necessário!
    } else {
      // Normal
      const toSave = {
        ...data,
        id: generateUniqueId(),
        date: new Date(
          selectedYear,
          selectedMonth,
          data.day ? Number(data.day) : 1
        ).toISOString(),
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod || "default",
        fixed: false,
        installments: data.installments ? Number(data.installments) : undefined,
        day: data.day ? Number(data.day) : 1,
      };
      setExpenses((prev) => [...prev, toSave]);
      // (Opcional) envie ao backend também, se não fizer automaticamente já!
    }
  };

  // Remover despesas e gastos fixos recorrentes
  const handleDelete = async (id: string) => {
    if (id.startsWith("recurring-") || id.length === 24) {
      // É ObjectId puro ou "recurring-abcdef" → sempre pega só o id Mongo
      const recurringId = id.replace("recurring-", "");
      try {
        await fetch(`/api/recurring-expenses/${recurringId}`, {
          method: "DELETE",
        });
        setRecurringExpenses((prev) =>
          prev.filter(
            (r) =>
              (r.id || r.id)?.toString() !== recurringId &&
              (r.id || r.id)?.toString() !== id // cobre ambos jeitos
          )
        );
      } catch {
        alert("Erro ao deletar gasto fixo do servidor.");
      }
    } else {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      // (Opcional) envie DELETE para backend da despesa avulsa aqui também, se quiser!
    }
  };

  // Resumo do mês: despesas, receitas, saldo
  const despesasMes = allMappedExpenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    })
    .reduce((acc, e) => acc + Number(e.amount), 0);

  const receitasMes = incomes
    .filter((i) => {
      const d = new Date(i.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    })
    .reduce((acc, i) => acc + Number(i.amount), 0);

  const saldoMes = receitasMes - despesasMes;

  return (
    <main className="w-[100vw] mt-4 bg-gray-200 h-full text-black rounded-md flex flex-col gap-4 p-10">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Finanças</h1>

      <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />

      <div className="flex gap-6">
        <div className="w-[45vw]">
          <MonthButtons
            selectedMonth={selectedMonth}
            onSelect={setSelectedMonth}
          />
          <h2 className="text-xl font-bold mt-6">Adicionar Gastos</h2>
          {selectedMonth !== null && (
            <ExpenseForm onSubmit={handleAddExpense} />
          )}
          <div className="w-[95vw]">
            {/* Formulário de Receita */}
            <section className="mb-6 mt-6">
              <h2 className="text-xl font-bold mb-2">Adicionar Receita</h2>
              <IncomeForm onSubmit={handleAddIncome} />
            </section>
            {/* Dashboard de Receitas */}
            <IncomeDashboard
              incomes={incomes}
              year={selectedYear}
              month={selectedMonth}
            />

            {/* Saldo */}
            <div className="my-4 p-4 bg-gray-100 rounded border">
              <span className="text-lg font-bold">
                Saldo do mês:{" "}
                <span
                  className={saldoMes < 0 ? "text-red-600" : "text-green-600"}
                >
                  R$ {saldoMes.toFixed(2)}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="w-[50vw]">
          {selectedMonth !== null && (
            <ExpenseSummary
              expenses={allMappedExpenses}
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

      {loading && <div className="text-gray-600">Carregando...</div>}

      <div className="flex gap-4 mt-4 flex-col">
        {selectedMonth !== null && (
          <div className="flex-1">
            <ExpenseByTypeChart
              expenses={allMappedExpenses}
              year={selectedYear}
              month={selectedMonth}
            />
          </div>
        )}
        {selectedMonth !== null && (
          <MonthlyExpensesChart
            expenses={allMappedExpenses}
            year={selectedYear}
          />
        )}
      </div>
    </main>
  );
}
