import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// GET all services
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { service_name: "asc" },
    });
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// ----------------------------
// GET service by ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { service_id: req.params.id },
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// ----------------------------
// CREATE new service
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { service_id, service_name, description, price } = req.body;
    const service = await prisma.service.create({
      data: { service_id, service_name, description, price },
    });
    res.json(service);
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ error: "Failed to create service" });
  }
});

// ----------------------------
// UPDATE service
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { service_name, description, price } = req.body;
    const service = await prisma.service.update({
      where: { service_id: req.params.id },
      data: { service_name, description, price },
    });
    res.json(service);
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: "Failed to update service" });
  }
});

// ----------------------------
// DELETE service
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.service.delete({ where: { service_id: req.params.id } });
    res.json({ message: "Service deleted" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
