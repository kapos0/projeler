import { ComponentProps } from "react";
import { cn, formatDateFromMs } from "../lib/lib";
import { NoteInfo } from "@/shared/models";

export type NotePreviewProps = NoteInfo & {
    isActive?: boolean;
} & ComponentProps<"div">;

export const NotePreview = ({
    title,
    content,
    lastEditTime,
    isActive = false,
    className,
    NoteId,
    ...props
}: NotePreviewProps) => {
    const date = formatDateFromMs(lastEditTime);

    return (
        <div
            className={cn(
                "cursor-pointer px-2.5 py-3 rounded-md transition-colors duration-75",
                {
                    "bg-zinc-400/75": isActive,
                    "hover:bg-zinc-500/75": !isActive,
                },
                className
            )}
            data-note-id={NoteId}
            {...props}
        >
            <h3 className="mb-1 font-bold truncate">{title}</h3>
            <span>
                {content && content.length > 20
                    ? `${content.slice(0, 20)}...`
                    : content}
            </span>
            <span className="inline-block w-full mb-2 text-xs font-light text-left">
                {date}
            </span>
        </div>
    );
};
