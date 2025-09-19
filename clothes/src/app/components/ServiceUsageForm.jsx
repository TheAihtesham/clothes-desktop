"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ServiceUsageForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    usage_id: "",
    sale_id: "",
    service_id: "",
    employee_id: "",
    notes: "",
  });

  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (initial) {
      setValues({
        usage_id: initial.usage_id || "",
        sale_id: initial.sale_id || "",
        service_id: initial.service_id || "",
        employee_id: initial.employee_id || "",
        notes: initial.notes || "",
      });
    } else {
      setValues({
        usage_id: "",
        sale_id: "",
        service_id: "",
        employee_id: "",
        notes: "",
      });
    }
  }, [initial]);

  // Fetch related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, employeesRes, salesRes] = await Promise.all([
          api.get("/services"),
          api.get("/employees"),
          api.get("/sales"),
        ]);
        setServices(servicesRes.data);
        setEmployees(employeesRes.data);
        setSales(salesRes.data);
      } catch (err) {
        console.error("Failed to fetch related data", err);
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
            {initial ? "Edit Service Usage" : "Add Service Usage"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Usage ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Usage ID</label>
            <input
              type="text"
              name="usage_id"
              value={values.usage_id}
              onChange={handleChange}
              required
              disabled={!!initial}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a sale</option>
              {sales.map((s) => (
                <option key={s.sale_id} value={s.sale_id}>
                  {s.sale_id} — {s.customer?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <select
              name="service_id"
              value={values.service_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.service_name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              name="employee_id"
              value={values.employee_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an employee</option>
              {employees.map((e) => (
                <option key={e.employee_id} value={e.employee_id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows={2}
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
