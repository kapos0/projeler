import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import BackButton from "../components/subComponents/BackButton"
import { useSnackbar } from "notistack"
import BarLoader from "react-spinners/BarLoader"

export default function CreateBook() {
    const [title, setTitle] = useState<string>("")
    const [author, setAuthor] = useState<string>("")
    const [publishYear, setPublishYear] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    function handleCreateBook() {
        const newBook = {
            title,
            author,
            publishYear,
        }
        setLoading(true)
        axios
            .post(`${import.meta.env.VITE_BASE_URL}`, newBook)
            .then(() => {
                setLoading(false)
                enqueueSnackbar("Book Created successfully", {
                    variant: "success",
                })
                navigate("/")
            })
            .catch((error) => {
                setLoading(false)
                enqueueSnackbar("Error", { variant: "error" })
                console.error(error)
            })
    }
    return (
        <div className="p-4">
            <BackButton />
            <h1 className="text-3xl my-4">Create Book</h1>
            {loading ? <BarLoader /> : ""}
            <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2  w-full "
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Publish Year
                    </label>
                    <input
                        type="number"
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2  w-full "
                    />
                </div>
                <button
                    className="p-2 bg-sky-300 m-8"
                    onClick={handleCreateBook}
                >
                    Save
                </button>
            </div>
        </div>
    )
}
