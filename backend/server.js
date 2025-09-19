import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.js";
import customersRouter from "./routes/customer.js";
import productRouter from "./routes/products.js";
import categoryRouter from "./routes/categories.js"
import employeeRoutes from "./routes/employee.js";
import supplierRoutes from "./routes/suppliers.js";
import purchaseRouter from "./routes/purchases.js";
import salesRouter from "./routes/sales.js";
import returnRouter from "./routes/returns.js";
import inventoryRouter from "./routes/inventory.js";
import servicesRouter from "./routes/services.js";
import serviceUsageRouter from "./routes/serviceUsages.js"

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/dashboard", dashboardRoutes);
app.use("/customers", customersRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/employees", employeeRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/purchases", purchaseRouter);
app.use("/sales", salesRouter);
app.use("/returns", returnRouter);
app.use("/inventory", inventoryRouter);
app.use("/services", servicesRouter);
app.use("/service-usages", serviceUsageRouter);


app.get("/", (req, res) => {
  res.send("Clothes Management API running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
