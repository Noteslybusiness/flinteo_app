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
import { Eye, Lock, Clock, EllipsisVertical, Plus } from "lucide-react-native";
import { contentService } from "../../../../network/repo/content/ContentService";
import { useNavigation } from "@react-navigation/native";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../../navigation/navUtils";
import ContentActionSheet from "./ContentActionSheet";
import GlobalSearchBar from "../../../common/components/GlobalSearchBar";
import useDebounce from "../../../../hooks/debounce";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ArchiveVideosTab: React.FC = () => {
    const theme = useContext(ThemeContext);
    const { colors } = theme;
    const navigation = useNavigation();
    const inset = useSafeAreaInsets()
    const [list, setList] = useState<any[]>([]);
    const [toolMenu, setToolMenu] = useState<any>(null);

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
        fetchVideoList(1, true);
    };

    const fetchVideoList = async (pageNumber: number, isFirstLoad = false) => {
        if (pagination.loading || (!pagination.hasNext && !isFirstLoad)) return;

        setPagination(prev => ({ ...prev, loading: true }));

        try {
            const response = await contentService.getUnPublishedContents({
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
            fetchVideoList(pagination.page + 1);
        }
    };

    const renderItem = ({ item }: any) => {
        const isPublic = item.visibility === "Public";

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.card, { backgroundColor: colors.surface }]}
                onPress={() =>
                    navScreen(navigation, AppScreens.UPLOAD_VIDEO_SCREEN, NAV_ACTIONS.NAVIGATE, {
                        slug: item.slug
                    })
                }
            >
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

                <View style={styles.infoContainer}>
                    <Text numberOfLines={2} style={[styles.title, { color: colors.surfaceText }]}>
                        {item.title}
                    </Text>

                    <Text numberOfLines={2} style={[styles.description, { color: colors.surfaceText }]}>
                        {item.description}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            {isPublic ? (
                                <Eye size={14} color="#10B981" />
                            ) : (
                                <Lock size={14} color="#F59E0B" />
                            )}
                            <Text style={styles.metaText}>{item.visibility}</Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Clock size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{item.status}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={() => setToolMenu(item)}>
                    <EllipsisVertical size={18} color={colors.primary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.searchContainer}>
                <GlobalSearchBar
                    theme={theme}
                    placeholder="Search archived videos"
                    value={searchText}
                    onChange={(text: string) => setSearchText(text)}
                />
            </View>

            <FlatList
                data={list}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    pagination.loading && pagination.page > 1 ? (
                        <ActivityIndicator style={{ marginVertical: scaleY(16) }} />
                    ) : null
                }
                ListEmptyComponent={ () => 
                    !pagination.loading && (
                        <Text style={styles.emptyText}>No archived videos found</Text>
                    )
                }
            />

            <ContentActionSheet
                visible={!!toolMenu}
                theme={theme}
                onClose={() => setToolMenu(null)}
            />

            {/* <TouchableOpacity
                onPress={() =>
                    navScreen(
                        navigation,
                        AppScreens.UPLOAD_VIDEO_STACK,
                        NAV_ACTIONS.NAVIGATE,
                        { screen: AppScreens.UPLOAD_VIDEO_STACK }
                    )
                }
                style={[styles.fab, { backgroundColor: colors.primary, marginBottom: inset.bottom + scaleY(16)}]}
            >
                <Plus size={26} color="#fff" />
            </TouchableOpacity> */}
        </View>
    );
};

export default ArchiveVideosTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer:{
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(16),
        paddingBottom: scaleY(8)
    },
    listContent: {
        padding: scaleX(16),
        gap: scaleY(12),
    },
    card: {
        flexDirection: "row",
        borderRadius: scaleX(12),
        padding: scaleX(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    thumbnail: {
        width: scaleX(96),
        height: scaleY(72),
        borderRadius: scaleX(8),
        backgroundColor: "#E5E7EB",
    },
    infoContainer: {
        flex: 1,
        paddingLeft: scaleX(12),
    },
    title: {
        fontSize: scaleX(15),
        fontFamily: FONTS.InterSemiBold,
        color: "#111827",
    },
    description: {
        marginTop: scaleY(4),
        fontSize: scaleX(13),
        fontFamily: FONTS.InterRegular,
        color: "#6B7280",
    },
    metaRow: {
        flexDirection: "row",
        gap: scaleX(16),
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
    emptyText: {
        textAlign: "center",
        marginTop: scaleY(40),
        fontSize: scaleX(14),
        fontFamily: FONTS.InterRegular,
        color: "#9CA3AF",
    },
      fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 55,
        height: 55,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 5,
    },
});
