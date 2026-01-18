import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
    BarChart2,
    Eye,
    Play,
    VideoOff,
    Plus,
} from "lucide-react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import VideoSectionShimmer from "../shimmer/VideoSectionShimmer";

interface VideoItem {
    id: string | number;
    thumbnail: string;
    slug: string;
    title?: string;
    total_views?: number;
}

interface VideoSectionProps {
    theme: AppTheme;
    title: string;
    videos: VideoItem[];
    onItemClick?: (slug: string) => void;
    onViewAll?: () => void;
    loading?: boolean;

    /* 🔹 Empty State Action */
    onEmptyAction?: () => void;
    emptyActionText?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
    theme,
    title,
    videos,
    onItemClick,
    onViewAll,
    loading,
    onEmptyAction,
    emptyActionText = "Add Video",
}) => {
    const { colors } = theme;

    /* ---------------- Loading ---------------- */
    if (loading) {
        return <VideoSectionShimmer theme={theme} />;
    }

    /* ---------------- Empty State ---------------- */
    if (!loading && videos.length === 0) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.headerSection}>
                    <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
                        {title}
                    </Text>
                </View>

                <View
                    style={[
                        styles.emptyContainer,
                        { backgroundColor: colors.surface },
                    ]}
                >
                    <View
                        style={[
                            styles.emptyIconWrapper,
                            { backgroundColor: colors.background },
                        ]}
                    >
                        <VideoOff size={28} color={colors.onSurfaceVariant} />
                    </View>

                    <Text
                        style={[
                            styles.emptyTitle,
                            { color: colors.onSurface },
                        ]}
                    >
                        No videos available
                    </Text>

                    <Text
                        style={[
                            styles.emptySubtitle,
                            { color: colors.onSurfaceVariant },
                        ]}
                    >
                        Videos will appear here once uploaded
                    </Text>

                    {onEmptyAction && (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={onEmptyAction}
                            style={[
                                styles.emptyButton,
                                { backgroundColor: colors.primary },
                            ]}
                        >
                            <Plus size={16} color="#fff" />
                            <Text style={styles.emptyButtonText}>
                                {emptyActionText}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    /* ---------------- Content ---------------- */
    return (
        <View style={styles.wrapper}>
            {/* HEADER */}
            <View style={styles.headerSection}>
                <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
                    {title}
                </Text>

                <TouchableOpacity
                    onPress={onViewAll}
                    style={styles.insightBtn}
                    activeOpacity={0.7}
                >
                    <BarChart2 size={16} color={colors.primary} />
                    <Text
                        style={[
                            styles.insightText,
                            { color: colors.primary },
                        ]}
                    >
                        View All
                    </Text>
                </TouchableOpacity>
            </View>

            {/* LIST */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            >
                {videos.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.85}
                        style={styles.cardWrapper}
                        onPress={() => onItemClick?.(item.slug)}
                    >
                        <View style={styles.videoCard}>
                            <Image
                                source={{ uri: item.thumbnail }}
                                style={styles.thumbnail}
                            />

                            <LinearGradient
                                colors={["rgba(0,0,0,0.45)", "transparent"]}
                                style={styles.gradientOverlay}
                            />

                            {item.title && (
                                <Text
                                    numberOfLines={1}
                                    style={styles.videoTitle}
                                >
                                    {item.title}
                                </Text>
                            )}

                            <View style={styles.playIconWrapper}>
                                <Play size={22} color="#fff" />
                            </View>

                            <View style={styles.viewSection}>
                                <Eye size={14} color="#fff" />
                                <Text style={styles.viewText}>
                                    {item.total_views || 0}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default VideoSection;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    wrapper: {
        width: Matrix.DIM_100,
        paddingBottom: scaleY(10),
    },

    headerSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scaleX(16),
        marginBottom: scaleY(6),
    },

    headerTitle: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterSemiBold,
        fontWeight: "700",
    },

    insightBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
    },

    insightText: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterMedium,
    },

    listContainer: {
        paddingHorizontal: scaleX(12),
        paddingTop: scaleX(8),
    },

    cardWrapper: {
        marginRight: scaleX(12),
    },

    videoCard: {
        width: scaleX(200),
        height: scaleY(100),
        borderRadius: scaleX(14),
        overflow: "hidden",
        backgroundColor: "#000",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: Platform.OS === "ios" ? 0.25 : 0,
        shadowRadius: 8,
    },

    thumbnail: {
        width: "100%",
        height: "100%",
    },

    gradientOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "55%",
    },

    videoTitle: {
        position: "absolute",
        top: scaleY(10),
        left: scaleX(12),
        right: scaleX(40),
        fontSize: scaleY(14),
        color: "#fff",
        fontFamily: FONTS.InterMedium,
    },

    playIconWrapper: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -22 }, { translateY: -22 }],
        width: scaleX(44),
        height: scaleX(44),
        borderRadius: scaleX(22),
        backgroundColor: "rgba(0,0,0,0.55)",
        alignItems: "center",
        justifyContent: "center",
    },

    viewSection: {
        position: "absolute",
        bottom: scaleY(10),
        right: scaleX(10),
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: scaleX(8),
        paddingVertical: scaleY(3),
        borderRadius: scaleX(6),
    },

    viewText: {
        color: "#fff",
        fontSize: scaleY(12),
        fontWeight: "600",
    },

    /* -------- Empty State -------- */

    emptyContainer: {
        height: scaleY(140),
        marginHorizontal: scaleX(16),
        borderRadius: scaleX(14),
        alignItems: "center",
        justifyContent: "center",
        gap: scaleY(6),
    },

    emptyIconWrapper: {
        width: scaleX(48),
        height: scaleX(48),
        borderRadius: scaleX(24),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: scaleY(6),
    },

    emptyTitle: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterSemiBold,
    },

    emptySubtitle: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterRegular,
        textAlign: "center",
    },

    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
        paddingHorizontal: scaleX(14),
        paddingVertical: scaleY(8),
        borderRadius: scaleX(20),
        marginTop: scaleY(8),
    },

    emptyButtonText: {
        color: "#fff",
        fontSize: scaleY(13),
        fontFamily: FONTS.InterMedium,
    },
});
