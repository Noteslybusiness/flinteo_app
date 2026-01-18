import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { AppTheme, THEME_COLORS } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

interface FormInputProps
  extends Omit<
    TextInputProps,
    | "style"
    | "onChangeText"
    | "value"
    | "keyboardType"
    | "secureTextEntry"
  > {
  containerStyles?: ViewStyle;
  onChangeText?: (text: string) => void;
  value?: string;
  placeholder?: string;
  theme: AppTheme;
  errorMessage?: string;
  label?: string;
}

const InputTextField: React.FC<FormInputProps> = ({
  containerStyles = {},
  onChangeText,
  value,
  placeholder,
  theme,
  errorMessage,
  label = "Title",
  ...rest
}) => {
  const inputBorderColor = errorMessage
    ? theme.colors.error
    : theme.colors.border || theme.colors.outline || THEME_COLORS.onPrimary;


  const inputPaddingLeft = scaleX(10);

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
        <TextInput
          value={value}
          placeholder={placeholder || `Enter ${label}`}
          onChangeText={onChangeText}
          keyboardType="default"
          accessibilityLabel={label}
          accessibilityState={{ disabled: rest.editable === false }}
          style={[
            styles.input,
            {
              color: theme.colors.surfaceText,
              paddingLeft: inputPaddingLeft,
            },
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

const styles = StyleSheet.create({
  container: {
    width: Matrix.DIM_100,
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
  input: {
    flex: 1,
    paddingVertical: scaleY(12),
    paddingRight: scaleX(12),
  },
  errorText: {
    fontSize: scaleX(12),
    marginTop: scaleY(4),
  },
});

export default InputTextField;
