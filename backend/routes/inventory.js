// backend/routes/inventory.js
import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// GET all inventory entries
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({
      include: { product: true },
      orderBy: { date: "desc" },
    });
    res.json(items);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// ----------------------------
// GET inventory by ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.inventory.findUnique({
      where: { inventory_id: req.params.id },
      include: { product: true },
    });
    if (!item) return res.status(404).json({ error: "Inventory record not found" });
    res.json(item);
  } catch (err) {
    console.error("Error fetching inventory item:", err);
    res.status(500).json({ error: "Failed to fetch inventory item" });
  }
});

// ----------------------------
// CREATE new inventory record
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { inventory_id, product_id, change_type, quantity, date } = req.body;

    // Basic validation
    if (!inventory_id || !product_id || !change_type || !quantity || !date) {
      return res.status(400).json({ error: "inventory_id, product_id, change_type, quantity and date are required" });
    }

    // Optional: verify product exists (gives nicer error than FK constraint)
    const productExists = await prisma.product.findUnique({ where: { product_id } });
    if (!productExists) {
      return res.status(400).json({ error: `Product not found: ${product_id}` });
    }

    const created = await prisma.inventory.create({
      data: {
        inventory_id,
        product_id,
        change_type,
        quantity,
        date: new Date(date),
      },
      include: { product: true },
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating inventory record:", err);
    // surface Prisma message in dev; keep generic in production if needed
    res.status(500).json({ error: err.message || "Failed to create inventory record" });
  }
});

// ----------------------------
// UPDATE inventory record
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { product_id, change_type, quantity, date } = req.body;

    if (!product_id || !change_type || !quantity || !date) {
      return res.status(400).json({ error: "product_id, change_type, quantity and date are required" });
    }

    // Optional: verify product exists
    const productExists = await prisma.product.findUnique({ where: { product_id } });
    if (!productExists) {
      return res.status(400).json({ error: `Product not found: ${product_id}` });
    }

    const updated = await prisma.inventory.update({
      where: { inventory_id: req.params.id },
      data: {
        product_id,
        change_type,
        quantity,
        date: new Date(date),
      },
      include: { product: true },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating inventory record:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Inventory record not found" });
    }
    res.status(500).json({ error: err.message || "Failed to update inventory record" });
  }
});

// ----------------------------
// DELETE inventory record
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.inventory.delete({
      where: { inventory_id: req.params.id },
    });
    res.json({ message: "Inventory record deleted" });
  } catch (err) {
    console.error("Error deleting inventory record:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Inventory record not found" });
    }
    res.status(500).json({ error: err.message || "Failed to delete inventory record" });
  }
});

export default router;
