import { DeleteNote, GetNotes, WriteNote } from "@shared/types";

declare global {
    interface Window {
        // electron: ElectronAPI
        context: {
            locale: string;
            getNotes: GetNotes;
            writeNote: WriteNote;
            deleteNote: DeleteNote;
        };
    }
}
