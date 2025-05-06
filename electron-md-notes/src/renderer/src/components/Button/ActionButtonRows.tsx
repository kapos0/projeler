import { ComponentProps } from "react";
import { NewNoteButton } from "./NewNoteButton";
import { DeleteNoteButton } from "./DeleteNoteButton";
import { SaveNoteButton } from "./SaveButton";
import { RefreshButton } from "./RefreshButton";

export const ActionButtonsRow = ({ ...props }: ComponentProps<"div">) => {
    return (
        <div {...props}>
            <NewNoteButton />
            <RefreshButton />
            <SaveNoteButton />
            <DeleteNoteButton />
        </div>
    );
};
