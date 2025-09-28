const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

// POST /products/
router.post("/", productController.createProduct);

// GET /products/
router.get("/", productController.getAllProducts);

// GET /products/:product_name
router.get("/:product_name", productController.getProductByName);

module.exports = router;
