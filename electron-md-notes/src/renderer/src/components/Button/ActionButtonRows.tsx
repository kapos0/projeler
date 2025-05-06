import { ComponentProps } from "react";
import { NewNoteButton } from "./NewNoteButton";
import { DeleteNoteButton } from "./DeleteNoteButton";
import { SaveNoteButton } from "./SaveButton";

export const ActionButtonsRow = ({ ...props }: ComponentProps<"div">) => {
    return (
        <div {...props}>
            <NewNoteButton />
            <SaveNoteButton />
            <DeleteNoteButton />
        </div>
    );
};
