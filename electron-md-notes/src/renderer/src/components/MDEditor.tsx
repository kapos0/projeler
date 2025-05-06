import {
    headingsPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
} from "@mdxeditor/editor";
import { useMdEditor } from "../hooks/useMdEditor";

export function MDEditor() {
    const { editorRef, handleAutoSaving, handleBlur, selectedNote } =
        useMdEditor();
    if (!selectedNote) return null;
    return (
        <MDXEditor
            ref={editorRef}
            key={`${selectedNote?.NoteId}-${selectedNote?.lastEditTime}`} // Benzersiz bir key oluşturuldu
            markdown={selectedNote?.content}
            onChange={handleAutoSaving}
            onBlur={handleBlur}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
            ]}
            contentEditableClassName="outline-none min-h-screen max-w-none text-lg px-8 py-5 caret-yellow-500 prose prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']"
        />
    );
}
