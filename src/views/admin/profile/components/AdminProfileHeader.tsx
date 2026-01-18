import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Bell, Settings } from "lucide-react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";

interface Props {
    theme: AppTheme;
    title?: string;
    onSettingPress?: () => void;
}

const AdminScreenHeader: React.FC<Props> = ({ theme, title = "Profile", onSettingPress }) => {
    const { colors } = theme;
    const inset = useAdaptiveInsets()

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                shadowColor: colors.shadow,
                borderBottomColor: colors.border,
                paddingTop: inset.top
            }
        ]}>
            {/* Title */}
            <Text numberOfLines={2} ellipsizeMode="tail"  style={[styles.title, { color: colors.text }]}>{title}</Text>

            {/* Notification Icon */}
            <TouchableOpacity onPress={onSettingPress} activeOpacity={0.7}>
                <Settings size={22} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

export default AdminScreenHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
    },
});
