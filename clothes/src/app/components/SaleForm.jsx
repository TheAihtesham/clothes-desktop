"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function SaleForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    sale_id: "",
    customer_id: "",
    date: "",
    total_amount: "",
    payment_mode: "",
  });

  const [customers, setCustomers] = useState([]);

  // Reset form when editing/creating
  useEffect(() => {
    if (initial) {
      setValues({
        sale_id: initial.sale_id || "",
        customer_id: initial.customer_id || "",
        date: initial.date ? initial.date.split("T")[0] : "",
        total_amount: initial.total_amount || "",
        payment_mode: initial.payment_mode || "",
      });
    } else {
      setValues({
        sale_id: "",
        customer_id: "",
        date: "",
        total_amount: "",
        payment_mode: "",
      });
    }
  }, [initial]);

  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };
    fetchCustomers();
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
            {initial ? "Edit Sale" : "Add Sale"}
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
          {/* Sale ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sale ID
            </label>
            <input
              type="text"
              name="sale_id"
              value={values.sale_id}
              onChange={handleChange}
              required
              disabled={!!initial}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
              name="customer_id"
              value={values.customer_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              placeholder="e.g. 1200"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Mode
            </label>
            <select
              name="payment_mode"
              value={values.payment_mode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select payment mode</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="NetBanking">NetBanking</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
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
