import express from "express";
import {
    createProduct,
    getAllProducts,
    updateProductById,
    deleteProductById,
    seedTheDatabase,
    getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/seedthedatabase", seedTheDatabase);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProductById);
router.post("/", createProduct);
router.delete("/:id", deleteProductById);

export default router;
