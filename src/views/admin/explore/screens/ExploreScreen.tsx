import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { BaseView } from "../../../common/base/BaseView";
import GlobalSearchBar from "../../../common/components/GlobalSearchBar";
import ExploreHeader from "../components/ExploreHeader";
import useDebounce from "../../../../hooks/debounce";
import { contentService } from "../../../../network/repo/content/ContentService";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import {
    AppScreens,
    NAV_ACTIONS,
    navScreen,
} from "../../../../navigation/navUtils";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import ExploreFilterTabs from "../components/ExploreFilterTabs";
import FilterModal from "../components/FilterModal";
import ExploreContentItem from "../components/ExploreVideoItem";
import ExploreEmptyState from "../components/ExploreEmptyState";

const modalKeyMap: any = {
    SORT: "sort",
    TYPE: "content_type",
    USER: "users",
};

const ExploreScreen: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const theme = useContext(ThemeContext);

    const [searchText, setSearchText] = useState("");
    const [list, setList] = useState<any[]>([]);

    const [filterConfig, setFilterConfig] = useState<any>(null);
    const [appliedFilters, setAppliedFilters] = useState<any>({});

    const [activeModal, setActiveModal] =
        useState<"SORT" | "TYPE" | "USER" | null>(null);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const isFetchingRef = useRef(false);

    const debouncedSearchText = useDebounce(searchText, 500);

    const fetchListings = async (
        filters: any,
        query: string,
        pageNo = 1,
        append = false
    ) => {
        if (isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            pageNo === 1 ? setLoading(true) : setLoadingMore(true);
            const params = {
                ...filters,
                query,
                page: pageNo,
            };

            const res = await contentService.getExploreContent(params);
            console.log("Fetch Explore Content with params:", params, res);
            const items = res?.data?.data?.items ?? [];
            const pagination = res?.data?.data?.pagination;

            setList((prev) => (append ? [...prev, ...items] : items));
            setPage(pagination?.page ?? pageNo);
            setHasNext(pagination?.has_next ?? false);
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const resetAndFetch = (filters: any, query: string) => {
        setPage(1);
        setHasNext(true);
        setList([]);
        fetchListings(filters, query, 1, false);
    };

    useEffect(() => {
        resetAndFetch(appliedFilters, debouncedSearchText);
    }, [debouncedSearchText]);

    // const handleApplyFilters = (payload: any) => {
    //     setAppliedFilters(payload);
    //     resetAndFetch(payload, debouncedSearchText);
    // };

    const handleApplyFilters = (payload: any, mergedConfig: any) => {
        setAppliedFilters(payload);
        setFilterConfig(mergedConfig); // 🔥 persist selected state
        resetAndFetch(payload, debouncedSearchText);
    };


    const loadMore = () => {
        if (!hasNext || loadingMore || isFetchingRef.current) return;
        fetchListings(appliedFilters, debouncedSearchText, page + 1, true);
    };

    const openFilterModal = async (key: "SORT" | "TYPE" | "USER") => {
        setActiveModal(key);
        if (!filterConfig) {
            const res = await contentService.getExploreFilters({});
            setFilterConfig(res?.data?.data);
        }
    };


    // const hasSort = !!appliedFilters.sort;

    // const hasType =
    //     appliedFilters.content_type &&
    //     appliedFilters.content_type.length > 0;

    // const hasUser =
    //     appliedFilters.users &&
    //     appliedFilters.users.length > 0;

    const isActive = (val: any) =>
        val !== undefined &&
        val !== null &&
        val !== "" &&
        !(Array.isArray(val) && val.length === 0);

    const hasSort = isActive(appliedFilters.sort);
    const hasType = isActive(appliedFilters.content_type);
    const hasUser = isActive(appliedFilters.users);

    const hasAnyFilter =
        hasSort || hasType || hasUser || !!debouncedSearchText;

    const emptyText = hasAnyFilter
        ? "No data found"
        : "No content available";


    const renderItem = ({ item }: any) => (
        <ExploreContentItem
            item={item}
            theme={theme}
            onPress={() =>
                navScreen(
                    navigation,
                    AppScreens.CONTENT_STACK,
                    NAV_ACTIONS.NAVIGATE,
                    {
                        screen:
                            item.type === "video"
                                ? AppScreens.VIDEO_DETAIL_SCREEN
                                : AppScreens.COURSE_DETAIL_SCREEN,
                        params: { slug: item.slug },
                    }
                )
            }
        />
    );

    return (
        <BaseView>
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <ExploreHeader theme={theme} />

                <View style={styles.searchContainer}>
                    <GlobalSearchBar
                        theme={theme}
                        value={searchText}
                        onChange={setSearchText}
                    />
                </View>

                {/* <ExploreFilterTabs
                    theme={theme}
                    onSortPress={() => openFilterModal("SORT")}
                    onTypePress={() => openFilterModal("TYPE")}
                    onUserFilterPress={() => openFilterModal("USER")}
                /> */}
                <ExploreFilterTabs
                    theme={theme}
                    onSortPress={() => openFilterModal("SORT")}
                    onTypePress={() => openFilterModal("TYPE")}
                    onUserFilterPress={() => openFilterModal("USER")}
                    indicators={{
                        sort: hasSort,
                        type: hasType,
                        user: hasUser,
                    }}
                />


                <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.id}-${item.type}`}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.6}
                    ListEmptyComponent={
                        !loading ? (
                            <ExploreEmptyState text={emptyText} theme={theme} />
                        ) : null
                    }

                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator
                                style={{ marginVertical: 20 }}
                                color={theme.colors.primary}
                            />
                        ) : null
                    }
                />

                {/* <FilterModal
                    visible={!!activeModal}
                    theme={theme}
                    data={filterConfig}
                    activeKey={
                        activeModal ? modalKeyMap[activeModal] : null
                    }
                    onApply={handleApplyFilters}
                    onClose={() => setActiveModal(null)}
                /> */}
                <FilterModal
                    visible={!!activeModal}
                    theme={theme}
                    data={filterConfig}
                    activeKey={activeModal ? modalKeyMap[activeModal] : null}
                    onApply={handleApplyFilters}
                    onClose={() => setActiveModal(null)}
                />

            </View>
        </BaseView>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchContainer: {
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(12),
    },
    listContent: {
        paddingHorizontal: scaleX(16),
        paddingBottom: scaleY(20),
    },
});
