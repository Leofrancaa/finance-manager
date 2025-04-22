import React from "react";
import { Expense } from "@/app/interfaces/expense";

interface ExpenseSummaryProps {
  expenses: Expense[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
}
const ALERT_THRESHOLDS: Record<string, number> = {
  alimentação: 500,
  transporte: 300,
  lazer: 200,
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function monthName(monthNumber: number) {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return months[monthNumber] || "";
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  expenses,
  year,
  month,
  onDelete,
}) => {
  const filteredMonthly = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const totalMonthly = filteredMonthly.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const yearlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year;
  });

  const totalByType: Record<string, number> = {};
  yearlyExpenses.forEach((exp) => {
    if (!totalByType[exp.type]) totalByType[exp.type] = 0;
    totalByType[exp.type] += exp.amount;
  });

  // Alertas por tipo
  const alerts: string[] = [];
  Object.entries(ALERT_THRESHOLDS).forEach(([type, threshold]) => {
    const totalThisMonth = filteredMonthly
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);

    if (totalThisMonth >= threshold * 0.9) {
      alerts.push(type);
    }
  });

  const hasEmptyId = filteredMonthly.some((e) => !e.id);
  const idCounts = filteredMonthly.reduce((acc, e) => {
    if (e.id) {
      acc[e.id] = (acc[e.id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const duplicateIds = Object.entries(idCounts)
    .filter(([, v]) => v > 1)
    .map(([id]) => id);

  if (hasEmptyId) {
    console.warn(
      "Há item(s) com id vazio!",
      filteredMonthly.filter((e) => !e.id)
    );
  }
  if (duplicateIds.length > 0) {
    console.warn("IDs duplicados no mês:", duplicateIds);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border-2 border-black p-4 rounded-md mt-4 text-black max-h-[60vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">
          Total de {monthName(month)}: R$ {totalMonthly.toFixed(2)}
        </h2>

        {alerts.length > 0 && (
          <div
            className="p-3 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 rounded-md mb-4"
            role="alert"
            aria-live="polite"
          >
            <p className="font-semibold">Atenção!</p>
            <ul className="list-disc list-inside">
              {alerts.map((type) => (
                <li key={type}>
                  Gasto com <strong>{capitalize(type)}</strong> está próximo ou
                  acima do limite de R$ {ALERT_THRESHOLDS[type].toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredMonthly.length === 0 ? (
          <p className="text-gray-500 mt-2">
            Nenhuma despesa registrada neste mês.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {filteredMonthly.map((exp) => (
              <li
                key={exp.id}
                className="bg-black rounded-md text-white p-3 shadow-lg border-l-4 border-black flex items-center justify-between"
              >
                <div>
                  <span>
                    • {capitalize(exp.type)}{" "}
                    {exp.fixed && (
                      <span className="mx-1 px-2 py-1 rounded bg-yellow-400 text-black text-xs font-semibold">
                        GASTO FIXO
                      </span>
                    )}
                    – {new Date(exp.date).toLocaleDateString()} – R${" "}
                    {exp.amount.toFixed(2)}
                  </span>
                  {exp.note && (
                    <span className="block mt-1 text-gray-300">{exp.note}</span>
                  )}
                  {exp.fixed && !exp.note && (
                    <span className="block mt-1 text-yellow-200 italic">
                      Despesa recorrente lançada como gasto fixo neste mês.
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onDelete(exp.id || "")}
                  className="text-white px-4 py-2 rounded-md text-xs bg-red-600 cursor-pointer my-2 h-9 hover:bg-red-500 transition-colors duration-300"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 bg-white rounded-md mt-4 text-black border-2 border-black max-h-[50vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Resumo Anual por Tipo ({year})</h2>
        {Object.keys(totalByType).length === 0 ? (
          <p className="text-gray-500 mt-2">Nenhum gasto lançado neste ano.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(totalByType).map(([type, total]) => (
              <li
                className="bg-black text-white px-4 py-2 rounded-md my-4"
                key={type}
              >
                • {capitalize(type)} – R$ {total.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
