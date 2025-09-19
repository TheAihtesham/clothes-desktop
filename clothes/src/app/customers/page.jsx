"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import CustomerForm from "../components/CustomerForm";

export default function CustomersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customers");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.customer_id, r.name, r.phone, r.email || "", r.address]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete customer ${row.customer_id}?`)) return;
    await api.delete(`/customers/${encodeURIComponent(row.customer_id)}`);
    await fetchCustomers();
  };

  const handleSubmit = async (values) => {
    if (editing) {
      await api.put(`/customers/${encodeURIComponent(editing.customer_id)}`, values);
    } else {
      await api.post("/customers", values);
    }
    setFormOpen(false);
    setEditing(null);
    await fetchCustomers();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👥 Customers</h1>
          <p className="text-sm text-gray-500">Manage all customer records</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search customers…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm hover:from-blue-700 hover:to-blue-600 shadow-md transition"
          >
            + Add Customer
          </button>
        </div>
      </header>

      {/* Customer Grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading…</p>
      ) : filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.customer_id}
              className="p-6 bg-gradient-to-br from-white to-gray-50 border rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition transform duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">{r.name}</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                  {r.customer_id}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                 <span className="font-medium">{r.phone}</span>
              </p>
              <p className="text-sm text-gray-700">
                 {r.email || "-"}
              </p>
              <p className="text-sm text-gray-700">
                 {r.address}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => openEdit(r)}
                  className="flex-1 px-3 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  className="flex-1 px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 shadow-sm text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10">No customers found</p>
      )}

      {/* Form Modal */}
      <CustomerForm
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
