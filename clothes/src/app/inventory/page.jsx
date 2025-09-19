"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import InventoryForm from "../components/InventoryForm";

export default function InventoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inventory");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 🔍 Filtered data
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.inventory_id, r.change_type, r.quantity, r.product?.name || ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  // 📊 Summary calculation
  const summary = useMemo(() => {
    const added = rows
      .filter((r) => r.change_type.toLowerCase() === "added")
      .reduce((acc, r) => acc + r.quantity, 0);

    const removed = rows
      .filter((r) => r.change_type.toLowerCase() === "removed")
      .reduce((acc, r) => acc + r.quantity, 0);

    return { added, removed };
  }, [rows]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete inventory record ${row.inventory_id}?`)) return;
    await api.delete(`/inventory/${row.inventory_id}`);
    await fetchInventory();
  };

  const handleSubmit = async (values) => {
    if (editing) {
      await api.put(`/inventory/${editing.inventory_id}`, values);
    } else {
      await api.post("/inventory", values);
    }
    setFormOpen(false);
    setEditing(null);
    await fetchInventory();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Inventory</h1>
          <p className="text-sm text-gray-500">Track product stock changes</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search inventory…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            + Add Inventory
          </button>
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
          >
            View Summary
          </button>
        </div>
      </header>

      {/* Summary Modal */}
      {summaryOpen && (
        <div className="p-4 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Inventory Summary
          </h2>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-green-600">Added:</span>{" "}
            {summary.added} items
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-red-600">Removed:</span>{" "}
            {summary.removed} items
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading…</p>
      ) : filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.inventory_id}
              className="p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {r.product?.name || "Unknown Product"}
                </h2>
                <span className="text-xs text-gray-500">
                  #{r.inventory_id}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Change:</span>{" "}
                <span
                  className={
                    r.change_type.toLowerCase() === "added"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {r.change_type}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Quantity:</span> {r.quantity}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {new Date(r.date).toLocaleDateString()}
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
        <p className="text-center text-gray-400 py-10">No inventory records found</p>
      )}

      {/* Form Modal */}
      <InventoryForm
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
