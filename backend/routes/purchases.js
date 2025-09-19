import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// -----------------------------
// GET all purchases
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { supplier: true },
      orderBy: { date: "desc" },
    });
    res.json(purchases);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// -----------------------------
// GET purchase by ID
// -----------------------------
router.get("/:id", async (req, res) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { purchase_id: req.params.id }, // String PK
      include: { supplier: true },
    });
    if (!purchase) return res.status(404).json({ error: "Purchase not found" });
    res.json(purchase);
  } catch (err) {
    console.error("Error fetching purchase:", err);
    res.status(500).json({ error: "Failed to fetch purchase" });
  }
});

// -----------------------------
// CREATE new purchase
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const { purchase_id, supplier_id, date, total_amount } = req.body;

    const purchase = await prisma.purchase.create({
      data: {
        purchase_id,
        supplier_id,
        date: new Date(date),   // expects ISO string
        total_amount,
      },
    });

    res.json(purchase);
  } catch (err) {
    console.error("Error creating purchase:", err);
    res.status(500).json({ error: "Failed to create purchase" });
  }
});

// -----------------------------
// UPDATE purchase
// -----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { supplier_id, date, total_amount } = req.body;

    const purchase = await prisma.purchase.update({
      where: { purchase_id: req.params.id },
      data: {
        supplier_id,
        date: new Date(date),
        total_amount,
      },
    });

    res.json(purchase);
  } catch (err) {
    console.error("Error updating purchase:", err);
    res.status(500).json({ error: "Failed to update purchase" });
  }
});

// -----------------------------
// DELETE purchase
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.purchase.delete({
      where: { purchase_id: req.params.id },
    });
    res.json({ message: "Purchase deleted" });
  } catch (err) {
    console.error("Error deleting purchase:", err);
    res.status(500).json({ error: "Failed to delete purchase" });
  }
});

export default router;
