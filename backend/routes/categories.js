import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { category_id: "asc" },
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { category_id: parseInt(req.params.id) },
    });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// CREATE new category
router.post("/", async (req, res) => {
  try {
    const { category_id, name, description } = req.body;
    const category = await prisma.category.create({
      data: { category_id, name, description },
    });
    res.json(category);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// UPDATE category
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.update({
      where: { category_id: parseInt(req.params.id) },
      data: { name, description },
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    await prisma.category.delete({ where: { category_id: parseInt(req.params.id) } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
