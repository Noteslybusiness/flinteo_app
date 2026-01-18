import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { scaleX, scaleY } from "../../../../utils/baseDim";

const TYPES = ["Videos", "Reels", "Shorts"];

const TypeModal = ({ visible, onClose, theme }: any) => {
    return (
        <Modal transparent visible={visible} animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View
                        style={[
                            styles.container,
                            { backgroundColor: theme.colors.surface },
                        ]}
                    >
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            Content Types
                        </Text>

                        {TYPES.map((item) => (
                            <TouchableOpacity key={item} style={styles.option}>
                                <Text style={{ color: theme.colors.text }}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity onPress={onClose} style={styles.close}>
                            <Text style={{ color: theme.colors.primary }}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default TypeModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    container: {
        padding: scaleX(20),
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: scaleY(16),
    },
    option: {
        paddingVertical: scaleY(12),
    },
    close: {
        marginTop: scaleY(20),
        alignItems: "center",
    },
});
