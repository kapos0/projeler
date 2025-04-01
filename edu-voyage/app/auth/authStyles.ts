import { StyleSheet } from "react-native";
import Colors from "@/assets/constant/Colors";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        paddingTop: 100,
        flex: 1,
        padding: 25,
        backgroundColor: Colors.WHITE,
    },
    logo: {
        width: 180,
        height: 180,
    },
    containerHeaderText: {
        fontSize: 30,
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        height: 50,
        padding: 15,
        fontSize: 18,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 8,
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        width: "100%",
        borderRadius: 10,
        marginTop: 25,
    },
    buttonText: {
        color: Colors.WHITE,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default styles;
