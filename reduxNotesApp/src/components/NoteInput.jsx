import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewNote } from "../redux/slices/notesSlice";

export default function NoteInput() {
  const dispatch = useDispatch();
  const [color, setColor] = useState("#3B71CA");
  const [userInput, setUserInput] = useState("");
  return (
    <div>
      <textarea
        className="form-control text-light"
        placeholder="Enter your note here..."
        rows="10"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={{ backgroundColor: color }}
      ></textarea>
      <div className="d-flex flow-row justify-content-between">
        <div
          className="btn-group mt-3"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setColor("#3B71CA")}
          >
            &#9679;
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setColor("#14A44D")}
          >
            &#9679;
          </button>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => setColor("#54B4D3")}
          >
            &#9679;
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => setColor("#E4A11B")}
          >
            &#9679;
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setColor("#DC4C64")}
          >
            &#9679;
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => {
            if (userInput.trim() != "")
              dispatch(addNewNote({ color, content: userInput.trim() }));
            setUserInput("");
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );
}
