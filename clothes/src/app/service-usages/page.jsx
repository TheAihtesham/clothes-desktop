"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import ServiceUsageForm from "../components/ServiceUsageForm";

export default function ServiceUsagesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/service-usages");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsages();
  }, []);

  // 🔍 Filter service usages
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.usage_id,
        r.service?.service_name || "",
        r.employee?.name || "",
        r.sale?.customer?.name || "",
        r.notes || "",
        r.service?.price || "",
      ]
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
    if (!confirm(`Delete usage ${row.usage_id}?`)) return;
    await api.delete(`/service-usages/${row.usage_id}`);
    await fetchUsages();
  };

  const handleSubmit = async (values) => {
    if (editing) {
      await api.put(`/service-usages/${editing.usage_id}`, values);
    } else {
      await api.post("/service-usages", values);
    }
    setFormOpen(false);
    setEditing(null);
    await fetchUsages();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Service Usages</h1>
          <p className="text-sm text-gray-500">
            Track service usage by employees and customers
          </p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search service usages…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            + Add Usage
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
              key={r.usage_id}
              className="p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Header with Service + Price */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {r.service?.service_name || "Unnamed Service"}
                </h2>
                <span className="text-xs text-gray-500">#{r.usage_id}</span>
              </div>

              {/* Price */}
              <p className="text-sm text-gray-800 font-medium mb-3">
                Price:{" "}
                <span className="text-green-600 font-semibold">
                  ₹{r.service?.price || "0"}
                </span>
              </p>

              {/* Details */}
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Employee:</span>{" "}
                {r.employee?.name || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Customer:</span>{" "}
                {r.sale?.customer?.name || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Notes:</span>{" "}
                {r.notes || "No notes"}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
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
        <p className="text-center text-gray-400 py-10">No usages found</p>
      )}

      {/* Form Modal */}
      <ServiceUsageForm
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
