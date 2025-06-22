import { BookType } from "../assets/Types"
import { useState, useEffect } from "react"
import { useParams } from "react-router"
import axios from "axios"
import BackButton from "../components/subComponents/BackButton"
import BarLoader from "react-spinners/BarLoader"
export default function ShowBook() {
    const { id } = useParams<string>()
    const [book, setBook] = useState<BookType>()
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        setLoading(true)
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/${id}`)
            .then((res) => {
                setBook(res.data.book)
                setLoading(false)
            })
            .catch((error) => console.error(error))
    }, [id])
    return (
        <div className="p-4">
            <BackButton />
            <h1 className="text-3xl my-4">Show Book</h1>
            {loading ? (
                <BarLoader />
            ) : (
                book && (
                    <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
                        <div className="my-4">
                            <span className="text-xl mr-4 text-gray-500">
                                Id
                            </span>
                            <span>{book._id}</span>
                        </div>
                        <div className="my-4">
                            <span className="text-xl mr-4 text-gray-500">
                                Title
                            </span>
                            <span>{book.title}</span>
                        </div>
                        <div className="my-4">
                            <span className="text-xl mr-4 text-gray-500">
                                Author
                            </span>
                            <span>{book.author}</span>
                        </div>
                        <div className="my-4">
                            <span className="text-xl mr-4 text-gray-500">
                                Publish Year
                            </span>
                            <span>{book.publishYear}</span>
                        </div>
                        <div className="my-4">
                            <span className="text-xl mr-4 text-gray-500">
                                Create Time
                            </span>
                            <span>{new Date(book.createdAt).toString()}</span>
                        </div>
                        <div className="my-4">
                            <span className="text-xl mr-4 text-gray-500">
                                Last Update Time
                            </span>
                            <span>{new Date(book.updatedAt).toString()}</span>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}
