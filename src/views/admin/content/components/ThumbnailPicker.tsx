import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
} from "react-native";
import { Plus, Check } from "lucide-react-native";
import {
    pick,
    types,
    DocumentPickerResponse,
} from "@react-native-documents/picker";
import { AppTheme, THEME_COLORS } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

const THUMB_WIDTH = scaleX(90);
const THUMB_HEIGHT = THUMB_WIDTH * (16 / 9);

export type ThumbnailValue = string | DocumentPickerResponse;

interface Props {
    theme: AppTheme;
    thumbnails: string[]; // auto-extracted thumbnails
    errorMessage?: string;
    onSelect: (thumbnail: ThumbnailValue) => void;
}

const ThumbnailPicker: React.FC<Props> = ({
    theme,
    thumbnails,
    onSelect,
    errorMessage
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | "custom" | null>(
        null
    );
    const [customThumb, setCustomThumb] =
        useState<DocumentPickerResponse | null>(null);
    const inputBorderColor = errorMessage
        ? theme.colors.error
        : theme.colors.border || theme.colors.outline || THEME_COLORS.onPrimary;

    const pickFromGallery = async () => {
        try {
            const result = await pick({
                type: types.images,
                allowMultiSelection: false,
            });

            if (result?.length) {
                setCustomThumb(result[0]);
                setSelectedIndex("custom");
                onSelect(result[0]);
            }
        } catch {
            // user cancelled
        }
    };

    return (
        <View style={[styles.container, {
            borderColor: inputBorderColor,
            backgroundColor: theme.colors.background,
            borderWidth: scaleX(2),
            borderRadius: scaleX(8),
        }]}>
            <Text style={[styles.text, { color: theme.colors.surfaceText }]}>{"Choose Thumbnail"}</Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.thumbContainer}>
                {thumbnails.map((uri, index) => (
                    <TouchableOpacity
                        key={`${uri}-${index}`}
                        style={[
                            styles.thumbBox,
                            selectedIndex === index && {
                                borderColor: theme.colors.primary,
                                borderWidth: 2,
                            },
                        ]}
                        onPress={() => {
                            setSelectedIndex(index);
                            setCustomThumb(null);
                            onSelect(uri);
                        }}
                    >
                        <Image source={{ uri }} style={styles.image} />
                        {selectedIndex === index && (
                            <View style={styles.checkOverlay}>
                                <Check size={18} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
                {/* Custom thumbnail */}
                {customThumb && (
                    <TouchableOpacity
                        style={[
                            styles.thumbBox,
                            {
                                borderColor: theme.colors.primary,
                                borderWidth: 2,
                            },
                        ]}
                    >
                        <Image source={{ uri: customThumb.uri }} style={styles.image} />
                        <View style={styles.checkOverlay}>
                            <Check size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>
                )}
                {/* + picker */}
                <TouchableOpacity style={styles.addBox} onPress={pickFromGallery}>
                    <Plus size={26} color={theme.colors.primary} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scaleX(12),
        padding: scaleY(12),
    },
    text: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterSemiBold,
        marginBottom: scaleY(4),
    },
    thumbContainer: {
        flexDirection: "row",
        gap: scaleX(12),
    },
    thumbBox: {
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 1,
    },

    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover", // important for video frames
    },

    checkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        alignItems: "center",
        justifyContent: "center",
    },

    addBox: {
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default ThumbnailPicker;
