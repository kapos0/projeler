import { useRef } from "react";
import { throttle } from "lodash";
import { useNotesStore } from "../store/notesStore";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { autoSavingTime } from "@/shared/constants";

export function useMdEditor() {
    const selectedNote = useNotesStore((state) => state.selectedNote);
    const saveNote = useNotesStore((state) => state.saveNote);
    const editorRef = useRef<MDXEditorMethods>(null);
    const handleAutoSaving = throttle(
        async (content: string) => {
            if (!selectedNote) return;
            console.info("Auto saving:", selectedNote.title);

            await saveNote(content);
        },
        autoSavingTime,
        {
            leading: false,
            trailing: true,
        }
    );

    async function handleBlur() {
        if (!selectedNote) return;

        handleAutoSaving.cancel();

        const content = editorRef.current?.getMarkdown();

        if (content != null) await saveNote(content);
    }
    return {
        selectedNote,
        handleAutoSaving,
        editorRef,
        handleBlur,
    };
}
