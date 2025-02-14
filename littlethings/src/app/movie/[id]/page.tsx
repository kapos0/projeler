import AddToFav from "@/components/AddToFav";
import Link from "next/link";

export default async function MoviePage({ params }: { params: any }) {
    const { id: movieId } = await params;
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`
    );
    const movie = await res.json();
    if (!res.ok) {
        return (
            <div className="text-center mt-10">
                <h1 className="text-xl my-5">
                    Movie details are not available at the moment!
                </h1>
                <p>
                    <Link href="/" className="hover:text-amber-600">
                        Go Home
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="p-4 md:pt-8 flex flex-col md:flex-row content-center max-w-6xl mx-auto md:space-x-6">
                <img
                    src={`https://image.tmdb.org/t/p/original/${
                        movie.backdrop_path || movie.poster_path
                    }`}
                    className="rounded-lg w-full md:w-96 h-56 object-cover"
                ></img>
                <div className="p-2">
                    <h2 className="text-lg mb-3 font-bold">
                        {movie.title || movie.name}
                    </h2>
                    <p className="text-lg mb-3">{movie.overview}</p>
                    <p className="mb-3">
                        <span className="font-semibold mr-1">
                            Date Released:
                        </span>
                        {movie.release_date || movie.first_air_date}
                    </p>
                    <p className="mb-3">
                        <span className="font-semibold mr-1">Rating:</span>
                        {movie.vote_count}
                    </p>
                    <AddToFav
                        movieId={movieId}
                        title={movie.title || movie.name}
                        image={movie.backdrop_path || movie.poster_path}
                        overview={movie.overview}
                        releaseDate={movie.release_date || movie.first_air_date}
                        voteCount={movie.vote_count}
                    />
                </div>
            </div>
        </div>
    );
}
