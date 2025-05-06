import { homedir } from "os";
import { appDirectoryName, fileEncoding } from "@/shared/constants";
import {
    ensureDir,
    readdir,
    readFile,
    remove,
    stat,
    writeFile,
} from "fs-extra";
import { NoteInfo } from "@/shared/models";
import { nanoid } from "nanoid";

export function getRootDir() {
    return `${homedir()}/${appDirectoryName}`;
}

export async function getNoteFromFileName(filename: string): Promise<NoteInfo> {
    const rootDir = getRootDir();
    const fileStats = await stat(`${rootDir}/${filename}`);
    return {
        title: filename.replace(".md", ""),
        content: await readFile(`${rootDir}/${filename}`, {
            encoding: fileEncoding,
        }),
        NoteId: nanoid(),
        lastEditTime: fileStats.mtimeMs,
    };
}

export async function getNotes() {
    const rootDir = getRootDir();
    await ensureDir(rootDir); //Ensures that the directory exists. If the directory structure does not exist, it is created.
    const notesFileNames = await readdir(rootDir, {
        encoding: fileEncoding,
        withFileTypes: false,
    });
    const notes = notesFileNames.filter((filename) => filename.endsWith(".md"));
    return Promise.all(notes.map(getNoteFromFileName));
}

export function writeNote(filename: string, content: string) {
    const rootDir = getRootDir();
    console.info(`Writing note ${filename}`);
    return writeFile(`${rootDir}/${filename}.md`, content, {
        encoding: fileEncoding,
    });
}

export async function deleteNote(filename: string) {
    const rootDir = getRootDir();
    console.info(`Deleting note ${filename}`);
    return remove(`${rootDir}/${filename}.md`);
}
