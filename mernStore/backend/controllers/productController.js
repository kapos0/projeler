import { SAMPLE_PRODUCTS } from "../seeds/products.js";
import { connectDB } from "../lib/connectDB.js";
import Product from "../models/productModel.js";

export async function getProductById(req, res) {
    const { id } = req.params;
    if (!id)
        return res
            .status(400)
            .json({ success: false, message: "Please provide a product id" });
    try {
        await connectDB();
        const product = await Product.findById(id);
        if (!product)
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Try again later" });
    }
}

export async function getAllProducts(req, res) {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json({ succes: true, data: products });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Try again later" });
    }
}

export async function updateProductById(req, res) {
    const { id } = req.params;
    const { name, price, description, image } = req.body;
    if (!id)
        return res
            .status(400)
            .json({ success: false, message: "Please provide a product id" });
    if (!name || !price || !description || !image)
        return res
            .status(400)
            .json({ success: false, message: "Please fill in, all fields." });
    try {
        await connectDB();
        const product = await Product.findByIdAndUpdate(
            id,
            { name, price, description, image },
            { new: true } //Return the updated product
        );
        if (!product)
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Try again later" });
    }
}

export async function createProduct(req, res) {
    const { name, price, description, image } = req.body;
    try {
        await connectDB();
        if (!name || !price || !description || !image)
            return res.status(400).json({
                success: false,
                message: "Please fill in, all fields.",
            });
        const newProduct = await Product.create({
            name,
            price,
            description,
            image,
        });
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Try again later" });
    }
}

export async function deleteProductById(req, res) {
    const { id } = req.params;
    if (!id)
        return res
            .status(400)
            .json({ success: false, message: "Please provide a product id" });
    try {
        await connectDB();
        const product = await Product.findByIdAndDelete(id);
        if (!product)
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Server error. Try again later" });
    }
}

export async function seedTheDatabase(req, res) {
    try {
        await connectDB();
        await Product.deleteMany({});
        await Product.insertMany(SAMPLE_PRODUCTS);
        console.log("Database seeded successfully");
        return res
            .status(201)
            .json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
        console.error("Error seeding database:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error seeding database:" });
    }
}
