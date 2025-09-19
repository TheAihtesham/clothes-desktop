"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import ServiceForm from "../components/ServiceForm";

export default function ServicesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔍 Filter services
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.service_id, r.service_name, r.description || "", r.price]
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
    if (!confirm(`Delete service ${row.service_id}?`)) return;
    await api.delete(`/services/${row.service_id}`);
    await fetchServices();
  };

  const handleSubmit = async (values) => {
    if (editing) {
      await api.put(`/services/${editing.service_id}`, values);
    } else {
      await api.post("/services", values);
    }
    setFormOpen(false);
    setEditing(null);
    await fetchServices();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Services</h1>
          <p className="text-sm text-gray-500">Manage available services</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search services…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            + Add Service
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
              key={r.service_id}
              className="p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {r.service_name}
                </h2>
                <span className="text-xs text-gray-500">#{r.service_id}</span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                {r.description || "No description"}
              </p>

              <p className="text-sm text-gray-700 font-medium mb-3">
                Price: ₹{r.price}
              </p>

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
        <p className="text-center text-gray-400 py-10">No services found</p>
      )}

      {/* Form Modal */}
      <ServiceForm
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
