"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import SupplierForm from "../components/SupplierForm";

export default function SuppliersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/suppliers");
      setRows(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.supplier_id, r.name, r.phone, r.email || "", r.address]
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
    if (!confirm(`Delete supplier ${row.supplier_id}?`)) return;
    try {
      await api.delete(`/suppliers/${encodeURIComponent(row.supplier_id)}`);
      await fetchSuppliers();
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await api.put(`/suppliers/${encodeURIComponent(editing.supplier_id)}`, values);
      } else {
        await api.post("/suppliers", values);
      }
      setFormOpen(false);
      setEditing(null);
      await fetchSuppliers();
    } catch (err) {
      console.error("Save failed", err);
      throw err;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏭 Suppliers</h1>
          <p className="text-sm text-gray-500">Manage supplier records</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search suppliers…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm hover:from-blue-700 hover:to-blue-600 shadow-md transition"
          >
            + Add Supplier
          </button>
        </div>
      </header>

      {/* Supplier Grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading…</p>
      ) : filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.supplier_id}
              className="p-6 bg-white border rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition transform duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">{r.name}</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                  {r.supplier_id}
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
        <p className="text-center text-gray-400 py-10">No suppliers found</p>
      )}

      {/* Form */}
      <SupplierForm
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
