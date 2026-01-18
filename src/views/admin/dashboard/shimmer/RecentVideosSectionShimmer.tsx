
import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { AppTheme } from "../../../../assets/theme/themeContext";

/* ───────────────── SHIMMER BAR ───────────────── */

const ShimmerBar = ({
    width,
    height,
    radius = 6,
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

/* ───────────── RECENT VIDEOS SHIMMER ───────────── */

interface Props {
    theme: AppTheme;
}

const RecentVideosSectionShimmer: React.FC<Props> = ({ theme }) => {
    const { colors } = theme;

    const baseColor = colors.surface;
    const highlightColor = colors.border || colors.secondary;

    return (
        <View style={styles.wrapper}>
            {/* Header */}
            <ShimmerBar
                width={scaleX(140)}
                height={scaleY(18)}
                baseColor={baseColor}
                highlightColor={highlightColor}
            />

            {/* Cards */}
            {[1, 2, 3].map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    {/* Thumbnail */}
                    <View style={styles.thumbnailWrap}>
                        <ShimmerBar
                            width={scaleX(120)}
                            height={scaleY(90)}
                            radius={0}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />

                        {/* Play icon */}
                        <View style={styles.playWrapper}>
                            <ShimmerBar
                                width={scaleX(32)}
                                height={scaleX(32)}
                                radius={scaleX(16)}
                                baseColor={baseColor}
                                highlightColor={highlightColor}
                            />
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <ShimmerBar
                            width={scaleX(160)}
                            height={scaleY(14)}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />
                        <ShimmerBar
                            width={scaleX(180)}
                            height={scaleY(12)}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />
                        <ShimmerBar
                            width={scaleX(130)}
                            height={scaleY(12)}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />

                        <View style={styles.metaRow}>
                            <View style={styles.authorRow}>
                                <ShimmerBar
                                    width={scaleX(20)}
                                    height={scaleX(20)}
                                    radius={scaleX(10)}
                                    baseColor={baseColor}
                                    highlightColor={highlightColor}
                                />
                                <ShimmerBar
                                    width={scaleX(70)}
                                    height={scaleY(12)}
                                    baseColor={baseColor}
                                    highlightColor={highlightColor}
                                />
                            </View>

                            <ShimmerBar
                                width={scaleX(40)}
                                height={scaleY(12)}
                                baseColor={baseColor}
                                highlightColor={highlightColor}
                            />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default RecentVideosSectionShimmer;

/* ───────────────── STYLES ───────────────── */

const styles = StyleSheet.create({
    wrapper: {
        width: Matrix.DIM_100,
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(12),
    },

    card: {
        flexDirection: "row",
        borderRadius: scaleX(12),
        marginBottom: scaleY(12),
        overflow: "hidden",
        borderWidth: 0.5,
        marginTop: scaleY(6),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    thumbnailWrap: {
        width: scaleX(120),
        height: scaleY(90),
    },

    playWrapper: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -16 }, { translateY: -16 }],
    },

    content: {
        flex: 1,
        padding: scaleX(10),
        justifyContent: "space-between",
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
    },
});
