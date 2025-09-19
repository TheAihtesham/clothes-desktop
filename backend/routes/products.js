import express from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// ----------------------------
// GET all products
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { product_id: "asc" },
    });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ----------------------------
// GET product by ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { product_id: req.params.id }, // 👈 keep as string
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ----------------------------
// CREATE new product
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { product_id, name, size, color, price, stock, category_id } = req.body;

    const product = await prisma.product.create({
      data: {
        product_id, // must be provided (String primary key)
        name,
        size,
        color,
        price,       // keep as String
        stock,       // keep as String
        category_id, // String
      },
    });

    res.json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ----------------------------
// UPDATE product
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const { name, size, color, price, stock, category_id } = req.body;

    const product = await prisma.product.update({
      where: { product_id: req.params.id }, // 👈 String id
      data: {
        name,
        size,
        color,
        price,       // String
        stock,       // String
        category_id, // String
      },
    });

    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ----------------------------
// DELETE product
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { product_id: req.params.id }, // 👈 String id
    });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
