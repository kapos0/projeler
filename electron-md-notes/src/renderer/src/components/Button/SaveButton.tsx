import { useCallback } from "react";
import { useNotesStore } from "@/renderer/store/notesStore";
import { ActionButton, ActionButtonProps } from "./ActionButton";
import { FaRegSave } from "react-icons/fa";

export function SaveNoteButton({ ...props }: ActionButtonProps) {
    const savetheNote = useNotesStore((state) => state.saveNote);
    const selectedNoteContent = useNotesStore((state) => state.selectedNote);
    const handleSaveNote = useCallback(() => {
        if (!selectedNoteContent) return;
        savetheNote(selectedNoteContent?.content);
    }, [savetheNote]);

    return (
        <ActionButton onClick={handleSaveNote} {...props}>
            <FaRegSave className="w-4 h-4 text-zinc-300" />
        </ActionButton>
    );
}
