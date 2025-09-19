"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import PurchaseForm from "../components/PurchaseForm";

export default function PurchasesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await api.get("/purchases");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.purchase_id, r.total_amount, r.supplier?.name || ""]
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
    if (!confirm(`Delete purchase ${row.purchase_id}?`)) return;
    await api.delete(`/purchases/${row.purchase_id}`);
    await fetchPurchases();
  };

  const handleSubmit = async (values) => {
    if (editing) {
      await api.put(`/purchases/${editing.purchase_id}`, values);
    } else {
      await api.post("/purchases", values);
    }
    setFormOpen(false);
    setEditing(null);
    await fetchPurchases();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Purchases</h1>
          <p className="text-sm text-gray-500">Manage supplier purchases</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search purchases…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            + Add Purchase
          </button>
        </div>
      </header>

      {/* Cards Grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading…</p>
      ) : filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.purchase_id}
              className="p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {r.supplier?.name || "Unknown Supplier"}
                </h2>
                <span className="text-xs text-gray-500">#{r.purchase_id}</span>
              </div>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {new Date(r.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Amount:</span> ₹{r.total_amount}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openEdit(r)}
                  className="flex-1 px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  className="flex-1 px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10">No purchases found</p>
      )}

      {/* Form Modal */}
      <PurchaseForm
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
