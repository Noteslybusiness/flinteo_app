import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { AppTheme } from "../../../assets/theme/themeContext";
import { scaleY } from "../../../utils/baseDim";

interface Props {
    theme: AppTheme;
    value?: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

const GlobalSearchBar: React.FC<Props> = ({ theme, value, onChange, placeholder}) => {
    const { colors } = theme;

    return (
        <View
            style={[
                styles.wrapper,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
            ]}
        >
            <Search size={20} color={colors.text} />
            <TextInput
                style={[
                    styles.input,
                    { color: colors.text },
                ]}
                placeholder={placeholder || "Search videos, creators..."}
                placeholderTextColor={colors.grayField}
                value={value}
                onChangeText={onChange}
            />
        </View>
    );
};

export default GlobalSearchBar;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: scaleY(4),
        backgroundColor: "#FFF",
        borderRadius: scaleY(12),
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: scaleY(14),
    },
});
