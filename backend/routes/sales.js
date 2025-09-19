import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// GET all sales
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        returns: true,
        serviceUsages: {
          include: { service: true, employee: true },
        },
      },
      orderBy: { date: "desc" },
    });
    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

// ----------------------------
// GET sale by ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { sale_id: req.params.id },
      include: {
        customer: true,
        returns: true,
        serviceUsages: {
          include: { service: true, employee: true },
        },
      },
    });
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json(sale);
  } catch (err) {
    console.error("Error fetching sale:", err);
    res.status(500).json({ error: "Failed to fetch sale" });
  }
});

// ----------------------------
// CREATE new sale
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { sale_id, customer_id, date, total_amount, payment_mode } = req.body;

    const sale = await prisma.sale.create({
      data: {
        sale_id,
        customer_id,
        date: new Date(date),
        total_amount,
        payment_mode,
      },
    });

    res.json(sale);
  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(500).json({ error: "Failed to create sale" });
  }
});

// ----------------------------
// UPDATE sale
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { customer_id, date, total_amount, payment_mode } = req.body;

    const sale = await prisma.sale.update({
      where: { sale_id: req.params.id },
      data: {
        customer_id,
        date: new Date(date),
        total_amount,
        payment_mode,
      },
    });

    res.json(sale);
  } catch (err) {
    console.error("Error updating sale:", err);
    res.status(500).json({ error: "Failed to update sale" });
  }
});

// ----------------------------
// DELETE sale
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.sale.delete({
      where: { sale_id: req.params.id },
    });
    res.json({ message: "Sale deleted" });
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(500).json({ error: "Failed to delete sale" });
  }
});

export default router;
