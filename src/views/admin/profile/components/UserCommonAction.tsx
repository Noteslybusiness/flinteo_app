import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { Info, MessageCircle, FileText, LogOut, ChevronRight } from "lucide-react-native";
import { UserSessionService } from "../../../../services/UserSessionService";
import eventEmitter from "../../../../utils/eventEmiter";

interface Props {
    theme: AppTheme;
}

const items = [
    { icon: Info, label: "About Us" },
    { icon: FileText, label: "Terms & Conditions" },
    { icon: MessageCircle, label: "Feedback" },
];

const UserCommonAction: React.FC<Props> = ({ theme }) => {
    const { colors } = theme;

    const handleLogout = () => {
        UserSessionService.logout()
        eventEmitter.emit("user-logout")
    }

    return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>

            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <TouchableOpacity key={index} style={styles.row}>
                        <View style={styles.left}>
                            <Icon size={20} color={colors.primary} />
                            <Text style={[styles.label, { color: colors.text }]}>
                                {item.label}
                            </Text>
                        </View>

                        <ChevronRight size={20} color={colors.surfaceText} />
                    </TouchableOpacity>
                );
            })}

            {/* Logout */}
            <TouchableOpacity style={styles.logoutRow}
                onPress={handleLogout}
            >
                <View style={styles.left}>
                    <LogOut size={20} color={"red"} />
                    <Text style={styles.logoutText}>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default UserCommonAction;

const styles = StyleSheet.create({
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 30,
        // elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
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
    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderTopWidth: 0.5,
        borderColor: "#ddd",
        marginTop: 12,
        justifyContent: "space-between",
    },
    logoutText: {
        marginLeft: 12,
        fontSize: 15,
        color: "red",
        fontWeight: "600",
    },
});
