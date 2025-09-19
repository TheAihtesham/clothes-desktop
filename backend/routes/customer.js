import { Router } from "express";
// import { PrismaClient } from "@prisma/client";
// // import { validateCustomer } from "../middleware/validateCustomer.js";

// const prisma = new PrismaClient();

import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = Router();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { name: "asc" } });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single customer by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({ where: { customer_id: id } });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create customer
router.post("/",async (req, res) => {
  try {
    const { customer_id, name, phone, email, address } = req.body;
    const newCustomer = await prisma.customer.create({
      data: { customer_id, name, phone, email, address },
    });
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer
router.put("/:id",async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    const updated = await prisma.customer.update({
      where: { customer_id: id },
      data: { name, phone, email, address },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { customer_id: id } });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

