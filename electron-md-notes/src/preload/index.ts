import { DeleteNote, GetNotes, WriteNote } from "@/shared/types";
import { contextBridge, ipcRenderer } from "electron";

if (!process.contextIsolated)
    throw new Error("contextIsolation must be enabled in the BrowserWindow");

try {
    contextBridge.exposeInMainWorld("context", {
        locale: navigator.language,
        getNotes: (...args: Parameters<GetNotes>) =>
            ipcRenderer.invoke("getNotes", ...args),
        writeNote: (...args: Parameters<WriteNote>) =>
            ipcRenderer.invoke("writeNote", ...args),
        deleteNote: (...args: Parameters<DeleteNote>) =>
            ipcRenderer.invoke("deleteNote", ...args),
    });
} catch (error) {
    console.error(error);
}
