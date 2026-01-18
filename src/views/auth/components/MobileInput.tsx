import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
    TextInputProps,
    TouchableOpacity,
} from "react-native";
import { AppTheme, THEME_COLORS } from "../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../utils/baseDim";
import { FONTS } from "../../../assets/theme/appFonts";
import { Phone, ChevronDown } from "lucide-react-native";

interface MobileInputProps
    extends Omit<
        TextInputProps,
        "style" | "onChangeText" | "value" | "keyboardType"
    > {
    containerStyles?: ViewStyle;
    onChangeText?: (text: string) => void;
    onIsdCodeChange?: (text: string) => void;
    value?: string;
    theme: AppTheme;
    errorMessage?: string;
    label?: string;
    isdCode?: string; // +91
    onPressIsd?: () => void;
}

const MobileInput: React.FC<MobileInputProps> = ({
    containerStyles = {},
    onChangeText,
    onIsdCodeChange,
    value,
    theme,
    errorMessage,
    label = "Mobile Number",
    isdCode = "+91",
    onPressIsd,
    ...rest
}) => {
    const inputBorderColor = errorMessage
        ? theme.colors.error
        : theme.colors.border ||
          theme.colors.outline ||
          THEME_COLORS.onPrimary;

    return (
        <View style={[styles.container, containerStyles]}>
            {label && (
                <Text style={[styles.label, { color: theme.colors.surfaceText }]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.inputWrapper,
                    {
                        borderColor: inputBorderColor,
                        backgroundColor: theme.colors.background,
                        borderWidth: scaleX(2),
                        borderRadius: scaleX(8),
                    },
                ]}
            >
                {/* ISD Code */}
                <TouchableOpacity
                    style={styles.isdContainer}
                    activeOpacity={0.7}
                    onPress={onPressIsd}
                >
                    <Text
                        style={[
                            styles.isdText,
                            { color: theme.colors.surfaceText },
                        ]}
                    >
                        {isdCode}
                    </Text>
                    <ChevronDown
                        size={16}
                        color={theme.colors.inputPlaceHolder}
                    />
                </TouchableOpacity>
                {/* Separator */}
                <View
                    style={[
                        styles.separator,
                        { backgroundColor: theme.colors.border },
                    ]}
                />
                {/* Mobile number input */}
                <TextInput
                    value={value}
                    placeholder="Enter mobile number"
                    onChangeText={(text) => {
                        onIsdCodeChange?.(isdCode)
                        onChangeText?.(text.replace(/[^0-9]/g, ""))
                    }}
                    keyboardType="number-pad"
                    maxLength={10}
                    accessibilityLabel={label}
                    accessibilityState={{
                        disabled: rest.editable === false,
                    }}
                    style={[
                        styles.input,
                        { color: theme.colors.surfaceText },
                    ]}
                    {...rest}
                />
            </View>
            {errorMessage ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errorMessage}
                </Text>
            ) : null}
        </View>
    );
};

export default MobileInput;

const styles = StyleSheet.create({
    container: {
        width: Matrix.DIM_100,
        marginBottom: scaleY(15),
        rowGap: scaleY(4),
    },
    label: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterSemiBold,
        marginBottom: scaleY(4),
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: scaleY(48),
    },
    leadingIconContainer: {
        paddingLeft: scaleX(12),
        justifyContent: "center",
    },
    isdContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scaleX(8),
    },
    isdText: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterMedium,
        marginRight: scaleX(4),
    },
    separator: {
        width: scaleX(1),
        height: scaleY(20),
        marginHorizontal: scaleX(6),
    },
    input: {
        flex: 1,
        paddingVertical: scaleY(12),
        paddingRight: scaleX(12),
        fontSize: scaleX(14),
    },
    errorText: {
        fontSize: scaleX(12),
        marginTop: scaleY(4),
    },
});
