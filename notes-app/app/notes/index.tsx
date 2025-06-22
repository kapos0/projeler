import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

import AddNoteModal from "@/components/AddNoteModal";
import NoteList from "@/components/NoteList";
import notesService from "@/services/notesService";

export type NoteType = {
    $id: string;
    content: string;
};

export default function NotesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth() as {
        user: { $id: string } | null;
        loading: boolean;
    };

    const [notes, setNotes] = useState<NoteType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchNotes() {
        setLoading(true);
        const response = await notesService.getNotes(user?.$id!);
        if (!response.error) {
            // Sadece gerekli alanları içeren yeni bir dizi oluşturur
            const simplifiedNotes =
                response.data?.map((note: any) => ({
                    $id: note.$id,
                    content: note.content,
                })) ?? [];
            setNotes(simplifiedNotes);
        } else {
            setError(response.error);
            Alert.alert("Error", response.error);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (!user && !authLoading) router.replace("/auth");
    }, [user, authLoading]);

    useEffect(() => {
        if (user) fetchNotes();
    }, [user]);

    async function addNote() {
        if (newNote.trim() === "") return;
        setLoading(true);
        const response = await notesService.addNewNote(newNote, user?.$id!);
        if (!response.error) {
            setNotes((prev: NoteType[]) => [
                ...prev,
                response.data as unknown as NoteType,
            ]);
            setLoading(false);
        } else {
            Alert.alert("Error", response.error);
            setError(response.error);
        }
        setLoading(false);
        setNewNote("");
        setModalVisible(false);
    }

    async function deleteNote(noteId: string) {
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const response = await notesService.deleteNote(noteId);
                        if (response.success) {
                            setNotes((prev: NoteType[]) =>
                                prev.filter((note) => note.$id !== noteId)
                            );
                        } else {
                            Alert.alert("Error", response.error);
                            setError(response.error);
                        }
                        setLoading(false);
                    },
                },
            ]
        );
    }

    async function editNote(noteId: string, newContent: string) {
        if (!newContent.trim()) {
            Alert.alert("Error", "Note text cannot be empty");
            return;
        }

        const response = await notesService.updateNote(noteId, newContent);
        if (!response.error) {
            setNotes((prevNotes: NoteType[]) =>
                prevNotes.map((note: NoteType) =>
                    note.$id === noteId
                        ? {
                              ...note,
                              content: (response.data as unknown as NoteType)
                                  .content,
                          }
                        : note
                )
            );
        } else Alert.alert("Error", response.error);
    }

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#007bff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {notes.length !== 0 ? (
                <NoteList
                    notes={notes}
                    onDelete={deleteNote}
                    onEdit={editNote}
                />
            ) : (
                <Text style={styles.noNotesText}>You have no notes</Text>
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+ Add a note</Text>
            </TouchableOpacity>
            <AddNoteModal
                modalVisible={modalVisible}
                addNote={addNote}
                setModalVisible={setModalVisible}
                newNote={newNote}
                setNewNote={setNewNote}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
        fontSize: 16,
    },
    noNotesText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#555",
        marginTop: 15,
    },
});
