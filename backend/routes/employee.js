// backend/routes/employees.js
import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { employee_id: "asc" },
    });
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// GET one employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { employee_id: req.params.id },
    });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// CREATE employee
router.post("/", async (req, res) => {
  try {
    const { employee_id, name, role, phone } = req.body;

    // basic validation
    if (!employee_id || !name || !role || !phone) {
      return res.status(400).json({ error: "employee_id, name, role and phone are required" });
    }

    const created = await prisma.employee.create({
      data: {
        employee_id,
        name,
        role,
        phone,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    // give useful error in logs and a safe message to client
    console.error("Error creating employee:", err.message || err, err);
    // if it's a known Prisma error you can surface it, otherwise generic
    res.status(500).json({ error: err.message || "Failed to create employee" });
  }
});

// UPDATE employee
router.put("/:id", async (req, res) => {
  try {
    const { name, role, phone } = req.body;

    if (!name || !role || !phone) {
      return res.status(400).json({ error: "name, role and phone are required" });
    }

    const updated = await prisma.employee.update({
      where: { employee_id: req.params.id },
      data: { name, role, phone },
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating employee:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(500).json({ error: err.message || "Failed to update employee" });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { employee_id: req.params.id },
    });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(500).json({ error: err.message || "Failed to delete employee" });
  }
});

export default router;
