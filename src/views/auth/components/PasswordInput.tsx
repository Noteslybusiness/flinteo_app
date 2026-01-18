import React, { useState } from "react";
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
import { Lock, Eye, EyeOff } from "lucide-react-native";

interface FormInputProps
    extends Omit<
        TextInputProps,
        "style" | "onChangeText" | "value" | "keyboardType" | "secureTextEntry"
    > {
    containerStyles?: ViewStyle;
    onChangeText?: (text: string) => void;
    value?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    theme: AppTheme;
    errorMessage?: string;
    label?: string;
}

const PasswordInput: React.FC<FormInputProps> = ({
    containerStyles = {},
    onChangeText,
    value,
    placeholder,
    secureTextEntry = true,
    theme,
    errorMessage,
    label = "Password",
    ...rest
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputBorderColor = errorMessage
        ? theme.colors.error
        : theme.colors.border || theme.colors.outline || THEME_COLORS.onPrimary;

    const inputPaddingLeft = scaleX(10);

    const isSecure = secureTextEntry && !isPasswordVisible;

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
                {/* Left Icon */}
                <View style={styles.leadingIconContainer}>
                    <Lock
                        color={theme.colors.grayField}
                        strokeWidth={1.3}
                    />
                </View>

                {/* Input */}
                <TextInput
                    value={value}
                    placeholder={placeholder || `Enter your ${label}`}
                    onChangeText={onChangeText}
                    secureTextEntry={isSecure}
                    keyboardType="default"
                    accessibilityLabel={label}
                    accessibilityState={{
                        disabled: rest.editable === false,
                    }}
                    style={[
                        styles.input,
                        {
                            color: theme.colors.surfaceText,
                            paddingLeft: inputPaddingLeft,
                        },
                    ]}
                    {...rest}
                />

                {/* Show / Hide Password */}
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.trailingIconContainer}
                        onPress={() =>
                            setIsPasswordVisible(prev => !prev)
                        }
                        activeOpacity={0.7}
                    >
                        {isPasswordVisible ? (
                            <EyeOff
                                color={theme.colors.grayField}
                                strokeWidth={1.3}
                                width={scaleX(20)}
                                height={scaleY(20)}
                            />
                        ) : (
                            <Eye
                                color={theme.colors.grayField}
                                strokeWidth={1.3}
                                width={scaleX(20)}
                                height={scaleY(20)}
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {errorMessage ? (
                <Text
                    style={[
                        styles.errorText,
                        { color: theme.colors.error },
                    ]}
                >
                    {errorMessage}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Matrix.DIM_100,
        marginBottom: scaleY(15),
        rowGap: scaleY(4),
    },
    label: {
        fontSize: scaleX(14),
        fontWeight: "600",
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
    trailingIconContainer: {
        paddingHorizontal: scaleX(12),
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        flex: 1,
        paddingVertical: scaleY(12),
        paddingRight: scaleX(4),
    },
    errorText: {
        fontSize: scaleX(12),
        marginTop: scaleY(4),
    },
});

export default PasswordInput;
