import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// GET all returns
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const returns = await prisma.return.findMany({
      include: {
        product: true,
        sale: {
          include: {
            customer: true, // 👈 fetch customer info
          },
        },
      },
      orderBy: { date: "desc" },
    });
    res.json(returns);
  } catch (err) {
    console.error("Error fetching returns:", err);
    res.status(500).json({ error: "Failed to fetch returns" });
  }
});

// ----------------------------
// GET return by ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const r = await prisma.return.findUnique({
      where: { return_id: req.params.id },
      include: {
        product: true,
        sale: {
          include: {
            customer: true, // 👈 fetch customer info
          },
        },
      },
    });
    if (!r) return res.status(404).json({ error: "Return not found" });
    res.json(r);
  } catch (err) {
    console.error("Error fetching return:", err);
    res.status(500).json({ error: "Failed to fetch return" });
  }
});

// ----------------------------
// CREATE new return
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { return_id, sale_id, product_id, reason, date } = req.body;

    const newReturn = await prisma.return.create({
      data: {
        return_id,
        sale_id,
        product_id,
        reason,
        date: new Date(date),
      },
      include: {
        product: true,
        sale: {
          include: {
            customer: true,
          },
        },
      },
    });

    res.json(newReturn);
  } catch (err) {
    console.error("Error creating return:", err);
    res.status(500).json({ error: "Failed to create return" });
  }
});

// ----------------------------
// UPDATE return
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { sale_id, product_id, reason, date } = req.body;

    const updatedReturn = await prisma.return.update({
      where: { return_id: req.params.id },
      data: {
        sale_id,
        product_id,
        reason,
        date: new Date(date),
      },
      include: {
        product: true,
        sale: {
          include: {
            customer: true,
          },
        },
      },
    });

    res.json(updatedReturn);
  } catch (err) {
    console.error("Error updating return:", err);
    res.status(500).json({ error: "Failed to update return" });
  }
});

// ----------------------------
// DELETE return
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.return.delete({
      where: { return_id: req.params.id },
    });
    res.json({ message: "Return deleted" });
  } catch (err) {
    console.error("Error deleting return:", err);
    res.status(500).json({ error: "Failed to delete return" });
  }
});

export default router;
