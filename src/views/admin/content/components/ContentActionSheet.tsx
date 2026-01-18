import React from "react";
import {
    Modal,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StyleSheet as RNStyleSheet,
} from "react-native";
import { Share, PlusCircle, Trash2 } from "lucide-react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

interface Props {
    visible: boolean;
    theme: AppTheme;
    onClose: () => void;
    onShare?: () => void;
    onAddToCourse?: () => void;
    onDelete?: () => void;
}

const ContentActionSheet: React.FC<Props> = ({
    visible,
    theme,
    onClose,
    onShare,
    onAddToCourse,
    onDelete,
}) => {
    const { colors } = theme;

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                {/* Tap outside to close */}
                <TouchableOpacity
                    style={RNStyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View
                    style={[
                        styles.sheet,
                        { backgroundColor: colors.surface },
                    ]}
                >
                    {/* Drag Indicator */}
                    <View style={styles.dragIndicator} />

                    {/* SHARE */}
                    {onShare && (
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={onShare}
                        >
                            <Share size={20} color={colors.text} />
                            <Text
                                style={[
                                    styles.actionText,
                                    { color: colors.text },
                                ]}
                            >
                                Share
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* ADD TO COURSE */}
                    {onAddToCourse && (
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={onAddToCourse}
                        >
                            <PlusCircle
                                size={20}
                                color={colors.primary}
                            />
                            <Text
                                style={[
                                    styles.actionText,
                                    { color: colors.text },
                                ]}
                            >
                                Add to Course
                            </Text>
                        </TouchableOpacity>
                    )}

                    {(onShare || onAddToCourse) && onDelete && (
                        <View
                            style={[
                                styles.divider,
                                { backgroundColor: colors.border },
                            ]}
                        />
                    )}

                    {/* DELETE */}
                    {onDelete && (
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={onDelete}
                        >
                            <Trash2
                                size={20}
                                color={colors.error}
                            />
                            <Text
                                style={[
                                    styles.actionText,
                                    { color: colors.error },
                                ]}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* CANCEL */}
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onClose}
                    >
                        <Text
                            style={[
                                styles.cancelText,
                                { color: colors.surfaceText },
                            ]}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ContentActionSheet;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    sheet: {
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(8),
        paddingBottom: scaleY(16),
        borderTopLeftRadius: scaleX(16),
        borderTopRightRadius: scaleX(16),
    },

    dragIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#D1D5DB",
        alignSelf: "center",
        marginBottom: scaleY(12),
    },

    actionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: scaleY(14),
        gap: scaleX(12),
    },

    actionText: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterMedium,
    },

    divider: {
        height: 1,
        marginVertical: scaleY(8),
    },

    cancelBtn: {
        marginTop: scaleY(6),
        paddingVertical: scaleY(14),
        alignItems: "center",
    },

    cancelText: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterMedium,
    },
});
