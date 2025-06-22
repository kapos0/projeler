import { FlatList } from "react-native";
import NoteItem from "@/components/NoteItem";
import { NoteType } from "@/app/notes";

export default function NoteList({
    notes,
    onDelete,
    onEdit,
}: {
    notes: NoteType[];
    onDelete: (id: string) => void;
    onEdit: (id: string, content: string) => void;
}) {
    return (
        <FlatList
            data={notes}
            keyExtractor={(item) => item.$id.toString()}
            renderItem={({ item }) => (
                <NoteItem item={item} onDelete={onDelete} onEdit={onEdit} />
            )}
        />
    );
}
