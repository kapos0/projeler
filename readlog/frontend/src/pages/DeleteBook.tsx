import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import axios from "axios"
import BackButton from "../components/subComponents/BackButton"
import { useSnackbar } from "notistack"
import BarLoader from "react-spinners/BarLoader"

export default function DeleteBook() {
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState<boolean>(false)
    const { id } = useParams<string>()
    const navigate = useNavigate()
    function handleDelete() {
        setLoading(true)
        axios
            .delete(`${import.meta.env.VITE_BASE_URL}/${id}`)
            .then(() => {
                setLoading(false)
                enqueueSnackbar("Book Deleted successfully", {
                    variant: "success",
                })
                navigate("/")
            })
            .catch((error) => console.error(error))
    }
    return (
        <div className="p-4">
            <BackButton />
            <h1 className="text-3xl my-4">Delete Book</h1>
            {loading ? <BarLoader /> : ""}
            <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
                <h3 className="text-2xl">
                    Are You Sure You want to delete this book?
                </h3>

                <button
                    className="p-4 bg-red-600 text-white m-8 w-full"
                    onClick={handleDelete}
                >
                    Yes, Delete it
                </button>
            </div>
        </div>
    )
}
