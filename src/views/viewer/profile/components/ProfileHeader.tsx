import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { ArrowLeft, User } from "lucide-react-native";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

interface HeaderProps {
    theme: AppTheme;
    onBackPress?: () => void;
    title: string
}

const ProfileHeader: React.FC<HeaderProps> = ({ theme, onBackPress , title}) => {
    const colors = theme.colors;
    const inset = useAdaptiveInsets()

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderBottomColor: colors.border,
                    paddingTop: inset.top
                },
            ]}
        >
            <Text style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>
        </View>
    );
};

export default ProfileHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: scaleX(16),
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        columnGap: scaleX(10)
    },
    title: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterSemiBold
    },
    iconWrapper: {
        borderRadius: scaleX(18),
        justifyContent: "center",
        alignItems: "center",
    },
});
