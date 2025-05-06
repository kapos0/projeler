import { useCallback } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { ActionButton, ActionButtonProps } from "./ActionButton";
import { useNotesStore } from "@/renderer/store/notesStore";

export function DeleteNoteButton({ ...props }: ActionButtonProps) {
    const deleteNote = useNotesStore((state) => state.deleteNote);

    const handleDelete = useCallback(() => {
        deleteNote();
    }, [deleteNote]);

    return (
        <ActionButton onClick={handleDelete} {...props}>
            <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
        </ActionButton>
    );
}
