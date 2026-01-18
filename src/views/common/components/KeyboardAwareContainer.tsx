import React, { ReactNode, useContext } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { ThemeContext } from "../../../assets/theme/themeContext";

interface Props {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
}

const KeyboardAwareContainer: React.FC<Props> = ({
  children,
  contentContainerStyle,
}) => {
  const { height } = useWindowDimensions();
  const theme = useContext(ThemeContext)

  /**
   * Why this works:
   * - iOS uses padding → safest
   * - Android uses height → avoids jump bugs
   * - Dynamic window height prevents hardcoded offsets
   */
  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? height * 0.04 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          contentContainerStyle,
          { backgroundColor: theme.colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", // 👈 key fix
    paddingBottom: 24,        // 👈 avoids keyboard overlap
  },
});

export default KeyboardAwareContainer;
