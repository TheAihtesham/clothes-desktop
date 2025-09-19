"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function PurchaseForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    purchase_id: "",
    supplier_id: "",
    date: "",
    total_amount: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  // Reset form when editing/creating
  useEffect(() => {
    if (initial) {
      setValues({
        purchase_id: initial.purchase_id || "",
        supplier_id: initial.supplier_id || "",
        date: initial.date ? initial.date.substring(0, 10) : "",
        total_amount: initial.total_amount || "",
      });
    } else {
      setValues({
        purchase_id: "",
        supplier_id: "",
        date: "",
        total_amount: "",
      });
    }
  }, [initial]);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        console.error("Failed to fetch suppliers", err);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {initial ? "Edit Purchase" : "Add Purchase"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Purchase ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchase ID
            </label>
            <input
              type="text"
              name="purchase_id"
              value={values.purchase_id}
              onChange={handleChange}
              required
              disabled={!!initial}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <select
              name="supplier_id"
              value={values.supplier_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplier_id} value={s.supplier_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="text"
              name="total_amount"
              value={values.total_amount}
              onChange={handleChange}
              required
              placeholder="e.g. 5000"
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              {initial ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
