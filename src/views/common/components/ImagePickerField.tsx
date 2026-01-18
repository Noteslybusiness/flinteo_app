import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ViewStyle,
} from "react-native";
import {
    pick,
    types,
    DocumentPickerResponse,
} from "@react-native-documents/picker";
import { ImageIcon, Edit } from "lucide-react-native";
import { scaleX, scaleY } from "../../../utils/baseDim";
import { FONTS } from "../../../assets/theme/appFonts";

interface ImagePickerFieldProps {
    theme: any;
    containerStyle?: ViewStyle;
    onImageSelect?: (file: any) => void;
    imageUrl?: string;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
    theme,
    containerStyle,
    onImageSelect,
    imageUrl
}) => {
    const { colors } = theme;

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);

    const pickFromGallery = async () => {
        try {
            const result = await pick({
                type: types.images,
                allowMultiSelection: false,
            });

            if (result?.length) {
                setImageUri(result[0].uri);
                setImageName(result[0].name);
                onImageSelect?.(result[0])
            }
        } catch {
            // user cancelled
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickFromGallery}
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
                containerStyle,
            ]}
        >
            {/* Left : Image Preview */}
            <View
                style={[
                    styles.previewBox,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                    },
                ]}
            >
                {imageUri || imageUrl ? (
                    <Image
                        source={{ uri: imageUri || imageUrl }}
                        style={styles.previewImage}
                    />
                ) : (
                    <ImageIcon size={22} color={colors.surfaceText} />
                )}
            </View>

            {/* Middle : Info */}
            <View style={styles.textContainer}>
                <Text
                    style={[styles.label, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {imageName || "Select Image"}
                </Text>

                <Text
                    style={[
                        styles.subText,
                        { color: colors.surfaceText },
                    ]}
                >
                    Tap to choose image
                </Text>
            </View>

            {/* Right : Action Icon */}
            {imageUri ? (
                <Edit size={18} color={colors.primary} />
            ) : (
                <ImageIcon size={18} color={colors.primary} />
            )}
        </TouchableOpacity>
    );
};

export default ImagePickerField;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: scaleX(12),
        borderRadius: scaleX(10),
        borderWidth: 1,
    },

    previewBox: {
        width: scaleX(48),
        height: scaleX(48),
        borderRadius: scaleX(24),
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    previewImage: {
        width: "100%",
        height: "100%",
    },

    textContainer: {
        flex: 1,
        marginHorizontal: scaleX(12),
    },

    label: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterMedium,
    },

    subText: {
        fontSize: scaleX(12),
        fontFamily: FONTS.InterRegular,
        marginTop: scaleY(2),
    },
});
