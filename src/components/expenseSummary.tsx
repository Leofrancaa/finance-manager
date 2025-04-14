interface Expense {
  id: string;
  date: string;
  amount: number;
  type: string;
}

interface ExpenseSummaryProps {
  expenses: Expense[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
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
    if (!totalByType[exp.type]) {
      totalByType[exp.type] = 0;
    }
    totalByType[exp.type] += exp.amount;
  });

  return (
    <div className=" p-4 bg-gray-100 rounded-md mt-4 text-black">
      {/* Resumo Mensal */}
      <div>
        <h2 className="text-xl font-bold">
          Total do mês: R$ {totalMonthly.toFixed(2)}
        </h2>
        <ul className="mt-2 space-y-1 text-sm">
          {filteredMonthly.map((exp) => (
            <li key={exp.id} className="flex justify-between items-center">
              <span>
                • {exp.type} – {new Date(exp.date).toLocaleDateString()} – R${" "}
                {exp.amount.toFixed(2)}
              </span>
              <button
                onClick={() => onDelete(exp.id)}
                className="text-red-600 text-xs ml-2 hover:underline cursor-pointer"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Resumo Anual */}
      <div className="pt-4 border-t border-gray-300">
        <h2 className="text-lg font-bold">Resumo Anual por Tipo ({year})</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {Object.entries(totalByType).map(([type, total]) => (
            <li key={type}>
              • {type.charAt(0).toUpperCase() + type.slice(1)}: R${" "}
              {total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
