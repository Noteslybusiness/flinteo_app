import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import { Menu, User, Clock, Video } from "lucide-react-native";

type Props = {
    item: any;
    theme: any;
    onPress: () => void;
};

const CourseCard: React.FC<Props> = ({ item, theme, onPress }) => {
    const progress = Math.min(item.progress || 0);
    const author = item.author;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[styles.backStack, { backgroundColor: "rgba(255, 227, 166, 1)" }]} />

            <View style={[styles.frontCard, { backgroundColor: "rgba(225, 225, 225, 1)" }]}>
                <View style={styles.cardContainer}>
                    <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
                </View>

                <LinearGradient
                    colors={["rgba(225,225,225,0)", "rgba(27,26,26,1)"]}
                    style={styles.cardOverlay}
                >
                    <View style={styles.infoContainer}>
                        {/* Title */}
                        <Text
                            numberOfLines={2}
                            style={[styles.title, { color: theme.colors.whiteColor }]}
                        >
                            {item.title}
                        </Text>

                        {/* Duration */}
                        <View style={styles.durationRow}>
                            <Clock width={14} height={14} color={theme.colors.whiteColor} />
                            <Text style={[styles.durationText, { color: theme.colors.whiteColor }]}>
                                {item.duration || "2h 30m"}
                            </Text>
                        </View>

                        {/* Author Row */}
                        <View style={styles.authorRow}>
                            <View style={[styles.profilewrper, { backgroundColor: theme.colors.onSurface }]}>
                                {author?.profile_image ? (
                                    <Image
                                        source={{ uri: author.profile_image }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <User width={14} height={14} color={theme.colors.whiteColor} />
                                )}
                            </View>

                            <View style={styles.authorInfo}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.authorName, { color: theme.colors.whiteColor }]}
                                >
                                    {author?.first_name + " " + (author?.last_name || "")}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.authorRole, { color: "rgba(255,255,255,0.7)" }]}
                                >
                                    {author?.role_name}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Progress */}
                    <View style={styles.progressContainer}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progress}%`,
                                    backgroundColor: theme.colors.primary,
                                },
                            ]}
                        />
                    </View>
                </LinearGradient>

                {/* Tool */}
                <View style={[styles.toolContainer, { backgroundColor: "rgba(61, 61, 61, 1)" }]}>
                    <Video width={20} height={20} color={theme.colors.whiteColor} />
                    <Text style={[styles.subTitle, { color: theme.colors.whiteColor }]}>
                        {item.total_videos || 0}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default CourseCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Matrix.DIM_100,
        height: scaleY(180),
    },
    backStack: {
        width: Matrix.DIM_95,
        height: Matrix.DIM_100,
        borderRadius: scaleX(24),
        alignSelf: "center",
    },
    frontCard: {
        position: "absolute",
        bottom: 0,
        width: Matrix.DIM_100,
        height: Matrix.DIM_95,
        borderRadius: scaleX(16),
    },
    cardContainer: {
        width: Matrix.DIM_100,
        height: Matrix.DIM_100,
        borderRadius: scaleX(16),
        overflow: "hidden",
    },
    thumbnail: {
        width: Matrix.DIM_100,
        height: Matrix.DIM_100,
        borderRadius: scaleX(16),
    },
    cardOverlay: {
        ...StyleSheet.absoluteFill,
        borderRadius: scaleX(16),
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    infoContainer: {
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleX(18),
        columnGap: scaleX(12),
    },
    profilewrper: {
        width: scaleX(30),
        height: scaleX(30),
        borderRadius: scaleX(15),
        borderWidth: 0.5,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: scaleX(18),
        fontFamily: FONTS.InterSemiBold,
        letterSpacing: 1,
    },
    progressContainer: {
        width: Matrix.DIM_100,
        height: scaleY(12),
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderBottomLeftRadius: scaleX(16),
        borderBottomRightRadius: scaleX(16),
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
    },
    toolContainer: {
        position: "absolute",
        right: scaleY(12),
        top: scaleY(12),
        paddingHorizontal: scaleX(12),
        paddingVertical: scaleY(6),
        borderRadius: scaleX(8),
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(8),
    },
    subTitle: {
        fontSize: scaleX(16),
        fontFamily: FONTS.InterRegular,
    },
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(10),
        marginTop: scaleY(6),
    },

    profileImage: {
        width: scaleX(30),
        height: scaleX(30),
        borderRadius: scaleX(15),
    },

    authorInfo: {
        flex: 1,
    },

    authorName: {
        fontSize: scaleX(13),
        fontFamily: FONTS.InterMedium,
    },

    authorRole: {
        fontSize: scaleX(11),
        fontFamily: FONTS.InterRegular,
    },

    durationRow: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(6),
        marginTop: scaleY(6),
    },

    durationText: {
        fontSize: scaleX(11),
        fontFamily: FONTS.InterRegular,
    },

});

