"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import CategoryForm from "../components/CategoryForm";

export default function CategoriesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.category_id, r.name, r.description || ""]
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
    if (!confirm(`Delete category ${row.category_id}?`)) return;
    await api.delete(`/categories/${row.category_id}`);
    await fetchCategories();
  };

  const handleSubmit = async (values) => {
    if (editing) {
      await api.put(`/categories/${editing.category_id}`, values);
    } else {
      await api.post("/categories", values);
    }
    setFormOpen(false);
    setEditing(null);
    await fetchCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500">
            Organize your products into categories
          </p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search categories…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            + Add Category
          </button>
        </div>
      </header>

      {/* Card Grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading…</p>
      ) : filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.category_id}
              className="p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {r.name}
                </h2>
                <span className="text-xs text-gray-500">{r.category_id}</span>
              </div>
              <p className="text-sm text-gray-600">
                {r.description || "No description"}
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
        <p className="text-center text-gray-400 py-10">No categories found</p>
      )}

      {/* Form Modal */}
      <CategoryForm
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
