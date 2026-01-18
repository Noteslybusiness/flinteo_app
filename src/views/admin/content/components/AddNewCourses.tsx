
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Plus, X } from "lucide-react-native";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import { contentService } from "../../../../network/repo/content/ContentService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ===================== PROPS ===================== */
interface Props {
  onCreated?: () => void; // refresh course list after creation
}

/* ===================== COMPONENT ===================== */
const AddNewCourses: React.FC<Props> = ({ onCreated }) => {
  const theme = useContext(ThemeContext);
  const { colors } = theme;
  const inset = useSafeAreaInsets()
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitle("");
    setVisible(false);
  };

  /* ===================== API CALL ===================== */
  const createNewCourse = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Course name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const response = await contentService.createCourseContent({
        title: title.trim(),
        visibility: 1,
      });

      if (response?.data?.result) {
        Alert.alert(
          "Course Created",
          "Your course has been created successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                reset();
                onCreated?.(); // refresh list
              },
            },
          ]
        );
      } else {
        Alert.alert("Failed", "Unable to create course. Please try again.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Something went wrong while creating course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===================== ADD COURSE BUTTON ===================== */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            marginBottom: inset.bottom + scaleY(16),
          },
        ]}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* ===================== MODAL ===================== */}
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={reset}
      >
        <View style={styles.backdrop}>
          <View
            style={[
              styles.modal,
              { backgroundColor: colors.background },
            ]}
          >
            {/* ---------- Header ---------- */}
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: colors.surfaceText },
                ]}
              >
                Create Course
              </Text>

              <TouchableOpacity onPress={reset}>
                <X size={20} color={colors.grayField} />
              </TouchableOpacity>
            </View>

            {/* ---------- Input ---------- */}
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter course name"
              placeholderTextColor={colors.grayField}
              style={[
                styles.input,
                {
                  color: colors.surfaceText,
                  borderColor: colors.border,
                },
              ]}
              autoFocus
            />

            {/* ---------- Create Button ---------- */}
            <TouchableOpacity
              disabled={!title.trim() || loading}
              style={[
                styles.createBtn,
                {
                  backgroundColor: title.trim()
                    ? colors.primary
                    : colors.border,
                },
              ]}
              onPress={createNewCourse}
            >
              <Text style={styles.createBtnText}>
                {loading ? "Creating..." : "Create Course"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddNewCourses;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    // elevation: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: scaleX(16),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleY(12),
  },
  title: {
    fontSize: scaleX(16),
    fontFamily: FONTS.InterSemiBold,
  },
  input: {
    borderWidth: 2,
    borderRadius: scaleX(10),
    padding: scaleX(12),
    fontFamily: FONTS.InterRegular,
    marginBottom: scaleY(16),
  },
  createBtn: {
    paddingVertical: scaleY(14),
    borderRadius: scaleX(10),
    alignItems: "center",
  },
  createBtnText: {
    color: "#fff",
    fontSize: scaleX(14),
    fontFamily: FONTS.InterSemiBold,
  },
});
