import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Eye, Play, VideoOff, Plus } from "lucide-react-native";

import { AppTheme } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import RecentVideosSectionShimmer from "../shimmer/RecentVideosSectionShimmer";

interface Author {
    first_name: string;
    last_name: string;
    profile_image?: string;
}

interface VideoItem {
    id: string | number;
    thumbnail?: string;
    slug: string;
    title?: string;
    description?: string;
    total_views?: number;
    author?: Author;
}

interface RecentVideosSectionProps {
    theme: AppTheme;
    videos: VideoItem[];
    onItemClick?: (slug: string) => void;
    loading?: boolean;

    /* 🔹 Empty state action */
    onEmptyAction?: () => void;
    emptyActionText?: string;
}

const RecentVideosSection: React.FC<RecentVideosSectionProps> = ({
    theme,
    videos,
    onItemClick,
    loading,
    onEmptyAction,
    emptyActionText = "Add Video",
}) => {
    const { colors } = theme;
    const [recentVideos, setRecentVideos] = useState<VideoItem[]>([]);

    useEffect(() => {
        setRecentVideos(videos || []);
    }, [videos]);

    /* ---------------- Loading ---------------- */
    if (loading) {
        return <RecentVideosSectionShimmer theme={theme} />;
    }

    /* ---------------- Empty State ---------------- */
    if (!loading && recentVideos.length === 0) {
        return (
            <View style={styles.wrapper}>
                <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
                    Recent Videos
                </Text>

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
                        No recent videos
                    </Text>

                    <Text
                        style={[
                            styles.emptySubtitle,
                            { color: colors.onSurfaceVariant },
                        ]}
                    >
                        Videos you upload will appear here
                    </Text>

                    {onEmptyAction && (
                        <TouchableOpacity
                            onPress={onEmptyAction}
                            activeOpacity={0.8}
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
            <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
                Recent Videos
            </Text>

            {recentVideos.map((video) => (
                <TouchableOpacity
                    key={video.id}
                    activeOpacity={0.85}
                    onPress={() => onItemClick?.(video.slug)}
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.thumbnailWrap}>
                        <Image
                            source={{ uri: video.thumbnail }}
                            style={styles.thumbnail}
                        />
                        <View style={styles.playIcon}>
                            <Play size={18} color="#fff" />
                        </View>
                    </View>

                    <View style={styles.content}>
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.title,
                                { color: colors.surfaceText },
                            ]}
                        >
                            {video.title}
                        </Text>

                        {video.description ? (
                            <Text
                                numberOfLines={2}
                                style={[
                                    styles.description,
                                    { color: colors.surfaceText },
                                ]}
                            >
                                {video.description}
                            </Text>
                        ) : null}

                        <View style={styles.metaRow}>
                            {video.author ? (
                                <View style={styles.authorRow}>
                                    <Image
                                        source={{
                                            uri: video.author.profile_image,
                                        }}
                                        style={styles.avatar}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.authorName,
                                            {
                                                color: colors.surfaceText,
                                            },
                                        ]}
                                    >
                                        {video.author.first_name}{" "}
                                        {video.author.last_name}
                                    </Text>
                                </View>
                            ) : null}

                            <View style={styles.viewRow}>
                                <Eye
                                    size={14}
                                    color={colors.secondary}
                                />
                                <Text
                                    style={[
                                        styles.viewText,
                                        {
                                            color: colors.surfaceText,
                                        },
                                    ]}
                                >
                                    {video.total_views || 0}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default RecentVideosSection;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    wrapper: {
        width: Matrix.DIM_100,
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(12),
    },

    headerTitle: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterSemiBold,
        marginBottom: scaleY(12),
    },

    card: {
        flexDirection: "row",
        borderRadius: scaleX(12),
        marginBottom: scaleY(12),
        overflow: "hidden",
        borderWidth: 0.5,
    },

    thumbnailWrap: {
        width: scaleX(120),
        height: scaleY(90),
        backgroundColor: "#000",
    },

    thumbnail: {
        width: "100%",
        height: "100%",
    },

    playIcon: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -16 }, { translateY: -16 }],
        width: scaleX(32),
        height: scaleX(32),
        borderRadius: scaleX(16),
        backgroundColor: "rgba(0,0,0,0.7)",
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        flex: 1,
        padding: scaleX(10),
        justifyContent: "space-between",
    },

    title: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterSemiBold,
    },

    description: {
        fontSize: scaleY(12),
        lineHeight: scaleY(16),
        marginTop: scaleY(2),
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: scaleY(6),
    },

    authorRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
        flex: 1,
    },

    avatar: {
        width: scaleX(20),
        height: scaleX(20),
        borderRadius: scaleX(10),
        backgroundColor: "#1e293b",
    },

    authorName: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterMedium,
    },

    viewRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(4),
    },

    viewText: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterMedium,
    },

    /* -------- Empty State -------- */

    emptyContainer: {
        borderRadius: scaleX(14),
        paddingVertical: scaleY(24),
        alignItems: "center",
        justifyContent: "center",
        gap: scaleY(8),
    },

    emptyIconWrapper: {
        width: scaleX(48),
        height: scaleX(48),
        borderRadius: scaleX(24),
        alignItems: "center",
        justifyContent: "center",
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
