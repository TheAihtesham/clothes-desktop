import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// Get dashboard stats
// ----------------------------
router.get("/stats", async (req, res) => {
  try {
    // Fetch all sales and purchases
    const sales = await prisma.sale.findMany({ select: { total_amount: true } });
    const purchases = await prisma.purchase.findMany({ select: { total_amount: true } });

    // Manual sum because total_amount is String
    const totalSales = sales.reduce(
      (sum, s) => sum + parseFloat(s.total_amount || 0),
      0
    );
    const totalPurchases = purchases.reduce(
      (sum, p) => sum + parseFloat(p.total_amount || 0),
      0
    );

    // Counts
    const customers = await prisma.customer.count();
    const products = await prisma.product.count();

    res.json({
      totalSales,
      totalPurchases,
      customers,
      products,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ----------------------------
// Sales by month (for chart)
// ----------------------------
router.get("/sales-by-month", async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      select: { date: true, total_amount: true },
    });

    const monthly = {};
    sales.forEach((s) => {
      const month = new Date(s.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthly[month] = (monthly[month] || 0) + parseFloat(s.total_amount || 0);
    });

    res.json(monthly);
  } catch (err) {
    console.error("Error fetching sales by month:", err);
    res.status(500).json({ error: "Failed to fetch sales by month" });
  }
});

// ----------------------------
// Recent sales
// ----------------------------
router.get("/recent-sales", async (req, res) => {
  try {
    const recent = await prisma.sale.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: { customer: true },
    });

    // Ensure total_amount is number
    const cleaned = recent.map((s) => ({
      ...s,
      total_amount: parseFloat(s.total_amount || 0),
    }));

    res.json(cleaned);
  } catch (err) {
    console.error("Error fetching recent sales:", err);
    res.status(500).json({ error: "Failed to fetch recent sales" });
  }
});

export default router;
