import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import {
    Play,
    Calendar,
    BookOpen,
    Video,
} from "lucide-react-native";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { AppTheme } from "../../../../assets/theme/themeContext";

interface Props {
    item: any;
    theme: AppTheme;
    onPress: () => void;
}

/* ---------------- Status map (Course only) ---------------- */

const STATUS_MAP: any = {
    1: { label: "Draft", color: "#f59e0b" },
    2: { label: "Published", color: "#10b981" },
    3: { label: "Archived", color: "#64748b" },
};

const ExploreContentItem: React.FC<Props> = ({ item, theme, onPress }) => {
    if (item.type === "video") {
        return <VideoCard item={item} theme={theme} onPress={onPress} />;
    }
    return <CourseCard item={item} theme={theme} onPress={onPress} />;
};

export default ExploreContentItem;

const CourseCard = ({ item, theme, onPress }: any) => {
    const status = STATUS_MAP[item.status] || STATUS_MAP[1];

    return (
        <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
            <View style={[styles.courseCard, { backgroundColor: theme.colors.surface }]}>
                {
                    item.thumbnail ? <Image source={{ uri: item.thumbnail }} style={styles.courseThumb} /> :
                        <Image source={require('../../../../assets/images/onlines.png')} style={styles.courseThumb} />
                }


                <View style={styles.courseContent}>
                    <Text
                        numberOfLines={2}
                        style={[styles.title, { color: theme.colors.onSurface }]}
                    >
                        {item.title}
                    </Text>

                    <View style={styles.metaRow}>
                        <Badge
                            icon={BookOpen}
                            label="COURSE"
                            bg={theme.colors.secondaryContainer}
                            color={theme.colors.secondary}
                        />

                        <Badge
                            label={status.label}
                            bg={status.color + "20"}
                            color={status.color}
                        />
                    </View>

                    <DateRow date={item.created_at} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

/* ========================================================= */
/* ======================= VIDEO CARD ====================== */
/* ========================================================= */

const VideoCard = ({ item, theme, onPress }: any) => {
    return (
        <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
            <View style={[styles.videoCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.videoThumbWrapper}>
                    <Image source={{ uri: item.thumbnail }} style={styles.videoThumb} />

                    <View style={styles.videoOverlay}>
                        <Play size={18} color="#fff" />
                    </View>

                    <View style={styles.videoBadge}>
                        <Video size={12} color="#fff" />
                        <Text style={styles.videoBadgeText}>VIDEO</Text>
                    </View>
                </View>

                <View style={styles.videoContent}>
                    <Text
                        numberOfLines={2}
                        style={[styles.title, { color: theme.colors.onSurface }]}
                    >
                        {item.title}
                    </Text>

                    <DateRow date={item.created_at} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

/* ========================================================= */
/* ===================== SHARED UI ========================= */
/* ========================================================= */

const Badge = ({ icon: Icon, label, bg, color }: any) => (
    <View style={[styles.badge, { backgroundColor: bg }]}>
        {Icon && <Icon size={12} color={color} />}
        <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
);

const DateRow = ({ date }: any) => (
    <View style={styles.dateRow}>
        <Calendar size={12} color="#64748b" />
        <Text style={styles.dateText}>{formatDate(date)}</Text>
    </View>
);

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

/* ========================================================= */
/* ======================== STYLES ========================= */
/* ========================================================= */

const styles = StyleSheet.create({
    /* ---------- Course ---------- */

    courseCard: {
        flexDirection: "row",
        padding: scaleX(10),
        borderRadius: scaleX(14),
        marginBottom: scaleY(12),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },

    courseThumb: {
        width: scaleX(110),
        height: scaleY(78),
        borderRadius: scaleX(10),
    },

    courseContent: {
        flex: 1,
        marginLeft: scaleX(12),
    },

    /* ---------- Video ---------- */

    videoCard: {
        borderRadius: scaleX(14),
        marginBottom: scaleY(12),
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },

    videoThumbWrapper: {
        position: "relative",
    },

    videoThumb: {
        width: "100%",
        height: scaleY(140),
    },

    videoOverlay: {
        position: "absolute",
        top: "45%",
        left: "45%",
        width: scaleX(36),
        height: scaleX(36),
        borderRadius: scaleX(18),
        backgroundColor: "rgba(0,0,0,0.55)",
        alignItems: "center",
        justifyContent: "center",
    },

    videoBadge: {
        position: "absolute",
        bottom: scaleY(8),
        right: scaleX(8),
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(4),
        paddingHorizontal: scaleX(8),
        paddingVertical: scaleY(3),
        borderRadius: scaleX(6),
        backgroundColor: "rgba(0,0,0,0.65)",
    },

    videoBadgeText: {
        fontSize: scaleY(11),
        color: "#fff",
        fontWeight: "600",
    },

    videoContent: {
        padding: scaleX(10),
    },

    /* ---------- Shared ---------- */

    title: {
        fontSize: scaleY(14.5),
        fontWeight: "700",
        marginBottom: scaleY(6),
    },

    metaRow: {
        flexDirection: "row",
        gap: scaleX(8),
        marginBottom: scaleY(6),
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(4),
        paddingHorizontal: scaleX(8),
        paddingVertical: scaleY(3),
        borderRadius: scaleX(6),
    },

    badgeText: {
        fontSize: scaleY(11.5),
        fontWeight: "600",
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(4),
    },

    dateText: {
        fontSize: scaleY(11.5),
        color: "#64748b",
        fontWeight: "500",
    },
});
