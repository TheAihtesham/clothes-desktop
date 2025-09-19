"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ReturnForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    return_id: "",
    sale_id: "",
    product_id: "",
    reason: "",
    date: "",
  });

  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  // Reset values
  useEffect(() => {
    if (initial) {
      setValues({
        return_id: initial.return_id || "",
        sale_id: initial.sale_id || "",
        product_id: initial.product_id || "",
        reason: initial.reason || "",
        date: initial.date ? initial.date.split("T")[0] : "",
      });
    } else {
      setValues({
        return_id: "",
        sale_id: "",
        product_id: "",
        reason: "",
        date: "",
      });
    }
  }, [initial]);

  // Fetch sales & products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await api.get("/sales");
        setSales(s.data);
        const p = await api.get("/products");
        setProducts(p.data);
      } catch (err) {
        console.error("Failed to fetch sales/products", err);
      }
    };
    fetchData();
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
            {initial ? "Edit Return" : "Add Return"}
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
          {/* Return ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Return ID
            </label>
            <input
              type="text"
              name="return_id"
              value={values.return_id}
              onChange={handleChange}
              required
              disabled={!!initial}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          {/* Sale */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sale</label>
            <select
              name="sale_id"
              value={values.sale_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select Sale</option>
              {sales.map((s) => (
                <option key={s.sale_id} value={s.sale_id}>
                  {s.sale_id} - {s.customer?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              name="product_id"
              value={values.product_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              name="reason"
              value={values.reason}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
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
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              {initial ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
