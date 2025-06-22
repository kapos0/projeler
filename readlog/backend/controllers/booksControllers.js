import { BookModel } from "../models/bookModel.js"

export async function getABook(req, res) {
    try {
        const { id } = req.params

        const book = await BookModel.findById(id)

        return res.status(200).json({ book })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function getAllBooks(req, res) {
    try {
        const books = await BookModel.find()

        return res.status(200).json({
            count: books.length,
            books: books,
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function addNewBook(req, res) {
    try {
        console.log(req.body)
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).json({
                message: "Send all required fields: title, author, publishYear",
            })
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        }

        const book = await BookModel.create(newBook)

        return res.status(201).json({ book })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function updateBook(req, res) {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).json({
                message: "Send all required fields: title, author, publishYear",
            })
        }

        const { id } = req.params

        const result = await BookModel.findByIdAndUpdate(id, req.body)

        if (!result) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(200).json({ message: "Book updated successfully" })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function deleteBook(req, res) {
    try {
        const { id } = req.params

        const result = await BookModel.findByIdAndDelete(id)

        if (!result) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(200).json({ message: "Book deleted successfully" })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}
