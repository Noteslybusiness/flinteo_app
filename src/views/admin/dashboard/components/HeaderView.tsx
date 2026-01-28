import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    Image,
} from "react-native";
import { Bell } from "lucide-react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { FONTS } from "../../../../assets/theme/appFonts";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";

interface HeaderProps {
    containerStyle?: ViewStyle;
    theme: AppTheme;
    firstName: string;
    roleName?: string;
    profileImage?: string;
    onNotificationPress?: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({
    containerStyle,
    theme,
    firstName,
    roleName = "Member",
    profileImage,
    onNotificationPress,
}) => {
    const colors = theme.colors;
    const inset = useAdaptiveInsets();

    const initials = firstName?.charAt(0)?.toUpperCase();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: inset.top + scaleY(8),
                },
                containerStyle,
            ]}
        >
            {/* LEFT */}
            <View style={styles.leftSection}>
                <View
                    style={[
                        styles.avatar,
                        { backgroundColor: colors.primaryContainer },
                    ]}
                >
                    {profileImage ? (
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <Text
                            style={[
                                styles.avatarText,
                                { color: colors.primary },
                            ]}
                        >
                            {initials}
                        </Text>
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.nameText,
                            { color: colors.onSurface },
                        ]}
                        numberOfLines={1}
                    >
                        {"Hello, " + firstName}
                    </Text>
                    <Text
                        style={[
                            styles.roleText,
                            { color: colors.onSurfaceVariant },
                        ]}
                        numberOfLines={1}
                    >
                        {roleName}
                    </Text>
                </View>
            </View>

            {/* RIGHT */}
            <TouchableOpacity
                onPress={onNotificationPress}
                style={[
                    styles.notificationBtn,
                    { backgroundColor: colors.surfaceContainerLow },
                ]}
                activeOpacity={0.7}
            >
                <Bell size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

export default DashboardHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: scaleX(16),
        paddingBottom: scaleY(24),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: Matrix.DIM_70,
    },

    avatar: {
        height: scaleY(32),
        width: scaleY(32),
        borderRadius: scaleY(22),
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    avatarImage: {
        height: "100%",
        width: "100%",
    },

    avatarText: {
        fontSize: scaleY(18),
        fontFamily: FONTS.InterBold,
        lineHeight: scaleY(22),
    },

    textContainer: {
        marginLeft: scaleX(12),
        justifyContent: "center",
        rowGap: scaleX(4)
    },

    nameText: {
        fontSize: scaleY(16),
        lineHeight: scaleY(20),
        fontFamily: FONTS.InterSemiBold,
        marginTop: scaleY(2),
    },

    roleText: {
        fontSize: scaleY(12),
        lineHeight: scaleY(16),
        fontFamily: FONTS.InterRegular,
        marginTop: scaleY(2),
    },

    notificationBtn: {
        height: scaleY(40),
        width: scaleY(40),
        borderRadius: scaleY(12),
        justifyContent: "center",
        alignItems: "center",
    },
});
