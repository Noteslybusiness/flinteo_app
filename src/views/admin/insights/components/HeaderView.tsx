import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { ArrowLeft, User } from "lucide-react-native";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";
import { scaleX } from "../../../../utils/baseDim";

interface HeaderProps {
    theme: AppTheme;
    onBackPress?: () => void;
}

const HeaderView: React.FC<HeaderProps> = ({ theme, onBackPress }) => {
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
                Insights
            </Text>
        </View>
    );
};

export default HeaderView;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: scaleX(16),
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        columnGap: scaleX(8)
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
    },
    iconWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
});
