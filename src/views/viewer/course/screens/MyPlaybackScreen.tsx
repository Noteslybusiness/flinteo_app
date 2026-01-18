import React, {
    useContext,
    useRef,
    useState,
    useCallback,
} from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from "react-native";
import Video from "react-native-video";
import Orientation from "react-native-orientation-locker";
import { useFocusEffect, RouteProp } from "@react-navigation/native";

import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { contentService } from "../../../../network/repo/content/ContentService";

type RouteParams = {
    params: {
        videoInfo: {
            id: any;
            video_url: string;
            title?: string;
            duration?: number;
        };
    };
};

const MyPlaybackScreen: React.FC<DefaultScreenProps> = ({ route }) => {
    const theme = useContext(ThemeContext);
    const videoRef = useRef<any>(null);

    const { videoInfo } = (route as RouteProp<RouteParams>).params;
    const [paused, setPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(videoInfo?.duration || 0);
    const [isBuffering, setIsBuffering] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);

    // 🔹 Track last 5s bucket reported
    const lastReportedBucketRef = useRef<number>(0);

    useFocusEffect(
        useCallback(() => {
            setPaused(false);
            return () => {
                setPaused(true);
                Orientation.lockToPortrait();
            };
        }, [])
    );

    const onEveryFiveSeconds = async (playedSeconds: number) => {
        if (duration && playedSeconds) {
            try {
                let payload: any = {}
                payload.action = 'watch'
                payload.content_id = videoInfo?.id
                payload.total_duration_sec = duration || 0
                payload.watch_duration_sec = Math.floor(playedSeconds)
                contentService.postUserContentAction(payload);
            } catch (e) {
                console.log(e)
            }
        }
    };

    const handleProgress = (time: number) => {
        setCurrentTime(time);
        if (paused) return;
        const bucket = Math.floor(time / 5);
        if (bucket > lastReportedBucketRef.current) {
            lastReportedBucketRef.current = bucket;
            onEveryFiveSeconds(time);
        }
    };

    const onSeek = (time: number) => {
        videoRef.current?.seek(time);
        setCurrentTime(time);
    };

    return (
        <BaseView>
            <View style={styles.container}>
                <Video
                    ref={videoRef}
                    source={{ uri: videoInfo.video_url }}
                    style={styles.video}
                    resizeMode="contain"
                    paused={paused}
                    rate={playbackRate}
                    onProgress={e => handleProgress(e.currentTime)}
                    onLoad={e => {
                        setDuration(e.duration);
                        setIsBuffering(false);
                    }}
                    onBuffer={({ isBuffering }) =>
                        setIsBuffering(isBuffering)
                    }
                    controls
                />

                {isBuffering && (
                    <View style={styles.bufferLayer}>
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                    </View>
                )}
            </View>
        </BaseView>
    );
};

export default MyPlaybackScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    video: {
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
    },
    bufferLayer: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
});
