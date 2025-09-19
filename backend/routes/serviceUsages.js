import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// GET all service usages
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const usages = await prisma.serviceUsage.findMany({
      include: { sale: { include: { customer: true } }, service: true, employee: true },
      orderBy: { usage_id: "asc" },
    });
    res.json(usages);
  } catch (err) {
    console.error("Error fetching service usages:", err);
    res.status(500).json({ error: "Failed to fetch service usages" });
  }
});

// ----------------------------
// GET usage by ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const usage = await prisma.serviceUsage.findUnique({
      where: { usage_id: req.params.id },
      include: { sale: { include: { customer: true } }, service: true, employee: true },
    });
    if (!usage) return res.status(404).json({ error: "Service usage not found" });
    res.json(usage);
  } catch (err) {
    console.error("Error fetching service usage:", err);
    res.status(500).json({ error: "Failed to fetch service usage" });
  }
});

// ----------------------------
// CREATE service usage
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { usage_id, sale_id, service_id, employee_id, notes } = req.body;
    const usage = await prisma.serviceUsage.create({
      data: { usage_id, sale_id, service_id, employee_id, notes },
    });
    res.json(usage);
  } catch (err) {
    console.error("Error creating service usage:", err);
    res.status(500).json({ error: "Failed to create service usage" });
  }
});

// ----------------------------
// UPDATE service usage
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { sale_id, service_id, employee_id, notes } = req.body;
    const usage = await prisma.serviceUsage.update({
      where: { usage_id: req.params.id },
      data: { sale_id, service_id, employee_id, notes },
    });
    res.json(usage);
  } catch (err) {
    console.error("Error updating service usage:", err);
    res.status(500).json({ error: "Failed to update service usage" });
  }
});

// ----------------------------
// DELETE service usage
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.serviceUsage.delete({ where: { usage_id: req.params.id } });
    res.json({ message: "Service usage deleted" });
  } catch (err) {
    console.error("Error deleting service usage:", err);
    res.status(500).json({ error: "Failed to delete service usage" });
  }
});

export default router;
