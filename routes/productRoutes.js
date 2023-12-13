const express = require("express");
const productController = require("../controllers/productController");
const verify = require("../middleware/verify");
const router = express.Router();

// Create a product
router.post("/", verify, productController.createProduct);

// Get all products
router.get("/", verify, productController.getAllProducts);

// Get a product by ID
router.get("/:productId", verify, productController.getProductById);

// Update a product by ID
router.put("/:productId", verify, productController.updateProduct);

// Delete a product by ID
router.delete("/:productId", verify, productController.deleteProduct);

router.get("/search/:value", verify, productController.searchProduct);

module.exports = router;
