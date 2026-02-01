import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import Video from "react-native-video";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import CommonHeader from "../components/CommonHeader";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { contentService } from "../../../../network/repo/content/ContentService";
import { scaleX, scaleY, Matrix } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../../navigation/navUtils";
import { Clock, Eye, ImageIcon, Pencil } from "lucide-react-native";
import InsightsAnalyticsSection from "../../insights/components/InsightsAnalyticsSection";
import ViewsBarChart from "../../insights/components/ViewsBarChart";
import { FILTERS } from "../utils/utils";

const VideoDetailScreen: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [videoInsights, setVideoInsights] = useState<any>()
    const [courseMapped, setCourseMapped] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] =
        useState<keyof typeof FILTERS>("Last Week");
    const dayRange = FILTERS[selectedFilter];

    useEffect(() => {
        fetchVideoInfo();
    }, []);

    const fetchVideoInfo = async () => {
        try {
            const response = await contentService.getVideoContent(route.params.slug);
            if (response?.data?.result) {
                setVideoInfo(response.data?.data?.content_info);
                setCourseMapped(response.data?.data?.course_mapped)
            }
        } catch (error: any) {
            console.log("error-->", error?.response || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dayRange && videoInfo) {
            fetchVideoInsights(dayRange);
        }
    }, [dayRange, videoInfo]);

    const fetchVideoInsights = async (dayRange: number = 7) => {
        try {
            const response = await contentService.getContentInsights({
                day_range: dayRange,
                content_id: videoInfo?.id
            });
            if (response?.data?.result) {
                setVideoInsights(response.data?.data)
            }
        } catch (e: any) {
            console.log(e)
        }
    }

    const renderItem = ({ item }: any) => {
        return (
            <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]}
                onPress={() => {
                    navScreen(navigation, AppScreens.COURSE_DETAIL_SCREEN, NAV_ACTIONS.NAVIGATE, {
                        slug: item.slug
                    })
                }}
            >
                {/* Thumbnail */}
                {item.thumbnail ? (
                    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                ) : (
                    <View style={styles.placeholderThumb}>
                        <ImageIcon size={28} color="#9CA3AF" />
                    </View>
                )}

                {/* Info */}
                <View style={styles.infoContainer}>
                    <Text numberOfLines={2} style={[styles.title, {
                        fontSize: scaleX(15),
                        fontFamily: FONTS.InterSemiBold
                    }]}>
                        {item.title}
                    </Text>

                    <Text numberOfLines={2} style={styles.description}>
                        {item.description || "No description added"}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Clock size={14} color="#6B7280" />
                            <Text style={styles.metaText}>
                                {/* {getStatusLabel(item.status)} */}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Edit Button */}
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                        // TODO: navigate to edit course
                    }}
                >
                    <Eye size={18} color={theme.colors.primary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <BaseView>
            <CommonHeader
                theme={theme}
                title="Video Detail"
                onBackPress={() => navigation.goBack()}
                onEditPress={() => {
                    navScreen(navigation, AppScreens.EDIT_VIDEO_SCREEN, NAV_ACTIONS.NAVIGATE, {
                        slug: videoInfo?.slug
                    })
                }}
            />
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ScrollView contentContainerStyle={{ paddingBottom: scaleY(24) }}>
                    {
                        videoInfo &&
                        <View>
                            <View style={styles.videoWrapper}>
                                <Video
                                    source={{ uri: videoInfo?.url }}
                                    poster={videoInfo?.thumbnail}
                                    style={styles.video}
                                    controls
                                    resizeMode="contain"
                                    repeat={false}
                                    onError={(err: any) => console.log('error-->', err)}
                                    onBuffer={(e: any) => console.log('buffer-->', e)}
                                />
                            </View>
                            <View style={styles.contentContainer}>
                                <View style={[styles.infoCard, { backgroundColor: theme.colors.background }]}>
                                    <Text style={[styles.title, { color: theme.colors.surfaceText }]}>{videoInfo.title}</Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor:
                                                    videoInfo.status === 2 ? "#DCFCE7" : "#FEF3C7",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                {
                                                    color:
                                                        videoInfo.status === 2
                                                            ? "#15803D"
                                                            : "#B45309",
                                                },
                                            ]}
                                        >
                                            {videoInfo.status_display}
                                        </Text>
                                    </View>
                                    <Text style={[styles.sectionTitle, { color: theme.colors.surfaceText }]}>Description</Text>
                                    <Text style={[styles.description, { color: theme.colors.surfaceText }]}>
                                        {videoInfo.description?.trim()
                                            ? videoInfo.description
                                            : "No description provided."}
                                    </Text>
                                </View>
                            </View>

                            {/* <View style={styles.courseSection}>
                                <Text style={{
                                    fontSize: scaleX(18),
                                    fontFamily: FONTS.InterSemiBold,
                                    color: theme.colors.surfaceText
                                }}>{"Shared in Courses:"}</Text>
                                {
                                    courseMapped && courseMapped.map((item: any, index: number) => renderItem({ item }))
                                }
                            </View> */}
                        </View>
                    }
                    {
                        videoInsights &&
                        <View>
                            <InsightsAnalyticsSection
                                theme={theme}
                                analytics={videoInsights?.kpis || []}
                                selectedFilter={selectedFilter}
                                onFilterChange={(label) => setSelectedFilter(label)}
                                filters={FILTERS}
                                sectionTitle="Video Analytics"
                            />
                            <ViewsBarChart dayRange={7} theme={theme} rawData={videoInsights?.graph} />
                        </View>
                    }
                </ScrollView>
            </View>
        </BaseView>
    );
};

export default VideoDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    contentContainer: {
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(16),
        rowGap: scaleY(16)
    },

    videoWrapper: {
        width: Matrix.DIM_100,
        height: scaleY(220),
        backgroundColor: "#000",
    },

    video: {
        width: "100%",
        height: "100%",
    },

    infoCard: {
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(16),
        backgroundColor: "#fff",
        borderRadius: scaleX(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    title: {
        fontSize: scaleX(18),
        fontFamily: FONTS.InterSemiBold,
        color: "#111827",
    },

    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: scaleX(10),
        paddingVertical: scaleY(4),
        borderRadius: scaleX(8),
        marginTop: scaleY(8),
    },

    statusText: {
        fontSize: scaleX(12),
        fontFamily: FONTS.InterMedium,
    },

    sectionTitle: {
        marginTop: scaleY(16),
        fontSize: scaleX(14),
        fontFamily: FONTS.InterSemiBold,
        color: "#374151",
    },

    description: {
        marginTop: scaleY(6),
        fontSize: scaleX(13),
        fontFamily: FONTS.InterRegular,
        color: "#6B7280",
        lineHeight: scaleY(18),
    },
    courseSection: {
        paddingHorizontal: scaleX(16),
        rowGap: scaleY(12),
        marginTop: scaleY(12)
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: scaleX(12),
        padding: scaleX(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    thumbnail: {
        width: scaleX(72),
        height: scaleX(72),
        borderRadius: scaleX(8),
    },
    placeholderThumb: {
        width: scaleX(72),
        height: scaleX(72),
        borderRadius: scaleX(8),
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
    },
    infoContainer: {
        flex: 1,
        paddingHorizontal: scaleX(12),
    },
    metaRow: {
        flexDirection: "row",
        marginTop: scaleY(8),
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
    },
    metaText: {
        fontSize: scaleX(12),
        fontFamily: FONTS.InterMedium,
        color: "#374151",
    },
    editBtn: {
        padding: scaleX(8),
        borderRadius: scaleX(20),
    },

});
