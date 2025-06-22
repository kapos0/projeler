import express from "express"
import {
    getAllBooks,
    getABook,
    addNewBook,
    updateBook,
    deleteBook,
} from "../controllers/booksControllers.js"

const router = express.Router()

router.get("/", getAllBooks)
router.get("/:id", getABook)
router.post("/", addNewBook)
router.put("/:id", updateBook)
router.delete("/:id", deleteBook)

export default router
