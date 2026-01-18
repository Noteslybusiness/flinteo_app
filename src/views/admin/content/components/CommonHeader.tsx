import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { ArrowLeft, Edit, User } from "lucide-react-native";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

interface HeaderProps {
    theme: AppTheme;
    onBackPress?: () => void;
    title: string;
    onEditPress?: () => void;
    onProfilePress?: () => void;
}

const CommonHeader: React.FC<HeaderProps> = ({
    theme,
    onBackPress,
    title,
    onEditPress,
    onProfilePress,
}) => {
    const { colors } = theme;
    const inset = useAdaptiveInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    borderBottomColor: colors.border,
                    paddingTop: inset.top,
                },
            ]}
        >
            {/* Left */}
            <View style={styles.leftContainer}>
                {onBackPress && (
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={onBackPress}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft
                            size={20}
                            color={colors.text}
                            strokeWidth={2.5}
                        />
                    </TouchableOpacity>
                )}

                <Text style={[styles.title, { color: colors.text }]}>
                    {title}
                </Text>
            </View>

            {/* Right */}
            <View style={styles.rightContainer}>
                {onEditPress && (
                    <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={onEditPress}
                        activeOpacity={0.7}
                    >
                        <Edit
                            size={20}
                            color={colors.primary}
                            strokeWidth={2.2}
                        />
                    </TouchableOpacity>
                )}

                {onProfilePress && (
                    <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={onProfilePress}
                        activeOpacity={0.7}
                    >
                        <User
                            size={20}
                            color={colors.primary}
                            strokeWidth={2.2}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default CommonHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: scaleX(12),
        paddingBottom: scaleY(12),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
    },

    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(10),
    },

    rightContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(12),
    },

    title: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterSemiBold,
    },

    iconWrapper: {
        width: scaleX(24),
        height: scaleX(24),
        borderRadius: scaleX(18),
        justifyContent: "center",
        alignItems: "center",
    },

    actionIcon: {
        width: scaleX(24),
        height: scaleX(24),
        borderRadius: scaleX(10),
        justifyContent: "center",
        alignItems: "center",
    },
});
