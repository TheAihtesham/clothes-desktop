import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// GET all suppliers
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { supplier_id: "asc" },
    });
    res.json(suppliers);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

// ----------------------------
// GET supplier by ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { supplier_id: req.params.id },
    });
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    console.error("Error fetching supplier:", err);
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
});

// ----------------------------
// CREATE new supplier
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { supplier_id, name, phone, email, address } = req.body;

    if (!supplier_id || !name || !phone || !address) {
      return res.status(400).json({ error: "supplier_id, name, phone, and address are required" });
    }

    const created = await prisma.supplier.create({
      data: {
        supplier_id,
        name,
        phone,
        email,
        address,
      },
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating supplier:", err);
    res.status(500).json({ error: err.message || "Failed to create supplier" });
  }
});

// ----------------------------
// UPDATE supplier
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ error: "name, phone, and address are required" });
    }

    const updated = await prisma.supplier.update({
      where: { supplier_id: req.params.id },
      data: { name, phone, email, address },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating supplier:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(500).json({ error: err.message || "Failed to update supplier" });
  }
});

// ----------------------------
// DELETE supplier
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.supplier.delete({
      where: { supplier_id: req.params.id },
    });
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(500).json({ error: err.message || "Failed to delete supplier" });
  }
});

export default router;
