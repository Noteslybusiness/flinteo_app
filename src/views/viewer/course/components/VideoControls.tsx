import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    PanResponder,
    LayoutChangeEvent,
} from "react-native";
import {
    Play,
    Pause,
    RotateCw,
    Settings,
} from "lucide-react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";

interface Props {
    theme: AppTheme;
    title?: string;
    paused: boolean;
    duration: number;
    currentTime: number;
    playbackRate: number;
    onPlayPause: () => void;
    onSeek: (time: number) => void;
    onRotate: () => void;
    onChangeSpeed: (rate: number) => void;
}

const speeds = [0.5, 1, 1.25, 1.5, 2];

const VideoControls: React.FC<Props> = ({
    theme,
    title,
    paused,
    duration,
    currentTime,
    playbackRate,
    onPlayPause,
    onSeek,
    onRotate,
    onChangeSpeed,
}) => {
    const [sliderWidth, setSliderWidth] = useState(0);
    const [showSpeed, setShowSpeed] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: e => {
                if (!sliderWidth) return;
                const x = e.nativeEvent.locationX;
                const pct = Math.min(Math.max(x / sliderWidth, 0), 1);
                onSeek(pct * duration);
            },
        })
    ).current;

    const format = (t: number) =>
        `${Math.floor(t / 60)}:${`${Math.floor(t % 60)}`.padStart(2, "0")}`;

    return (
        <View style={styles.overlay}>
            {/* TOP BAR */}
            <View style={styles.topBar}>
                <Text
                    numberOfLines={1}
                    style={[
                        styles.title,
                        { color: theme.colors.text },
                    ]}
                >
                    {title}
                </Text>
            </View>

            {/* BOTTOM CONTROLS */}
            <View style={styles.bottomBar}>
                {/* SLIDER */}
                <View
                    style={styles.sliderWrapper}
                    onLayout={(e: LayoutChangeEvent) =>
                        setSliderWidth(e.nativeEvent.layout.width)
                    }
                    {...panResponder.panHandlers}
                >
                    <View
                        style={[
                            styles.progress,
                            {
                                width: `${
                                    (currentTime / duration) * 100
                                }%`,
                                backgroundColor:
                                    theme.colors.primary,
                            },
                        ]}
                    />
                </View>

                {/* TIME + CONTROLS */}
                <View style={styles.controlsRow}>
                    <Text style={styles.time}>
                        {format(currentTime)} / {format(duration)}
                    </Text>

                    <TouchableOpacity onPress={onPlayPause}>
                        {paused ? (
                            <Play color="#fff" size={28} />
                        ) : (
                            <Pause color="#fff" size={28} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onRotate}>
                        <RotateCw color="#fff" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowSpeed(s => !s)}
                    >
                        <Settings color="#fff" size={24} />
                    </TouchableOpacity>
                </View>

                {/* SPEED MENU */}
                {showSpeed && (
                    <View style={styles.speedBox}>
                        {speeds.map(s => (
                            <TouchableOpacity
                                key={s}
                                onPress={() => {
                                    onChangeSpeed(s);
                                    setShowSpeed(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.speedText,
                                        s === playbackRate && {
                                            color:
                                                theme.colors.primary,
                                        },
                                    ]}
                                >
                                    {s}x
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

export default VideoControls;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: "space-between",
    },
    topBar: {
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    bottomBar: {
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 12,
    },
    sliderWrapper: {
        height: 4,
        backgroundColor: "#555",
        borderRadius: 2,
        overflow: "hidden",
    },
    progress: {
        height: 4,
    },
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
    },
    time: {
        color: "#fff",
        fontSize: 12,
    },
    speedBox: {
        position: "absolute",
        right: 10,
        bottom: 60,
        backgroundColor: "#111",
        padding: 8,
        borderRadius: 6,
    },
    speedText: {
        color: "#fff",
        paddingVertical: 6,
        fontSize: 14,
    },
});
