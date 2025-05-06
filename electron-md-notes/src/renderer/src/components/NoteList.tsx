import { ComponentProps } from "react";
import { NotePreview } from "./NotePreview";
import { twMerge } from "tailwind-merge";
import { isEmpty } from "lodash";
import { useNotesList } from "../hooks/useNoteList";

export type NoteListProps = ComponentProps<"ul"> & {
    onSelect?: () => void;
};

export function NoteList({ onSelect, className, ...props }: NoteListProps) {
    const { notes, selectedNoteId, handleNoteSelect } = useNotesList({
        onSelect,
    });
    if (isEmpty(notes))
        return (
            <ul className={twMerge("text-center pt-4", className)} {...props}>
                <span>No Notes Yet!</span>
            </ul>
        );
    return (
        <ul className={`border-t-1 p-2 ${className}`} {...props}>
            {notes.map((note) => (
                <NotePreview
                    key={note.NoteId || Math.random()}
                    {...note}
                    isActive={selectedNoteId === note.NoteId}
                    onClick={() => {
                        handleNoteSelect(note.NoteId);
                    }}
                />
            ))}
        </ul>
    );
}
