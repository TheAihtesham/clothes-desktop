"use client";

import { useEffect, useState } from "react";

export default function SupplierForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    supplier_id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setValues({
        supplier_id: initial.supplier_id ?? "",
        name: initial.name ?? "",
        phone: initial.phone ?? "",
        email: initial.email ?? "",
        address: initial.address ?? "",
      });
    } else {
      setValues({ supplier_id: "", name: "", phone: "", email: "", address: "" });
    }
    setError(null);
  }, [initial, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!values.supplier_id && !initial) {
      setError("Supplier ID is required");
      return;
    }
    if (!values.name || !values.phone || !values.address) {
      setError("Name, phone, and address are required");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {initial ? "Edit Supplier" : "Add Supplier"}
          </h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier ID</label>
            <input
              name="supplier_id"
              value={values.supplier_id}
              onChange={handleChange}
              required={!initial}
              disabled={!!initial}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              {initial ? "ID cannot be changed" : "Enter unique ID (e.g. SUP001)"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={values.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={values.address}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              {saving ? "Saving…" : initial ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
