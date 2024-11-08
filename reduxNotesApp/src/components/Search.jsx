import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Note from "./Note";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const notes = useSelector((state) => state.notes);
  function handleInput(e) {
    setSearchInput(e.target.value.trim());
  }
  useEffect(() => {
    if (searchInput.trim() !== "") {
      const filteredNotes = notes?.filter((note) =>
        note.content.toLowerCase().includes(searchInput.toLowerCase().trim())
      );
      setSelectedNotes(filteredNotes);
    }
  }, [searchInput, notes]);
  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchInput}
          onChange={handleInput}
        />
      </div>
      <div className="row mt-2">
        {selectedNotes.length > 0 && (
          <h1 className="text-center">Searched Elements</h1>
        )}
        {selectedNotes?.map((item) => (
          <Note key={item.id} note={item} isSearched={true} />
        ))}
      </div>
    </div>
  );
}
