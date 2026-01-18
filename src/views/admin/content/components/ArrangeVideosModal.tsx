import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  NestableDraggableFlatList,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GripVertical } from "lucide-react-native";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

const ArrangeVideosModal = ({
  visible,
  videos,
  onClose,
  onSave,
  theme,
}: any) => {
  const { colors } = theme;
  const [localVideos, setLocalVideos] = useState<any[]>([]);

  useEffect(() => {
    setLocalVideos(videos);
  }, [videos]);

  const normalize = (list: any[]) =>
    list.map((v, i) => ({ ...v, position: i + 1 }));

  return (
    <Modal visible={visible} animationType="slide">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: colors.text }]}>
              Arrange Videos
            </Text>

            <TouchableOpacity
              onPress={() => {
                onSave(normalize(localVideos));
                onClose();
              }}
            >
              <Text style={{ color: colors.primary }}>Done</Text>
            </TouchableOpacity>
          </View>

          <NestableDraggableFlatList
            data={localVideos}
            keyExtractor={i => i.id.toString()}
            onDragEnd={({ data }) => setLocalVideos(data)}
            renderItem={({ item, drag, isActive }) => (
              <TouchableOpacity
                onLongPress={drag}
                style={[
                  styles.row,
                  isActive && { backgroundColor: colors.primary + "20" },
                ]}
              >
                <GripVertical size={18} color={colors.primary} />
                <Text
                  numberOfLines={2}
                  style={{ color: colors.text, flex: 1 }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ArrangeVideosModal;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scaleX(16),
  },
  title: {
    fontFamily: FONTS.InterSemiBold,
    fontSize: scaleX(15),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleX(10),
    padding: scaleX(14),
  },
});
