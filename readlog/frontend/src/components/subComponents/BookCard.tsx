import { BookType } from "../../assets/Types"
import { useState } from "react"
import { Link } from "react-router"
import BookModal from "./BookModal"
import {
    BsBook,
    BsPersonCircle,
    BsInfoCircle,
    BsEye,
    BsTrash2,
    BsPencilSquare,
} from "react-icons/bs"

export default function BookCard({ book }: { book: BookType }) {
    const [showModal, setShowModal] = useState<boolean>(false)
    return (
        <div className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl">
            <h2 className="absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg">
                {book.publishYear}
            </h2>
            <h4 className="my-2 text-gray-500">{book._id}</h4>
            <div className="flex justify-start items-center gap-x-2">
                <BsBook className="text-red-300 text-2xl" />
                <h2 className="my-1">{book.title}</h2>
            </div>
            <div className="flex justify-start items-center gap-x-2">
                <BsPersonCircle className="text-red-300 text-2xl" />
                <h2 className="my-1">{book.author}</h2>
            </div>
            <div className="flex justify-between items-center gap-x-2 mt-4 p-4">
                <BsEye
                    className="text-3xl text-blue-800 hover:text-black cursor-pointer"
                    onClick={() => setShowModal(true)}
                />
                <Link to={`/books/details/${book._id}`}>
                    <BsInfoCircle className="text-2xl text-green-800 hover:text-black" />
                </Link>
                <Link to={`/books/edit/${book._id}`}>
                    <BsPencilSquare className="text-2xl text-yellow-600 hover:text-black" />
                </Link>
                <Link to={`/books/delete/${book._id}`}>
                    <BsTrash2 className="text-2xl text-red-600 hover:text-black" />
                </Link>
            </div>
            {showModal && (
                <BookModal
                    book={book}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
