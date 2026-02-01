import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import {
    Clock,
    Image as ImageIcon,
    Pencil,
    Plus,
    BookOpen,
} from "lucide-react-native";
import { contentService } from "../../../../network/repo/content/ContentService";
import {
    AppScreens,
    NAV_ACTIONS,
    navScreen,
} from "../../../../navigation/navUtils";
import { useNavigation } from "@react-navigation/native";
import AddNewCourses from "./AddNewCourses";
import GlobalSearchBar from "../../../common/components/GlobalSearchBar";
import useDebounce from "../../../../hooks/debounce";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AllCoursesTab: React.FC = () => {
    const theme = useContext(ThemeContext);
    const { colors } = theme;
    const inset = useSafeAreaInsets()
    const [list, setList] = useState<any[]>([]);
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState("");
    const debouncedSearch = useDebounce(searchText, 500);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        hasNext: true,
        loading: false,
    });

    useEffect(() => {
        resetAndFetch();
    }, [debouncedSearch]);

    const resetAndFetch = () => {
        setList([]);
        setPagination({
            page: 1,
            limit: pagination.limit,
            hasNext: true,
            loading: false,
        });
        fetchCourseList(1, true);
    };

    const fetchCourseList = async (pageNumber: number, isFirstLoad = false) => {
        if (pagination.loading || (!pagination.hasNext && !isFirstLoad)) return;
        setPagination(prev => ({ ...prev, loading: true }));
        try {
            const response = await contentService.getContentList({
                content_type: "courses",
                page: pageNumber,
                limit: pagination.limit,
                query: debouncedSearch || undefined,
            });

            const contents = response?.data?.data?.contents || [];
            const pageInfo = response?.data?.data?.pagination;

            setList(prev =>
                pageNumber === 1 ? contents : [...prev, ...contents]
            );

            setPagination(prev => ({
                ...prev,
                page: pageNumber,
                hasNext: pageInfo?.has_next ?? false,
                loading: false,
            }));
        } catch (err: any) {
            setPagination(prev => ({ ...prev, loading: false }));
            Alert.alert("Error", err?.message || "Something went wrong");
        }
    };

    const loadMore = () => {
        if (pagination.hasNext && !pagination.loading) {
            fetchCourseList(pagination.page + 1);
        }
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 1:
                return "Draft";
            case 2:
                return "Published";
            default:
                return "Unknown";
        }
    };

    const renderItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    { backgroundColor: colors.surface },
                ]}
                onPress={() =>
                    navScreen(
                        navigation,
                        AppScreens.COURSE_DETAIL_SCREEN,
                        NAV_ACTIONS.NAVIGATE,
                        {
                            slug: item.slug
                        }
                    )
                }
            >
                {/* Thumbnail */}
                {item.thumbnail ? (
                    <Image
                        source={{ uri: item.thumbnail }}
                        style={styles.thumbnail}
                    />
                ) : (
                    <View style={styles.placeholderThumb}>
                        <ImageIcon size={28} color="#9CA3AF" />
                    </View>
                )}

                {/* Info */}
                <View style={styles.infoContainer}>
                    <Text
                        numberOfLines={2}
                        style={[
                            styles.title,
                            { color: colors.surfaceText },
                        ]}
                    >
                        {item.title}
                    </Text>

                    <Text
                        numberOfLines={2}
                        style={[
                            styles.description,
                            { color: colors.surfaceText },
                        ]}
                    >
                        {item.description || "No description added"}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Clock size={14} color="#6B7280" />
                            <Text
                                style={[
                                    styles.metaText,
                                    { color: colors.surfaceText },
                                ]}
                            >
                                {getStatusLabel(item.status)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Edit */}
                <TouchableOpacity style={styles.editBtn}>
                    <Pencil size={18} color={colors.primary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View
            style={[
                styles.emptyContainer,
                { backgroundColor: colors.surface },
            ]}
        >
            <View
                style={[
                    styles.emptyIconWrapper,
                    { backgroundColor: colors.background },
                ]}
            >
                <BookOpen size={30} color={colors.onSurfaceVariant} />
            </View>

            <Text
                style={[
                    styles.emptyTitle,
                    { color: colors.onSurface },
                ]}
            >
                No courses yet
            </Text>

            <Text
                style={[
                    styles.emptySubtitle,
                    { color: colors.onSurfaceVariant },
                ]}
            >
                Create your first course to get started
            </Text>

            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => { }}
                style={[
                    styles.emptyButton,
                    { backgroundColor: colors.primary},
                ]}
            >
                <Plus size={16} color="#fff" />
                <Text style={styles.emptyButtonText}>
                    Add Course
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.background },
            ]}
        >
            <View style={styles.searchContainer}>
                <GlobalSearchBar
                    theme={theme}
                    onChange={(text: string) => setSearchText(text)}
                    placeholder="Search courses"
                    value={searchText}
                />
            </View>

            <FlatList
                data={list}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={[
                    styles.listContent,
                    list.length === 0 && { flexGrow: 1 },
                    {paddingBottom: inset.bottom + scaleY(16)}
                ]}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    pagination.loading && pagination.page > 1 ? (
                        <ActivityIndicator style={{ marginVertical: scaleY(16) }} />
                    ) : null
                }
                ListEmptyComponent={renderEmptyState}
            />

            {/* Floating Add */}
            <AddNewCourses />
        </View>
    );
};

export default AllCoursesTab;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    searchContainer: {
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(16),
        paddingBottom: scaleY(8),
    },

    listContent: {
        padding: scaleX(16),
        gap: scaleY(12),
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: scaleX(12),
        padding: scaleX(12),
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

    title: {
        fontSize: scaleX(15),
        fontFamily: FONTS.InterSemiBold,
    },

    description: {
        marginTop: scaleY(4),
        fontSize: scaleX(13),
        fontFamily: FONTS.InterRegular,
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
    },

    editBtn: {
        padding: scaleX(8),
        borderRadius: scaleX(20),
    },

    /* -------- Empty State -------- */

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: scaleX(16),
        borderRadius: scaleX(16),
        paddingVertical: scaleY(32),
        gap: scaleY(8),
    },

    emptyIconWrapper: {
        width: scaleX(52),
        height: scaleX(52),
        borderRadius: scaleX(26),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: scaleY(6),
    },

    emptyTitle: {
        fontSize: scaleY(15),
        fontFamily: FONTS.InterSemiBold,
    },

    emptySubtitle: {
        fontSize: scaleY(13),
        fontFamily: FONTS.InterRegular,
        textAlign: "center",
    },

    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(9),
        borderRadius: scaleX(22),
        marginTop: scaleY(10),
    },

    emptyButtonText: {
        color: "#fff",
        fontSize: scaleY(13),
        fontFamily: FONTS.InterMedium,
    },
});
