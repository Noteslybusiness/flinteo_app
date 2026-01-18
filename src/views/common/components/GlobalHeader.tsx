import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowLeft, Search, Trash2 } from "lucide-react-native";
import { AppTheme } from "../../../assets/theme/themeContext";
import { useAdaptiveInsets } from "../../../hooks/useAdaptiveInsets";
import { scaleY } from "../../../utils/baseDim";
import { FONTS } from "../../../assets/theme/appFonts";

interface Props {
    theme: AppTheme;
    title?: string;
    onBackPress?: () => void;
    onSearchPress?: () => void;
    actionDelete?: () => void;
}

const GlobalHeader: React.FC<Props> = ({
    theme,
    title = "Explore",
    onBackPress,
    onSearchPress,
    actionDelete
}) => {
    const { colors } = theme;
    const inset = useAdaptiveInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: inset.top,
                    paddingBottom: scaleY(8)
                }
            ]}
        >
            {/* Left: Back + Title */}
            <View style={styles.leftContainer}>
                {onBackPress && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        hitSlop={10}
                    >
                        <ArrowLeft size={22} color={colors.text} />
                    </TouchableOpacity>
                )}

                <Text style={[styles.title, { color: colors.text }]}>
                    {title}
                </Text>
            </View>

            {/* Right: Search (only if callback exists) */}
            {onSearchPress && (
                <TouchableOpacity
                    onPress={onSearchPress}
                    hitSlop={10}
                >
                    <Search size={22} color={colors.text} />
                </TouchableOpacity>
            )}
            {
                actionDelete && (
                    <TouchableOpacity onPress={actionDelete}>
                        <Trash2
                            size={20}
                            color={theme.colors.error}
                        />
                    </TouchableOpacity>
                )
            }
        </View>
    );
};

export default GlobalHeader;


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scaleY(16),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    title: {
        fontSize: scaleY(18),
        fontFamily: FONTS.InterSemiBold
    }
});
