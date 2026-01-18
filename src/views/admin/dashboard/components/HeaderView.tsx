import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Bell, Building, Pencil } from "lucide-react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { FONTS } from "../../../../assets/theme/appFonts";
import { Matrix, scaleY } from "../../../../utils/baseDim";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";

interface HeaderProps {
    containerStyle?: ViewStyle;
    theme: AppTheme;
    title?: string;
    onNotificationPress?: () => void;
    onEditPress?: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({
    containerStyle,
    theme,
    title = "Dashboard",
    onNotificationPress,
    onEditPress
}) => {
    const colors = theme.colors;
    const inset = useAdaptiveInsets()

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    borderBottomColor: colors.border,
                    paddingTop: inset.top
                },
                containerStyle,
            ]}
        >
            <Text
                style={[
                    styles.title,
                    { color: colors.onSurface }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
            <View style={styles.rightIcons}>
                <TouchableOpacity
                    onPress={onNotificationPress}
                    style={[styles.iconWrapper, { borderColor: colors.outline }]}
                    activeOpacity={0.6}
                >
                    <Bell size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DashboardHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
    },

    title: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterSemiBold,
        maxWidth: Matrix.DIM_50
    },

    rightIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    iconWrapper: {
        height: 36,
        width: 36,
        justifyContent: "center",
        alignItems: "center"
    },
});
