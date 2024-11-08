import Footer from "./components/Footer";
import Header from "./components/Header";
import Note from "./components/Note";
import Search from "./components/Search";
import NoteInput from "./components/NoteInput";

import { useSelector } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const notes = useSelector((state) => state.notes);

  return (
    <>
      <Header />
      <main className="container my-5">
        <Search />
        <NoteInput />
        <div className="row mt-2">
          {notes?.map((note) => (
            <Note key={note.id} note={note} isSearched={false} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
