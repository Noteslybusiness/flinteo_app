import { StyleSheet, View, FlatList, ActivityIndicator, Text, Image } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import ExploreHeader from "../../../admin/explore/components/ExploreHeader";
import GlobalSearchBar from "../../../common/components/GlobalSearchBar";
import { scaleX } from "../../../../utils/baseDim";
import { contentService } from "../../../../network/repo/content/ContentService";
import useDebounce from "../../../../hooks/debounce";
import CourseCard from "../components/CourseCard";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../../navigation/navUtils";

const DiscoverScreen: React.FC<DefaultScreenProps> = ({
    navigation,
    route
}) => {
    const theme = useContext(ThemeContext);

    const [searchText, setSearchText] = useState<string>("");
    const [content, setContent] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(1);
    const [loading, setLoading] = useState(false);

    const debounceText = useDebounce(searchText, 500);

    useEffect(() => {
        resetAndFetch();
    }, [debounceText]);

    const resetAndFetch = () => {
        setContent([]);
        fetchContent(1, true);
    };

    const fetchContent = async (pageNumber = pagination.page, reset = false) => {
        if (loading) return;
        if (!reset && !pagination.has_next) return;

        setLoading(true);
        try {
            const response = await contentService.getUserSharedContent({
                query: debounceText,
                page: pageNumber,
                limit: pagination.limit,
            });

            const items = response?.data?.data?.items || [];
            const pageInfo = response?.data?.data?.pagination;

            setContent(prev =>
                reset ? items : [...prev, ...items]
            );

            if (pageInfo) {
                setPagination(pageInfo);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
        <CourseCard theme={theme} item={item} onPress={() => {
            navScreen(navigation, AppScreens.MY_COURSE_DETAIL_SCREEN, NAV_ACTIONS.NAVIGATE, {
                slug: item.slug
            })
        }}/>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator style={{ marginVertical: scaleX(16) }} />;
    };

    return (
        <BaseView>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ExploreHeader theme={theme} />
                <View style={styles.contentContainer}>
                    <GlobalSearchBar
                        theme={theme}
                        value={searchText}
                        onChange={setSearchText}
                    />
                    <Text style={[styles.title, { color: theme.colors.text }]}>{"My Courses"}</Text>
                    <FlatList
                        data={content}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: scaleX(100) }}
                        ListFooterComponent={renderFooter}
                        onEndReached={() => {
                            if (!loading && pagination.has_next) {
                                fetchContent(pagination.page + 1);
                            }
                        }}
                        onEndReachedThreshold={0.6}
                        ItemSeparatorComponent={() => <View style={{height: 16}}/>}
                    />
                </View>
            </View>
        </BaseView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: scaleX(16),
        paddingTop: scaleX(16),
        rowGap: scaleX(16),
    },
    card: {
        borderRadius: scaleX(16),
        padding: scaleX(12),
        marginBottom: scaleX(12),
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    thumbnail: {
        width: scaleX(80),
        height: scaleX(80),
        borderRadius: scaleX(12),
        backgroundColor: "#e5e5e5",
    },
    content: {
        flex: 1,
        marginLeft: scaleX(12),
    },
    title: {
        fontSize: scaleX(16),
        fontWeight: "600",
        lineHeight: scaleX(18),
    },
    description: {
        fontSize: scaleX(12),
        marginTop: scaleX(4),
        lineHeight: scaleX(16),
    },
    footer: {
        marginTop: scaleX(8),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    badge: {
        paddingHorizontal: scaleX(8),
        paddingVertical: scaleX(3),
        borderRadius: scaleX(8),
    },
    badgeText: {
        fontSize: scaleX(10),
        fontWeight: "500",
    },
});

export default DiscoverScreen;
