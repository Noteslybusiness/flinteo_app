
import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Matrix, scaleX, scaleY, SCREEN } from "../../../../utils/baseDim";
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

/* ─────────────── BLOCK SECTION SHIMMER ─────────────── */

interface Props {
    theme: AppTheme;
}

const BlockSectionShimmer: React.FC<Props> = ({ theme }) => {
    const { colors } = theme;

    const baseColor = colors.surface;
    const highlightColor = colors.border || colors.secondary;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerSection}>
                <ShimmerBar
                    width={scaleX(120)}
                    height={scaleY(18)}
                    radius={6}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                />
                <ShimmerBar
                    width={scaleX(80)}
                    height={scaleY(14)}
                    radius={6}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                />
            </View>

            {/* KPI Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                {[1, 2, 3, 4].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.card,
                            { backgroundColor: colors.surface },
                        ]}
                    >
                        <ShimmerBar
                            width={scaleX(70)}
                            height={scaleY(12)}
                            radius={4}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />
                        <ShimmerBar
                            width={scaleX(50)}
                            height={scaleY(22)}
                            radius={6}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default BlockSectionShimmer;

/* ───────────────── STYLES ───────────────── */

const styles = StyleSheet.create({
    container: {
        width: Matrix.DIM_100,
        marginBottom: scaleY(12),

    },

    headerSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: scaleX(16),
        marginBottom: scaleY(6),
    },

    row: {
        paddingHorizontal: scaleX(8),
        paddingVertical: scaleY(10),
    },

    card: {
        width: SCREEN.WIDTH / 2.6,
        height: scaleY(84),
        borderRadius: scaleX(12),
        padding: scaleX(12),
        marginHorizontal: scaleX(6),
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
});


// import React, { useEffect, useRef } from "react";
// import {
//     View,
//     StyleSheet,
//     ScrollView,
//     Animated,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import { Matrix, scaleX, scaleY, SCREEN } from "../../../../utils/baseDim";

// /* ───────────────── SHIMMER BAR ───────────────── */

// const ShimmerBar = ({ width, height, radius = 8 }: any) => {
//     const translateX = useRef(new Animated.Value(-1)).current;

//     useEffect(() => {
//         Animated.loop(
//             Animated.timing(translateX, {
//                 toValue: 1,
//                 duration: 1200,
//                 useNativeDriver: true,
//             })
//         ).start();
//     }, []);

//     const translate = translateX.interpolate({
//         inputRange: [-1, 1],
//         outputRange: [-width, width],
//     });

//     return (
//         <View
//             style={{
//                 width,
//                 height,
//                 borderRadius: radius,
//                 backgroundColor: "#1f1f1f",
//                 overflow: "hidden",
//             }}
//         >
//             <Animated.View
//                 style={{
//                     ...StyleSheet.absoluteFillObject,
//                     transform: [{ translateX: translate }],
//                 }}
//             >
//                 <LinearGradient
//                     colors={["#2a2a2a", "#3a3a3a", "#2a2a2a"]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={StyleSheet.absoluteFill}
//                 />
//             </Animated.View>
//         </View>
//     );
// };

// /* ─────────────── BLOCK SECTION SHIMMER ─────────────── */

// const BlockSectionShimmer = () => {
//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.headerSection}>
//                 <ShimmerBar width={120} height={18} radius={6} />
//                 <ShimmerBar width={80} height={14} radius={6} />
//             </View>

//             {/* KPI Cards */}
//             <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.row}
//             >
//                 {[1, 2, 3, 4].map((_, index) => (
//                     <View key={index} style={styles.card}>
//                         <ShimmerBar width={70} height={12} radius={4} />
//                         <ShimmerBar width={50} height={22} radius={6} />
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };

// export default BlockSectionShimmer;

// /* ───────────────── STYLES ───────────────── */

// const styles = StyleSheet.create({
//     container: {
//         width: Matrix.DIM_100,
//         marginBottom: scaleY(12),
//     },
//     headerSection: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: scaleX(16),
//         marginBottom: scaleY(6),
//     },
//     row: {
//         paddingHorizontal: scaleX(8),
//         paddingVertical: scaleY(10),
//     },
//     card: {
//         width: SCREEN.WIDTH / 2.6,
//         height: scaleY(84),
//         borderRadius: 12,
//         padding: scaleX(12),
//         marginHorizontal: scaleX(6),
//         justifyContent: "space-between",
//         backgroundColor: "#1f1f1f",
//     },
// });
