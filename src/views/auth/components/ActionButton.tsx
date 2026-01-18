import React from "react";
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, StyleProp } from "react-native";
import { AppTheme } from "../../../assets/theme/themeContext"; // Assuming themeContext is here
import { Matrix, scaleX, scaleY } from "../../../utils/baseDim";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

interface ButtonProps {
    title: string;
    onPress: () => void;
    theme: AppTheme;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
    variant?: ButtonVariant;
}

const ActionButton: React.FC<ButtonProps> = ({
    title,
    onPress,
    theme,
    buttonStyle,
    textStyle,
    disabled = false,
    variant = 'primary',
}) => {

    let backgroundColor: string;
    let textColor: string;
    let borderColor: string;

    switch (variant) {
        case 'secondary':
            backgroundColor = theme.colors.secondary;
            textColor = theme.colors.onSecondary;
            borderColor = theme.colors.secondary;
            break;
        case 'outline':
            backgroundColor = theme.colors.background; 
            textColor = theme.colors.primary;
            borderColor = theme.colors.primary;
            break;
        case 'text':
            backgroundColor = 'transparent';
            textColor = theme.colors.primary;
            borderColor = 'transparent';
            break;
        case 'primary':
        default:
            backgroundColor = theme.colors.primary;
            textColor = theme.colors.onPrimary;
            borderColor = theme.colors.primary;
            break;
    }

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.buttonBase,
                { 
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: variant === 'outline' ? scaleX(2) : 0,
                    opacity: disabled ? 0.6 : (pressed ? 0.8 : 1),
                },
                buttonStyle
            ]}
        >
            <Text 
                style={[
                    styles.textBase, 
                    { 
                        color: textColor,
                        fontWeight: variant === 'text' ? 'normal' : '600'
                    }, 
                    textStyle
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonBase: {
        width: Matrix.DIM_100,
        paddingVertical: scaleY(10),
        paddingHorizontal: scaleX(20),
        borderRadius: scaleX(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBase: {
        fontSize: scaleX(16),
        textAlign: 'center',
    },
});

export default ActionButton;