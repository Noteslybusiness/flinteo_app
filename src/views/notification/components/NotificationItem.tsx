import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface Props {
    item: any;
    onPress?: (item: any) => void;
    theme: any;
}

const NotificationItem: React.FC<Props> = ({ item, onPress, theme }) => {
    const isUnread = !item.is_read;

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onPress?.(item)}
            style={[
                styles.container,
                {
                    backgroundColor: isUnread
                        ? theme.colors.primaryLight
                        : theme.colors.background,
                },
            ]}
        >
            <View
                style={[
                    styles.iconWrapper,
                    { backgroundColor: theme.colors.primary + "15" },
                ]}
            >
                <Text style={styles.icon}>
                    {getNotificationIcon(item.type)}
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: theme.colors.text,
                                fontWeight: isUnread ? "700" : "600",
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                    {!item.is_read && (
                        <View
                            style={[
                                styles.unreadDot,
                                { backgroundColor: theme.colors.primary },
                            ]}
                        />
                    )}
                </View>
                <Text
                    style={[
                        styles.body,
                        { color: theme.colors.surfaceText },
                    ]}
                    numberOfLines={2}
                >
                    {item.body}
                </Text>
                <Text
                    style={[
                        styles.time,
                        { color: theme.colors.grayField },
                    ]}
                >
                    {formatTime(item.created_at)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default NotificationItem;

/* ---------- helpers ---------- */

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "course_created":
            return "📘";
        case "group_created":
            return "👥";
        default:
            return "🔔";
    }
};

const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
    }) + " • " +
    d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
};

/* ---------- styles ---------- */

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#E5E7EB",
    },

    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    icon: {
        fontSize: 18,
    },

    content: {
        flex: 1,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        flex: 1,
        fontSize: 14,
        marginRight: 6,
    },

    body: {
        fontSize: 13,
        marginTop: 2,
        lineHeight: 18,
    },

    time: {
        fontSize: 11,
        marginTop: 6,
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
