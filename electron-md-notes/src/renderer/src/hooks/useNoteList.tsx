import { useNotesStore } from "../store/notesStore";
import { useCallback } from "react";

export function useNotesList({ onSelect }: { onSelect?: () => void }) {
    const notes = useNotesStore((state) => state.notes);
    const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
    const setSelectedNoteId = useNotesStore((state) => state.setSelectedNote);

    const handleNoteSelect = useCallback(
        async (NoteId: string) => {
            setSelectedNoteId(NoteId);

            if (onSelect) onSelect();
        },
        [onSelect, setSelectedNoteId]
    );

    return {
        notes,
        selectedNoteId,
        handleNoteSelect,
    };
}
