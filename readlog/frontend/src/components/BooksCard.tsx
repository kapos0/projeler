import type { BookType } from "../assets/Types"
import BookCard from "./subComponents/BookCard"

export default function BooksCard({ books }: { books: BookType[] }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((item: BookType) => (
                <BookCard
                    key={item._id}
                    book={item}
                />
            ))}
        </div>
    )
}
