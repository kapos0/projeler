import { ComponentProps } from "react";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useNotesStore } from "../store/notesStore";

export const UpperNoteTitle = ({
    className,
    ...props
}: ComponentProps<"div">) => {
    const selectedNote = useNotesStore((state) => state.selectedNote);
    const updateNoteTitle = useNotesStore((state) => state.updateNoteTitle);
    const [title, setTitle] = useState(selectedNote?.title);

    useEffect(() => {
        setTitle(selectedNote?.title || "");
    }, [selectedNote]);

    async function handleTitleBlur() {
        if (selectedNote && title !== selectedNote.title && title)
            await updateNoteTitle(title);
    }

    return (
        <div className={twMerge("flex justify-center", className)} {...props}>
            {selectedNote ? (
                <input
                    type="text"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                    }
                    onBlur={handleTitleBlur}
                    className="bg-transparent text-gray-100 border-b border-gray-500 focus:outline-none focus:border-yellow-500"
                />
            ) : (
                <span className="text-gray-100">not selected any</span>
            )}
        </div>
    );
};
