"use client";
import React, { useState } from "react";

interface ExpenseFormProps {
  onSubmit: (data: {
    type: string;
    day: string;
    amount: string;
    paymentMethod: string;
    installments: string;
  }) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: "",
    day: "",
    amount: "",
    paymentMethod: "",
    installments: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      type: "",
      day: "",
      amount: "",
      paymentMethod: "",
      installments: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      {/* Select padronizado para tipo de gasto */}
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-white text-black cursor-pointer"
        required
      >
        <option className="cursor-pointer" value="">
          Tipo de gasto
        </option>
        <option className="cursor-pointer" value="alimentacao">
          Alimentação
        </option>
        <option className="cursor-pointer" value="transporte">
          Transporte
        </option>
        <option className="cursor-pointer" value="moradia">
          Moradia
        </option>
        <option className="cursor-pointer" value="lazer">
          Lazer
        </option>
        <option className="cursor-pointer" value="educacao">
          Educação
        </option>
        <option className="cursor-pointer" value="saude">
          Saúde
        </option>
        <option className="cursor-pointer" value="outros">
          Outros
        </option>
      </select>

      <input
        name="day"
        type="number"
        value={formData.day}
        onChange={handleChange}
        placeholder="Dia do gasto (1-31)"
        className="w-full p-2 border rounded bg-white text-black placeholder-black"
        min={1}
        max={31}
        required
      />

      <input
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Valor"
        className="w-full p-2 border rounded bg-white text-black placeholder-black"
        required
      />

      <select
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-white text-black cursor-pointer"
        required
      >
        <option value="">Forma de pagamento</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="cartao">Cartão</option>
        <option value="pix">Pix</option>
      </select>

      {formData.paymentMethod === "cartao" && (
        <input
          name="installments"
          type="number"
          value={formData.installments}
          onChange={handleChange}
          placeholder="Parcelas"
          className="w-full p-2 border rounded"
        />
      )}

      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition duration-200"
      >
        Adicionar gasto
      </button>
    </form>
  );
};
