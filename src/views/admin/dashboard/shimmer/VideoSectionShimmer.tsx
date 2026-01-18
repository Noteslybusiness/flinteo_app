


import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Animated,
    Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { AppTheme } from "../../../../assets/theme/themeContext";

/* ───────────────── SHIMMER BAR ───────────────── */

const ShimmerBar = ({
    width,
    height,
    radius = 8,
    baseColor,
    highlightColor,
}: {
    width: number;
    height: number;
    radius?: number;
    baseColor: string;
    highlightColor: string;
}) => {
    const translateX = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translate = translateX.interpolate({
        inputRange: [-1, 1],
        outputRange: [-width, width],
    });

    return (
        <View
            style={{
                width,
                height,
                borderRadius: radius,
                backgroundColor: baseColor,
                overflow: "hidden",
            }}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    { transform: [{ translateX: translate }] },
                ]}
            >
                <LinearGradient
                    colors={[baseColor, highlightColor, baseColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    );
};

/* ───────────── VIDEO SECTION SHIMMER ───────────── */

interface Props {
    theme: AppTheme;
}

const VideoSectionShimmer: React.FC<Props> = ({ theme }) => {
    const { colors } = theme;

    const baseColor = colors.surface;
    const highlightColor = colors.border || colors.secondary;

    return (
        <View style={styles.wrapper}>
            {/* Header */}
            <View style={styles.headerSection}>
                <ShimmerBar
                    width={scaleX(140)}
                    height={scaleY(18)}
                    radius={6}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                />
                <ShimmerBar
                    width={scaleX(90)}
                    height={scaleY(14)}
                    radius={6}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                />
            </View>

            {/* Video Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            >
                {[1, 2, 3].map((_, index) => (
                    <View key={index} style={styles.cardWrapper}>
                        <View
                            style={[
                                styles.videoCard,
                                { backgroundColor: colors.surface },
                            ]}
                        >
                            {/* title shimmer */}
                            <View style={styles.titleWrapper}>
                                <ShimmerBar
                                    width={scaleX(120)}
                                    height={scaleY(14)}
                                    radius={6}
                                    baseColor={baseColor}
                                    highlightColor={highlightColor}
                                />
                            </View>

                            {/* play button shimmer */}
                            <View style={styles.playWrapper}>
                                <ShimmerBar
                                    width={scaleX(44)}
                                    height={scaleX(44)}
                                    radius={scaleX(22)}
                                    baseColor={baseColor}
                                    highlightColor={highlightColor}
                                />
                            </View>

                            {/* views shimmer */}
                            <View style={styles.viewWrapper}>
                                <ShimmerBar
                                    width={scaleX(50)}
                                    height={scaleY(14)}
                                    radius={6}
                                    baseColor={baseColor}
                                    highlightColor={highlightColor}
                                />
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default VideoSectionShimmer;

/* ───────────────── STYLES ───────────────── */

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
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: Platform.OS === "ios" ? 0.25 : 0,
        shadowRadius: 8,
        margin: 4
    },

    titleWrapper: {
        position: "absolute",
        top: scaleY(10),
        left: scaleX(12),
    },

    playWrapper: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -22 }, { translateY: -22 }],
    },

    viewWrapper: {
        position: "absolute",
        bottom: scaleY(10),
        right: scaleX(10),
    },
});
