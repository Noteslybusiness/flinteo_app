import React, { useRef } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
} from "react-native";
import { AppTheme, THEME_COLORS } from "../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../utils/baseDim";
import { FONTS } from "../../../assets/theme/appFonts";

interface OtpInputProps {
    theme: AppTheme;
    value: string;
    length?: number;
    onChangeText: (text: string) => void;
    containerStyles?: ViewStyle;
    errorMessage?: string;
    label?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
    theme,
    value,
    onChangeText,
    length = 4,
    containerStyles = {},
    errorMessage,
    label = "OTP",
}) => {
    const inputs = useRef<TextInput[]>([]);

    const inputBorderColor = errorMessage
        ? theme.colors.error
        : theme.colors.border || theme.colors.outline || THEME_COLORS.onPrimary;

    const handleChange = (text: string, index: number) => {
        const otpArray = value.split("");
        otpArray[index] = text.replace(/[^0-9]/g, "");

        const newOtp = otpArray.join("").slice(0, length);
        onChangeText(newOtp);

        if (text && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (index: number) => {
        if (!value[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={[styles.container, containerStyles]}>
            {label && (
                <Text style={[styles.label, { color: theme.colors.surfaceText }]}>
                    {label}
                </Text>
            )}

            <View style={styles.otpRow}>
                {Array.from({ length }).map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => {
                            if (ref) inputs.current[index] = ref;
                        }}
                        value={value[index] || ""}
                        keyboardType="number-pad"
                        maxLength={1}
                        onChangeText={(text) =>
                            handleChange(text, index)
                        }
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === "Backspace") {
                                handleBackspace(index);
                            }
                        }}
                        style={[
                            styles.otpBox,
                            {
                                borderColor: inputBorderColor,
                                color: theme.colors.surfaceText,
                                backgroundColor: theme.colors.background,
                            },
                        ]}
                        textAlign="center"
                    />
                ))}
            </View>

            {errorMessage ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errorMessage}
                </Text>
            ) : null}
        </View>
    );
};

export default OtpInput;

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
    otpRow: {
        flexDirection: "row",
        columnGap: scaleX(12),
    },
    otpBox: {
        width: scaleX(48),
        height: scaleY(48),
        borderWidth: scaleX(2),
        borderRadius: scaleX(8),
        fontSize: scaleX(18),
        fontFamily: FONTS.InterRegular,
    },
    errorText: {
        fontSize: scaleX(12),
        marginTop: scaleY(4),
    },
});
