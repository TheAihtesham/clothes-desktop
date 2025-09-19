"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function InventoryForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    inventory_id: "",
    product_id: "",
    change_type: "",
    quantity: "",
    date: "",
  });

  const [products, setProducts] = useState([]);

  // Reset form
  useEffect(() => {
    if (initial) {
      setValues({
        inventory_id: initial.inventory_id || "",
        product_id: initial.product_id || "",
        change_type: initial.change_type || "",
        quantity: initial.quantity || "",
        date: initial.date ? new Date(initial.date).toISOString().split("T")[0] : "",
      });
    } else {
      setValues({
        inventory_id: "",
        product_id: "",
        change_type: "",
        quantity: "",
        date: "",
      });
    }
  }, [initial]);

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
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
            {initial ? "Edit Inventory" : "Add Inventory"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Inventory ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Inventory ID</label>
            <input
              type="text"
              name="inventory_id"
              value={values.inventory_id}
              onChange={handleChange}
              required
              disabled={!!initial}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
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
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Change Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Change Type</label>
            <input
              type="text"
              name="change_type"
              value={values.change_type}
              onChange={handleChange}
              placeholder="Added / Removed"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
              required
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
