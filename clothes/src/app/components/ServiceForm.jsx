"use client";

import { useEffect, useState } from "react";


export default function ServiceForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    service_id: "",
    service_name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (initial) {
      setValues({
        service_id: initial.service_id || "",
        service_name: initial.service_name || "",
        description: initial.description || "",
        price: initial.price || "",
      });
    } else {
      setValues({
        service_id: "",
        service_name: "",
        description: "",
        price: "",
      });
    }
  }, [initial]);

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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {initial ? "Edit Service" : "Add Service"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Service ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service ID</label>
            <input
              type="text"
              name="service_id"
              value={values.service_id}
              onChange={handleChange}
              required
              disabled={!!initial}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
              type="text"
              name="service_name"
              value={values.service_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              name="price"
              value={values.price}
              onChange={handleChange}
              required
              placeholder="e.g. 500"
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
