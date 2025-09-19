"use client";
import { useEffect, useState } from "react";

export default function CustomerForm({ open, initial, onClose, onSubmit }) {
  const [values, setValues] = useState({
    customer_id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setValues({
        customer_id: initial.customer_id || "",
        name: initial.name || "",
        phone: initial.phone || "",
        email: initial.email || "",
        address: initial.address || "",
      });
    } else {
      setValues({ customer_id: "", name: "", phone: "", email: "", address: "" });
    }
  }, [initial, open]);

  if (!open) return null;

  const setField = (k, v) => setValues((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {initial ? "Edit Customer" : "Add Customer"}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Customer ID"
            value={values.customer_id}
            onChange={(v) => setField("customer_id", v)}
            required
            readOnly={!!initial}
          />
          <Field
            label="Name"
            value={values.name}
            onChange={(v) => setField("name", v)}
            required
          />
          <Field
            label="Phone"
            value={values.phone}
            onChange={(v) => setField("phone", v)}
            required
          />
          <Field
            label="Email"
            value={values.email}
            onChange={(v) => setField("email", v)}
          />
          <Field
            label="Address"
            value={values.address}
            onChange={(v) => setField("address", v)}
            required
            full
          />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, readOnly, full }) {
  return (
    <label className={`space-y-1 ${full ? "md:col-span-2" : ""}`}>
      <span className="block text-sm font-medium">{label}</span>
      <input
        className="w-full px-3 py-2 border rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        readOnly={readOnly}
      />
    </label>
  );
}
