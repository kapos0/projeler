import { bool, object } from "prop-types";
import { useDispatch } from "react-redux";
import { deleteNote } from "../redux/slices/notesSlice";
export default function Note({ note, isSearched }) {
  const dispatch = useDispatch();
  return (
    <div className="col-md-4 my-2">
      <div className="card text-light" style={{ backgroundColor: note.color }}>
        <div className="card-body d-flex justify-content-between text-light align-items-center">
          <p>{note.content}</p>
          {isSearched ? (
            ""
          ) : (
            <button
              type="button"
              className="btn"
              onClick={() => {
                dispatch(deleteNote(note.id));
              }}
            >
              &#x1F7A9;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
Note.propTypes = {
  note: object,
  isSearched: bool,
};
