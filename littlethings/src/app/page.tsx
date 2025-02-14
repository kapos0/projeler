import Results from "@/components/Results";
import { toast } from "react-toastify";

export default async function Home() {
    const API_KEY = process.env.TMDB_API_KEY;
    const res = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await res.json();
    if (!res.ok) {
        toast.error("Failed to fetch data please refresh the page");
    }
    const results = data.results;
    return (
        <div>
            <Results results={results} />
        </div>
    );
}
