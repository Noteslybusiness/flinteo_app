import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Search, Bell } from "lucide-react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { useAdaptiveInsets } from "../../../../hooks/useAdaptiveInsets";
import { scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

interface Props {
    theme: AppTheme;
    onSearchPress?: () => void;
    onNotificationPress?: () => void;
}

const ExploreHeader: React.FC<Props> = ({
    theme,
    onSearchPress,
    onNotificationPress
}) => {
    const { colors } = theme;
    const inset = useAdaptiveInsets()

    return (
        <View style={[styles.container, { backgroundColor: colors.background , paddingTop: inset.top }]}>
            <Text style={[styles.title, { color: colors.text }]}>Explore</Text>

            {/* <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity onPress={onSearchPress}>
                    <Search size={22} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onNotificationPress}>
                    <Bell size={22} color={colors.text} />
                </TouchableOpacity>
            </View> */}
        </View>
    );
};

export default ExploreHeader;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // clean modern shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: scaleY(18),
        fontFamily: FONTS.InterSemiBold
    }
});
