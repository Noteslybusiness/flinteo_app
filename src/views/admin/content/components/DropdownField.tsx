import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { AppTheme, THEME_COLORS } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

/* ===================== TYPES ===================== */

export interface DropdownOption {
  id: number;
  value: string;
}

interface Props {
  theme: AppTheme;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedId?: number | string | null;
  errorMessage?: string;
  onSelect: (option: DropdownOption) => void;
}

/* ===================== COMPONENT ===================== */

const DropdownField: React.FC<Props> = ({
  theme,
  label,
  placeholder = "Select",
  options,
  selectedId,
  errorMessage,
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(o => o.id === selectedId);

  const borderColor = errorMessage
    ? theme.colors.error
    : theme.colors.border || theme.colors.outline || THEME_COLORS.onPrimary;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.surfaceText }]}>
          {label}
        </Text>
      )}

      {/* ===================== FIELD ===================== */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.valueText,
            {
              color: selectedOption
                ? theme.colors.surfaceText
                : theme.colors.grayField,
            },
          ]}
        >
          {selectedOption?.value || placeholder}
        </Text>

        <ChevronDown size={20} color={theme.colors.grayField} />
      </TouchableOpacity>

      {errorMessage && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errorMessage}
        </Text>
      )}

      {/* ===================== MODAL ===================== */}
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />

        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.surfaceText }]}>
            {label || "Select option"}
          </Text>

          <FlatList
            data={options}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const selected = item.id === selectedId;

              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: selected
                          ? theme.colors.primary
                          : theme.colors.surfaceText,
                      },
                    ]}
                  >
                    {item.value}
                  </Text>

                  {selected && (
                    <Check size={18} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

/* ===================== STYLES ===================== */

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
    minHeight: scaleY(48),
    borderWidth: scaleX(2),
    borderRadius: scaleX(8),
    paddingHorizontal: scaleX(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterRegular,
  },
  errorText: {
    fontSize: scaleX(12),
    marginTop: scaleY(4),
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    maxHeight: "45%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: scaleX(16),
  },
  modalTitle: {
    fontSize: scaleX(16),
    fontFamily: FONTS.InterSemiBold,
    marginBottom: scaleY(12),
  },
  optionRow: {
    paddingVertical: scaleY(14),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterRegular,
  },
});

export default DropdownField;
