interface Expense {
  id: string;
  date: string;
  amount: number;
  type: string;
  note?: string;
}

interface ExpenseSummaryProps {
  expenses: Expense[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
}

// Função que gera os gastos fixos para o mês selecionado

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  expenses,
  year,
  month,
  onDelete,
}) => {
  const ALERT_THRESHOLDS: Record<string, number> = {
    alimentação: 500,
    transporte: 300,
    lazer: 200,
  };

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

  // ⚠️ Verificação de alertas por tipo
  const alerts: string[] = [];

  Object.entries(ALERT_THRESHOLDS).forEach(([type, threshold]) => {
    const totalThisMonth = filteredMonthly
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);

    if (totalThisMonth >= threshold * 0.9) {
      alerts.push(type);
    }
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
    <div className="flex flex-col gap-4">
      <div className="bg-white border-2 border-black p-4 rounded-md mt-4 text-black max-h-[50vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">
          Total de {monthName(month)}: R$ {totalMonthly.toFixed(2)}
        </h2>

        {alerts.length > 0 && (
          <div className="p-3 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 rounded-md mb-4">
            <p className="font-semibold">Atenção!</p>
            <ul className="list-disc list-inside">
              {alerts.map((type) => (
                <li key={type}>
                  Gasto com <strong>{type}</strong> está próximo ou acima do
                  limite de R$ {ALERT_THRESHOLDS[type].toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredMonthly.some((exp) => exp.note) && (
          <div>
            <ul className="space-y-2 text-sm">
              {filteredMonthly
                .filter((exp) => exp.note)
                .map((exp) => (
                  <li
                    key={exp.id}
                    className="bg-black rounded-md text-white p-3 shadow-lg border-l-4 border-black flex items-center justify-between"
                  >
                    <div>
                      <span className="bg-black w-full h-full py-2 text-white rounded-l-md">
                        • {capitalize(exp.type)} –{" "}
                        {new Date(exp.date).toLocaleDateString()} – R${" "}
                        {exp.amount.toFixed(2)}
                      </span>
                      <span className="block mt-1">{exp.note}</span>
                    </div>
                    <button
                      onClick={() => onDelete(exp.id)}
                      className="text-white px-4 py-2 rounded-md text-xs bg-red-600 cursor-pointer my-2 h-9 hover:bg-red-500 transition-colors duration-300"
                    >
                      Remover
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 bg-white rounded-md mt-4 text-black border-2 border-black max-h[50vh] overflow-y-auto">
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
