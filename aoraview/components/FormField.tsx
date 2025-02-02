import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    TextInputProps,
} from "react-native";

import icons from "@/assets/constants/icons";

type FormFieldProps = TextInputProps & {
    title: string;
    value: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
};

export default function FormField({
    title,
    value,
    handleChangeText,
    otherStyles,
    ...props
}: FormFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-pmedium my-3">
                {title}
            </Text>

            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
                <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={value}
                    onChangeText={handleChangeText}
                    placeholderTextColor="#7B7B8B"
                    secureTextEntry={title === "Password" && !showPassword}
                    {...props} // Now strongly typed
                />

                {title === "Password" && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Image
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
