import { NoteInfo } from "./models";

export type GetNotes = () => Promise<NoteInfo[]>;
export type WriteNote = (
    title: NoteInfo["title"],
    content: NoteInfo["content"]
) => Promise<void>;
export type CreateNote = () => Promise<NoteInfo["title"] | false>;
export type DeleteNote = (title: NoteInfo["title"]) => Promise<boolean>;
