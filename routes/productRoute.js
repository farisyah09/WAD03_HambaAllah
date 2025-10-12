const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const authMiddleware = require('../middleware/authMiddleware'); 

// POST /products/
router.post("/",authMiddleware.isSeller /<-- Middleware Otorisasi/, productController.createProduct);

// GET /products/
router.get("/", productController.getAllProducts);

// GET /products/:product_name
router.get("/:product_name", productController.getProductByName);

module.exports = router;