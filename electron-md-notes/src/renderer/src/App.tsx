import { useRef } from "react";
import { ActionButtonsRow } from "./components/Button/ActionButtonRows";
import { Content, LayOut, Sidebar } from "./components/LayOut";
import { MDEditor } from "./components/MDEditor";
import { NoteList } from "./components/NoteList";
import { UpperNoteTitle } from "./components/UpperNoteTitle";

export default function App() {
    const contentContainerRef = useRef<HTMLDivElement>(null);
    function resetScroll() {
        contentContainerRef.current?.scrollTo(0, 0);
    }
    return (
        <LayOut>
            <Sidebar className="p-2">
                <ActionButtonsRow className="flex justify-between mt-1" />
                <NoteList className="mt-3 space-y-1" onSelect={resetScroll} />
            </Sidebar>
            <Content
                className="border-l bg-zinc-900/50 border-l-white/20 p-2"
                ref={contentContainerRef}
            >
                <UpperNoteTitle className="pt-2" />
                <MDEditor />
            </Content>
        </LayOut>
    );
}
