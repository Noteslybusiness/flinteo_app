import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    Pressable,
} from "react-native";
import Video from "react-native-video";
import { useEffect, useState } from "react";
import { Matrix, scaleY, VIDEO_VIEWPORT_HEIGHT } from "../../../../utils/baseDim";
import {
    Heart,
    MessageCircle,
    Share2,
    Eye,
    MoreVertical,
    Play,
} from "lucide-react-native";

interface Props {
    item: any;
    index: number;
    activeIndex: number;
    onAction: (action: string) => void;
}

const VideoPlaybackItem: React.FC<Props> = ({
    item,
    index,
    activeIndex,
    onAction
}) => {
    const shouldRenderVideo =
        index === activeIndex || index === activeIndex + 1;

    const [paused, setPaused] = useState(true);
    const [liked, setLiked] = useState(item?.is_liked ?? false);

    useEffect(() => {
        setPaused(index !== activeIndex);
    }, [activeIndex, index]);

    return (
        <View style={styles.container}>
            {shouldRenderVideo && (
                <View style={styles.videoWrapper}>
                    <Video
                        source={{ uri: item?.url }}
                        style={[styles.video]}
                        resizeMode="contain"
                        poster={item?.thumbnail}
                        repeat
                        paused={paused}
                        muted={false}
                        controls={false}
                    />
                    {/* FULL SCREEN TAP LAYER */}
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setPaused(p => !p)}
                    />
                    {/* PLAY ICON (only when paused) */}
                    {paused && (
                        <View style={styles.playOverlay} pointerEvents="none">
                            <View style={styles.playButton}>
                                <Play size={42} color="#fff" fill="#fff" />
                            </View>
                        </View>
                    )}
                </View>
            )}
            {/* RIGHT SIDE ACTIONS */}
            <View style={styles.actionsContainer}>
                <TouchableWithoutFeedback onPress={() => {
                    setLiked(!liked)
                    onAction(liked ? '' : 'like')
                }}>
                    <View style={styles.actionItem}>
                        <Heart
                            size={28}
                            color={liked ? "#ff2d55" : "#fff"}
                            fill={liked ? "#ff2d55" : "transparent"}
                        />
                        <Text style={styles.actionText}>
                            {item?.total_likes ?? 0}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.actionItem}>
                    <MessageCircle size={28} color="#fff" />
                    <Text style={styles.actionText}>
                        {item?.total_comments ?? 0}
                    </Text>
                </View>

                <View style={styles.actionItem}>
                    <Share2 size={28} color="#fff" />
                    <Text style={styles.actionText}>
                        {item?.total_shares ?? 0}
                    </Text>
                </View>

                <View style={styles.actionItem}>
                    <Eye size={28} color="#fff" />
                    <Text style={styles.actionText}>
                        {item?.total_views ?? 0}
                    </Text>
                </View>

                <View style={styles.actionItem}>
                    <MoreVertical size={26} color="#fff" />
                </View>
            </View>

            {/* BOTTOM META */}
            <View style={styles.bottomContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {item?.title ?? "Untitled video"}
                </Text>
                <Text style={styles.subText} numberOfLines={1} ellipsizeMode="tail">
                    {item?.description || ""}
                </Text>
            </View>
        </View>
    );
};

export default VideoPlaybackItem;

const styles = StyleSheet.create({
    container: {
        height: VIDEO_VIEWPORT_HEIGHT,
        width: Matrix.DIM_100,
        overflow: "hidden"
    },

    /* RIGHT ACTIONS */
    actionsContainer: {
        position: "absolute",
        right: 12,
        bottom: scaleY(80),
        alignItems: "center",
    },
    actionItem: {
        marginBottom: 22,
        alignItems: "center",
    },
    actionText: {
        color: "#fff",
        fontSize: 12,
        marginTop: 4,
    },

    /* BOTTOM INFO */
    bottomContainer: {
        position: "absolute",
        left: 12,
        bottom: 40,
        width: "75%",
    },
    title: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    subText: {
        color: "#ccc",
        fontSize: 12,
        marginTop: 4,
    },
    videoWrapper: {
        height: VIDEO_VIEWPORT_HEIGHT,
        width: "100%",
        backgroundColor: "#000",
    },

    video: {
        height: "100%",
        width: "100%",
    },

    playOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});
