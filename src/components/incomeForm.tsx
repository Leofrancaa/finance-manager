import React, { useState } from "react";
import { Income } from "@/app/interfaces/expense";

interface IncomeFormProps {
  onSubmit: (income: Omit<Income, "id">) => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    type: "",
    amount: "",
    date: "",
    note: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.type || !form.amount || !form.date || Number(form.amount) <= 0) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    onSubmit({
      type: form.type,
      amount: Number(form.amount),
      date: form.date,
      note: form.note,
    });
    setForm({ type: "", amount: "", date: "", note: "" });
  }

  return (
    <form
      className="flex flex-col gap-3 bg-white rounded p-4 border"
      onSubmit={handleSubmit}
    >
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      >
        <option value="">Tipo de receita</option>
        <option value="salário">Salário</option>
        <option value="freelance">Freelance</option>
        <option value="venda">Venda</option>
        <option value="reembolso">Reembolso</option>
        <option value="outros">Outros</option>
      </select>
      <input
        name="amount"
        type="number"
        min={0.01}
        step={0.01}
        value={form.amount}
        onChange={handleChange}
        placeholder="Valor"
        className="p-2 border rounded"
        required
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        name="note"
        type="text"
        value={form.note}
        onChange={handleChange}
        placeholder="Observação (opcional)"
        className="p-2 border rounded"
      />
      <button
        className="bg-blue-600 text-white font-bold py-2 rounded"
        type="submit"
      >
        Adicionar receita
      </button>
    </form>
  );
};
