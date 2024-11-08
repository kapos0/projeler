import { createSlice, nanoid } from "@reduxjs/toolkit";

function writeToLocal(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function getFromLocal() {
  if (localStorage.getItem("notes"))
    return JSON.parse(localStorage.getItem("notes"));
  else return [];
}

export const notesSlice = createSlice({
  name: "notes",
  initialState: getFromLocal(),
  reducers: {
    addNewNote: (state, action) => {
      state.push({ id: nanoid(), ...action.payload });
      writeToLocal(state);
    },
    deleteNote: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addNewNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
