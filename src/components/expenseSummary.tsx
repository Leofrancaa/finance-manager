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

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const monthName = (monthNumber: number) => {
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
  };

  return (
    <div className="flex flex-col gap-4 max-h-[70vh] ">
      <div className=" p-4 bg-gray-100 rounded-md mt-4 max-h-[35vh] text-black overflow-y-auto border-2 border-gray-300">
        {/* Resumo Mensal */}
        <div>
          <h2 className="text-xl font-bold">
            Total de {monthName(month)}: R$ {totalMonthly.toFixed(2)}
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {filteredMonthly.map((exp) => (
              <li key={exp.id} className="flex items-center ">
                <span className="bg-black w-full h-full py-2 text-white px-4 rounded-l-md">
                  • {capitalize(exp.type)} –{" "}
                  {new Date(exp.date).toLocaleDateString()} – R${" "}
                  {exp.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="text-white px-4 py-2 rounded-r-md text-xs bg-red-600 cursor-pointer my-2 h-9 hover:bg-red-500 transition-colors duration-300"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumo Anual */}
      </div>
      <div className="p-4 bg-gray-100 rounded-md mt-4 text-black border-2 border-gray-300 max-h[35vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Resumo Anual por Tipo ({year})</h2>
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
      </div>
    </div>
  );
};
