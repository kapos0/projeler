import { useCallback } from "react";
import { TbRefresh } from "react-icons/tb";
import { ActionButton, ActionButtonProps } from "./ActionButton";
import { initializeNotes, useNotesStore } from "@/renderer/store/notesStore";

export function RefreshButton({ ...props }: ActionButtonProps) {
    const SaveNote = useNotesStore((state) => state.saveNote);
    const content = useNotesStore((state) => state.selectedNote?.content);
    const handleRefresh = useCallback(() => {
        async function saveContent() {
            if (content) await SaveNote(content);
            else return;
            const ReloadedNotes = await initializeNotes();
            useNotesStore.setState({ notes: ReloadedNotes });
        }
        saveContent();
    }, [content]);

    return (
        <ActionButton onClick={handleRefresh} {...props}>
            <TbRefresh className="w-4 h-4 text-zinc-300" />
        </ActionButton>
    );
}
