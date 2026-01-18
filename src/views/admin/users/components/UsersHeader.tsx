import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { ArrowLeft, User } from "lucide-react-native";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

interface UsersHeaderProps {
    theme: AppTheme;
    onBackPress?: () => void;
    title?: string;
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ theme, onBackPress, title}) => {
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
            ]}
        >
            {
                onBackPress &&
                    <TouchableOpacity
                        style={[
                            styles.iconWrapper
                        ]}
                        onPress={onBackPress}
                    >
                        <ArrowLeft size={20} color={colors.text} strokeWidth={2.5}/>
                    </TouchableOpacity>
            }
            <Text style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>
        </View>
    );
};

export default UsersHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: scaleX(16),
        paddingBottom: scaleY(14),
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        columnGap: scaleX(8)
    },
    title: {
        fontSize: scaleY(18),
        fontFamily: FONTS.InterSemiBold
    },
    iconWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
});
