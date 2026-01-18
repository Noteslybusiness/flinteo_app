import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { ChevronDown, Check, Globe, Lock } from "lucide-react-native";
import { AppTheme, THEME_COLORS } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

export interface VisibilityOption {
  id: number;
  value: "Public" | "Private";
}

interface Props {
  theme: AppTheme;
  label?: string;
  selectedId?: number;
  errorMessage?: string;
  options: VisibilityOption[];
  onSelect: (id: number) => void;
}

/* derived config */
const visibilityConfig = {
  Public: {
    label: "Public",
    icon: Globe,
    description: "Anyone can view this video",
  },
  Private: {
    label: "Private",
    icon: Lock,
    description: "Only you can view this video",
  },
};

const VideoVisibilityField: React.FC<Props> = ({
  theme,
  label = "Visibility",
  selectedId,
  errorMessage,
  options,
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(o => o.id === selectedId);
  const selectedConfig = selectedOption
    ? visibilityConfig[selectedOption.value]
    : null;

  const borderColor = errorMessage
    ? theme.colors.error
    : theme.colors.border || theme.colors.outline || THEME_COLORS.onPrimary;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.surfaceText }]}>
        {label}
      </Text>

      {/* Field */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[
          styles.inputWrapper,
          { borderColor, backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.valueRow}>
          {selectedConfig && (
            <selectedConfig.icon
              size={18}
              color={theme.colors.surfaceText}
            />
          )}

          <Text
            style={[
              styles.valueText,
              {
                color: selectedConfig
                  ? theme.colors.surfaceText
                  : theme.colors.grayField,
              },
            ]}
          >
            {selectedConfig?.label || "Select visibility"}
          </Text>
        </View>

        <ChevronDown size={20} color={theme.colors.grayField} />
      </TouchableOpacity>

      {errorMessage && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errorMessage}
        </Text>
      )}

      {/* Bottom Modal */}
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
            {label}
          </Text>

          <FlatList
            data={options}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const config = visibilityConfig[item.value];
              const isSelected = item.id === selectedId;
              const Icon = config.icon;

              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    onSelect(item.id);
                    setVisible(false);
                  }}
                >
                  <View style={styles.optionLeft}>
                    <Icon
                      size={20}
                      color={
                        isSelected
                          ? theme.colors.primary
                          : theme.colors.surfaceText
                      }
                    />
                    <View>
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected
                              ? theme.colors.primary
                              : theme.colors.surfaceText,
                          },
                        ]}
                      >
                        {config.label}
                      </Text>
                      <Text style={styles.optionDesc}>
                        {config.description}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
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


const styles = StyleSheet.create({
  container: {
    width: Matrix.DIM_100,
    rowGap: scaleY(4),
  },
  label: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterSemiBold,
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
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleX(8),
  },
  valueText: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterRegular,
  },
  errorText: {
    fontSize: scaleX(12),
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
  optionLeft: {
    flexDirection: "row",
    gap: scaleX(12),
    alignItems: "center",
  },
  optionText: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterSemiBold,
  },
  optionDesc: {
    fontSize: scaleX(12),
    color: "#888",
    marginTop: 2,
  },
});

export default VideoVisibilityField;
