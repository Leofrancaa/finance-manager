import React, { useState } from "react";
import { AddExpenseData } from "@/app/interfaces/expense";

interface ExpenseFormData {
  type: string;
  day: string;
  amount: string;
  note: string;
  fixed?: boolean;
  paymentMethod?: string;
  installments?: string;
}

interface ExpenseFormProps {
  onSubmit: (data: AddExpenseData) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    type: "",
    day: "",
    amount: "",
    note: "",
    fixed: false,
    paymentMethod: "",
    installments: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !formData.type ||
      !formData.day ||
      !formData.amount ||
      Number(formData.day) < 1 ||
      Number(formData.day) > 31 ||
      Number(formData.amount) <= 0 ||
      !formData.paymentMethod
    ) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
    if (
      formData.paymentMethod === "cartão de crédito" &&
      (!formData.installments ||
        isNaN(Number(formData.installments)) ||
        Number(formData.installments) < 1)
    ) {
      alert("Preencha um número válido de parcelas.");
      return;
    }
    onSubmit({
      ...formData,
      paymentMethod: formData.paymentMethod || "",
      installments: formData.installments || undefined,
    });
    setFormData({
      type: "",
      day: "",
      amount: "",
      paymentMethod: "",
      installments: "",
      note: "",
      fixed: false,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-md flex flex-col gap-4 border mt-2"
    >
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Tipo de gasto</option>
        <option value="alimentação">Alimentação</option>
        <option value="educação">Educação</option>
        <option value="lazer">Lazer</option>
        <option value="assinatura">Assinatura</option>
        <option value="moradia">Moradia</option>
        <option value="transporte">Transporte</option>
        <option value="outros">Outros</option>
      </select>
      <input
        name="day"
        type="number"
        min={1}
        max={31}
        value={formData.day}
        onChange={handleChange}
        placeholder="Dia do mês"
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="amount"
        type="number"
        min={0.01}
        step={0.01}
        value={formData.amount}
        onChange={handleChange}
        placeholder="Valor"
        required
        className="w-full p-2 border rounded"
      />
      <select
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Forma de pagamento</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="cartão de débito">Cartão de Débito</option>
        <option value="cartão de crédito">Cartão de Crédito</option>
        <option value="pix">Pix</option>
        <option value="boleto">Boleto</option>
        <option value="transferência">Transferência</option>
        <option value="outro">Outro</option>
      </select>
      {/* Campo de parcelas: só se for cartão de crédito */}
      {formData.paymentMethod === "cartão de crédito" && (
        <input
          name="installments"
          type="number"
          min={1}
          step={1}
          value={formData.installments || ""}
          onChange={handleChange}
          placeholder="Parcelas"
          required
          className="w-full p-2 border rounded"
        />
      )}
      <input
        name="note"
        value={formData.note}
        onChange={handleChange}
        placeholder="Observação (opcional)"
        className="w-full p-2 border rounded"
      />
      <label className="flex gap-2 items-center mt-2">
        <input
          type="checkbox"
          name="fixed"
          checked={!!formData.fixed}
          onChange={handleChange}
          className="accent-blue-500"
        />
        Gasto recorrente (fixo)
      </label>
      <button className="w-full py-2 bg-green-600 text-white font-bold rounded cursor-pointer hover:bg-green-700 transition duration-200">
        Adicionar
      </button>
    </form>
  );
};
