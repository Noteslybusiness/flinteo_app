import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { ChevronDown, Check, FolderPlus, X } from "lucide-react-native";
import { AppTheme, THEME_COLORS } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

/* ===================== TYPES ===================== */

export interface CourseOption {
  id: number;
  value: string;
}

interface Props {
  theme: AppTheme;
  label?: string;
  placeholder?: string;
  options: CourseOption[];
  selectedId?: number | string | null;
  errorMessage?: string;
  onSelect: (option: CourseOption) => void;
  onCreate: (title: string) => void;
}

/* ===================== COMPONENT ===================== */

const CoursePickerField: React.FC<Props> = ({
  theme,
  label = "Course",
  placeholder = "Select course",
  options,
  selectedId,
  errorMessage,
  onSelect,
  onCreate,
}) => {
  const [visible, setVisible] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [title, setTitle] = useState("");

  const selectedOption = options.find(o => o.id === selectedId);

  const borderColor = errorMessage
    ? theme.colors.error
    : theme.colors.border || theme.colors.outline || THEME_COLORS.onPrimary;

  const resetCreate = () => {
    setCreateMode(false);
    setTitle("");
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.surfaceText }]}>
          {label}
        </Text>
      )}

      {/* ===================== FIELD ===================== */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[
          styles.inputWrapper,
          { borderColor, backgroundColor: theme.colors.background },
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

      {/* ===================== MODAL ===================== */}
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={() => {
          resetCreate();
          setVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            resetCreate();
            setVisible(false);
          }}
        />

        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {/* ---------- Header ---------- */}
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: theme.colors.surfaceText },
              ]}
            >
              {createMode ? "Create Course" : label}
            </Text>

            {createMode && (
              <TouchableOpacity onPress={resetCreate}>
                <X size={20} color={theme.colors.grayField} />
              </TouchableOpacity>
            )}
          </View>

          {/* ===================== CREATE MODE ===================== */}
          {createMode ? (
            <>
              <TextInput
                value={title}
                placeholder="Enter course title"
                placeholderTextColor={theme.colors.grayField}
                onChangeText={setTitle}
                style={[
                  styles.input,
                  {
                    color: theme.colors.surfaceText,
                    borderColor,
                  },
                ]}
                autoFocus
              />

              <TouchableOpacity
                disabled={!title.trim()}
                style={[
                  styles.createBtn,
                  {
                    backgroundColor: title.trim()
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
                onPress={() => {
                  onCreate(title.trim());
                  resetCreate();
                  setVisible(false);
                }}
              >
                <Text style={styles.createBtnText}>Create</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* ---------- Create new ---------- */}
              <TouchableOpacity
                style={[
                  styles.createRow,
                  { borderBottomColor: theme.colors.border },
                ]}
                onPress={() => setCreateMode(true)}
              >
                <FolderPlus size={20} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.createText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Create new course
                </Text>
              </TouchableOpacity>

              {/* ---------- List ---------- */}
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
            </>
          )}
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
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    maxHeight: "60%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: scaleX(16),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleY(12),
  },
  modalTitle: {
    fontSize: scaleX(16),
    fontFamily: FONTS.InterSemiBold,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleX(8),
    paddingVertical: scaleY(12),
    borderBottomWidth: 1,
  },
  createText: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterSemiBold,
  },
  optionRow: {
    paddingVertical: scaleY(14),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: scaleX(14),
    fontFamily: FONTS.InterRegular,
  },
  input: {
    borderWidth: scaleX(2),
    borderRadius: scaleX(8),
    padding: scaleX(12),
    marginBottom: scaleY(12),
  },
  createBtn: {
    paddingVertical: scaleY(12),
    borderRadius: scaleX(8),
    alignItems: "center",
  },
  createBtnText: {
    color: "#fff",
    fontFamily: FONTS.InterSemiBold,
    fontSize: scaleX(14),
  },
});

export default CoursePickerField;
