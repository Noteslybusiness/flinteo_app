import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { useEffect, useMemo, useState } from "react";
import { FONTS } from "../../../../assets/theme/appFonts";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { contentService } from "../../../../network/repo/content/ContentService";
import { CheckSquare, Square } from "lucide-react-native";

interface AddVideoModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (videos: any[]) => void;
    alreadySelected: any[];
    theme: AppTheme;
    course_slug: string;
}

const AddVideoModal = ({
    visible,
    onClose,
    onSubmit,
    alreadySelected,
    theme,
    course_slug,
}: AddVideoModalProps) => {
    const { colors } = theme;
    const [availableVideos, setAvailableVideos] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);

    /** Map for fast lookup */
    const selectedMap = useMemo(() => {
        const map = new Map();
        alreadySelected.forEach((v) => map.set(v.id, v));
        return map;
    }, [alreadySelected]);

    useEffect(() => {
        setSelected(alreadySelected);
    }, [alreadySelected]);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await contentService.getContentList({
                course_slug,
                content_type: "videos",
            });
            if (response?.data?.result) {
                setAvailableVideos(response.data.data || []);
            }
        } catch (err) {
            console.log("Fetch videos error", err);
        }
    };

    const toggleVideo = (video: any) => {
        setSelected((prev) =>
            prev.some((v) => v.id === video.id)
                ? prev.filter((v) => v.id !== video.id)
                : [...prev, video]
        );
    };

    const renderItem = ({ item }: any) => {
        const isSelected = selected.some((v) => v.id === item.id);

        return (
            <TouchableOpacity
                style={styles.videoRow}
                onPress={() => toggleVideo(item)}
                activeOpacity={0.7}
            >
                {/* Thumbnail */}
                <View style={styles.thumbWrapper}>
                    {item.thumbnail ? (
                        <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.thumbnail}
                        />
                    ) : (
                        <View
                            style={[
                                styles.thumbnail,
                                styles.thumbPlaceholder,
                            ]}
                        >
                            <Text style={styles.placeholderText}>
                                Video
                            </Text>
                        </View>
                    )}
                </View>

                {/* Title */}
                <View style={styles.videoInfo}>
                    <Text
                        numberOfLines={2}
                        style={[
                            styles.videoTitle,
                            { color: colors.text },
                        ]}
                    >
                        {item.title}
                    </Text>
                </View>

                {/* Checkbox */}
                <View style={styles.checkbox}>
                    {isSelected ? (
                        <CheckSquare
                            size={22}
                            color={colors.primary}
                        />
                    ) : (
                        <Square
                            size={22}
                            color={colors.border}
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.backdrop}>
                <View
                    style={[
                        styles.card,
                        { backgroundColor: colors.background },
                    ]}
                >
                    {/* Header */}
                    <Text
                        style={[
                            styles.title,
                            { color: colors.text },
                        ]}
                    >
                        Select Videos
                    </Text>

                    {/* List */}
                    <FlatList
                        data={availableVideos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: scaleY(80),
                        }}
                    />

                    {/* Bottom Actions */}
                    <View
                        style={[
                            styles.footer,
                            { borderTopColor: colors.border, backgroundColor: theme.colors.background },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.footerBtn}
                            onPress={onClose}
                        >
                            <Text
                                style={[
                                    styles.footerText,
                                    { color: colors.text },
                                ]}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.footerBtn,
                                styles.primaryBtn,
                                { backgroundColor: colors.primary },
                            ]}
                            onPress={() => onSubmit(selected)}
                        >
                            <Text
                                style={[
                                    styles.footerText,
                                    { color: colors.onPrimary },
                                ]}
                            >
                                Add Selected
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddVideoModal;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    card: {
        height: Matrix.DIM_80,
        padding: scaleX(16),
        borderTopLeftRadius: scaleX(16),
        borderTopRightRadius: scaleX(16),
    },

    title: {
        fontSize: scaleX(16),
        fontFamily: FONTS.InterSemiBold,
        marginBottom: scaleY(12),
    },

    videoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: scaleY(10),
    },

    thumbWrapper: {
        marginRight: scaleX(12),
    },

    thumbnail: {
        width: scaleX(56),
        height: scaleX(40),
        borderRadius: 6,
        backgroundColor: "#111827",
    },

    thumbPlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },

    placeholderText: {
        fontSize: 10,
        color: "#9CA3AF",
        fontFamily: FONTS.InterMedium,
    },

    videoInfo: {
        flex: 1,
    },

    videoTitle: {
        fontSize: scaleX(13),
        fontFamily: FONTS.InterMedium,
    },

    checkbox: {
        marginLeft: scaleX(12),
    },

    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        gap: scaleX(12),
        padding: scaleX(16),
        borderTopWidth: 1,
        backgroundColor: "#fff",
    },

    footerBtn: {
        flex: 1,
        paddingVertical: scaleY(12),
        alignItems: "center",
        borderRadius: 8,
    },

    primaryBtn: {
        elevation: 2,
    },

    footerText: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterSemiBold,
    },
});
