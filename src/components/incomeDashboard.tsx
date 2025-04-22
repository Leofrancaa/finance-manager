import { Income } from "@/app/interfaces/expense";

interface IncomeDashboardProps {
  incomes: Income[];
  year: number;
  month?: number;
}

export const IncomeDashboard: React.FC<IncomeDashboardProps> = ({
  incomes,
  year,
  month,
}) => {
  const filtered = incomes.filter((i) => {
    const d = new Date(i.date);
    return (
      d.getFullYear() === year &&
      (month === undefined || d.getMonth() === month)
    );
  });
  const total = filtered.reduce((acc, i) => acc + Number(i.amount), 0);

  return (
    <div className="p-4 bg-blue-50 border rounded my-6">
      <strong className="block text-blue-900 text-lg">
        Total de receitas: R$ {total.toFixed(2)}
      </strong>
      {filtered.length === 0 ? (
        <p className="text-gray-600 text-sm mt-2">
          Nenhuma receita cadastrada neste período.
        </p>
      ) : (
        <ul className="mt-2">
          {filtered.map((i) => (
            <li key={i.id}>
              {new Date(i.date).toLocaleDateString()} — {i.type}:{" "}
              <b>R$ {Number(i.amount).toFixed(2)}</b>
              {i.note && <span> ({i.note})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
