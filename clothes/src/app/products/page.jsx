"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { HiOutlineDotsVertical } from "react-icons/hi";
import ProductForm from "../components/ProductForm";

// Reusable Action Menu
function ActionMenu({ row, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <HiOutlineDotsVertical className="h-5 w-5 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit(row);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete(row);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.product_id,
        r.name,
        r.description || "",
        r.size,
        r.color,
        r.price,
        r.stock,
        r.category?.name || "",
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
    if (!confirm(`Delete product ${row.product_id}?`)) return;
    await api.delete(`/products/${row.product_id}`);
    await fetchProducts();
  };

  const handleSubmit = async (values) => {
    if (editing) {
      await api.put(`/products/${editing.product_id}`, values);
    } else {
      await api.post("/products", values);
    }
    setFormOpen(false);
    setEditing(null);
    await fetchProducts();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search products…"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            + Add Product
          </button>
        </div>
      </header>

      {/* Product Cards */}
      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading…</p>
      ) : filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <div
              key={r.product_id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {r.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {r.category?.name || "Uncategorized"}
                  </p>
                </div>
                <ActionMenu
                  row={r}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>

              {/* Details */}
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">ID:</span> {r.product_id}
                </p>
                <p>
                  <span className="font-medium">Size:</span> {r.size}
                </p>
                <p>
                  <span className="font-medium">Color:</span> {r.color}
                </p>
                <p>
                  <span className="font-medium">Stock:</span> {r.stock}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹{r.price}
                </p>
                {r.description && (
                  <p className="text-gray-500 text-xs mt-2">
                    {r.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10">No products found</p>
      )}

      {/* Form Modal */}
      <ProductForm
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
