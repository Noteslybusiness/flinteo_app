import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { ThumbsUp, MessageCircle, Share2, Eye } from "lucide-react-native";

interface VideoProps {
    theme: AppTheme;
    video: {
        thumbnail: string;
        title: string;
        desc?: string;
        likes?: number;
        comments?: number;
        shares?: number;
        views?: number;
    };
}

const VideoListItem: React.FC<VideoProps> = ({ theme, video }) => {
    const colors = theme.colors;

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                },
            ]}
        >
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />

            <View style={styles.rightSection}>
                <Text style={[styles.title, { color: colors.text }]}>{video.title}</Text>

                <Text style={[styles.desc, { color: colors.surfaceText }]}>
                    {video.desc ?? "This is a sample description for this video."}
                </Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <ThumbsUp size={16} color={colors.text} />
                        <Text style={[styles.metaText, { color: colors.text }]}>
                            {video.likes ?? 120}
                        </Text>
                    </View>

                    <View style={styles.metaItem}>
                        <MessageCircle size={16} color={colors.text} />
                        <Text style={[styles.metaText, { color: colors.text }]}>
                            {video.comments ?? 32}
                        </Text>
                    </View>

                    <View style={styles.metaItem}>
                        <Share2 size={16} color={colors.text} />
                        <Text style={[styles.metaText, { color: colors.text }]}>
                            {video.shares ?? 10}
                        </Text>
                    </View>

                    <View style={styles.metaItem}>
                        <Eye size={16} color={colors.text} />
                        <Text style={[styles.metaText, { color: colors.text }]}>
                            {video.views ?? 850}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default VideoListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 12,
    },
    thumbnail: {
        width: 100,
        height: 70,
        borderRadius: 10,
    },
    rightSection: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    desc: {
        marginTop: 4,
        fontSize: 13,
    },
    metaRow: {
        flexDirection: "row",
        marginTop: 6,
        gap: 18,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        opacity: 0.85,
    },
});
