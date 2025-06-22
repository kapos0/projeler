import { useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function NoteItem({
    item,
    onDelete,
    onEdit,
}: {
    item: { $id: string; content: string };
    onDelete: (id: string) => void;
    onEdit: (id: string, content: string) => void;
}) {
    const inputRef = useRef<TextInput>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(item.content as string);

    function handleSave() {
        if (newContent.trim() === "") return;
        onEdit(item.$id, newContent);
        setIsEditing(false);
    }

    return (
        <View style={styles.noteItem}>
            {isEditing ? (
                <TextInput
                    ref={inputRef}
                    style={styles.edit}
                    value={newContent}
                    onChange={(e) => setNewContent(e.nativeEvent.text)}
                    autoFocus
                    onSubmitEditing={handleSave}
                    returnKeyType="done"
                />
            ) : (
                <Text style={styles.noteText}>{item.content}</Text>
            )}
            <View style={styles.actions}>
                {isEditing ? (
                    <TouchableOpacity
                        onPress={() => {
                            handleSave();
                            inputRef.current?.blur();
                        }}
                    >
                        <Text style={styles.edit}>💾</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Text style={styles.edit}>✏️</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => onDelete(item.$id)}>
                    <Text style={styles.delete}>❌</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    noteItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
    },
    noteText: {
        fontSize: 18,
    },
    delete: {
        fontSize: 18,
        color: "red",
    },
    actions: {
        flexDirection: "row",
    },
    edit: {
        fontSize: 18,
        marginRight: 10,
        color: "blue",
    },
});
