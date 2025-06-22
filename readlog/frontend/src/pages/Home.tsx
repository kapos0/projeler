import { BookType } from "../assets/Types"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"

import BookTable from "../components/BookTable"
import BooksCard from "../components/BooksCard"

import BarLoader from "react-spinners/BarLoader"
import { BsPlusCircle } from "react-icons/bs"

export default function Home() {
    const [books, setBooks] = useState<BookType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [showType, setShowType] = useState<"table" | "card">("table")
    useEffect(() => {
        setLoading(true)
        axios
            .get(`${import.meta.env.VITE_BASE_URL}`)
            .then((res) => {
                setBooks(res.data.books)
                setLoading(false)
            })
            .catch((err) => console.error(err))
    }, [])
    return (
        <main className="p-4">
            <div className="flex justify-center items-center gap-x-4">
                <button
                    className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
                    onClick={() => setShowType("table")}
                >
                    Table
                </button>
                <button
                    className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
                    onClick={() => setShowType("card")}
                >
                    Card
                </button>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl my-8">Book List</h1>
                <Link to="/books/create">
                    <BsPlusCircle className="text-sky-800 text-4xl" />
                </Link>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <BarLoader />
                </div>
            ) : showType === "table" ? (
                <BookTable books={books} />
            ) : (
                <BooksCard books={books} />
            )}
        </main>
    )
}
