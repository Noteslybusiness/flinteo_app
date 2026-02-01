import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { Film, Clock, PlusCircle, AlertCircle, ChevronRight } from "lucide-react-native";

interface Props {
    theme: AppTheme;
    onActionPress: (action: string) => void;
}

const actions = [
    // { icon: Film, label: "My Contents" },
    { icon: Clock, label: "Archive Contents" },
    { icon: PlusCircle, label: "New Video" },
    { icon: AlertCircle, label: "Raise an Issue" },
];

const CreatorActionsCard: React.FC<Props> = ({ theme, onActionPress }) => {
    const { colors } = theme;

    return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.text }]}>Actions</Text>

            {actions.map((a, index) => {
                const Icon = a.icon;
                return (
                    <TouchableOpacity key={index} style={styles.row} onPress={() => onActionPress(a.label)}>
                        <View style={styles.left}>
                            <Icon size={20} color={colors.primary} />
                            <Text style={[styles.label, { color: colors.text }]}>{a.label}</Text>
                        </View>

                        <ChevronRight size={20} color={colors.surfaceText} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CreatorActionsCard;

const styles = StyleSheet.create({
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        // elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 15,
        marginLeft: 12,
    },
});
