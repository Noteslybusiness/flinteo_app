import { FlatList, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { contentService } from "../../../../network/repo/content/ContentService";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../../navigation/navUtils";
import { Play, Clock, BookOpen, User } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHooks";
import { getUserOrgProfileData } from "../../../../redux/organization/reducers/userProfileReducer";

const ViewerHomeScreen: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const inset = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { userProfileSuccess, userProfileLoading } = useAppSelector(state => state.userProfileReducer);
    
    const [courseList, setCourseList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUserProfile();
        fetchMyCourses();
    }, []);

    const loadUserProfile = async () => {
        dispatch(getUserOrgProfileData({}));
    };

    const fetchMyCourses = async () => {
        try {
            setLoading(true);
            const response = await contentService.getUserSharedContent({
                page: 1,
                limit: 50
            });
            console.log('API Response:', response.data);
            if (response?.data?.result) {
                setCourseList(response.data.data?.items || []);
            }
        } catch (e) {
            console.log('Error fetching courses:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleCoursePress = (course: any) => {
        navScreen(
            navigation,
            AppScreens.MY_COURSE_DETAIL_SCREEN,
            NAV_ACTIONS.NAVIGATE,
            { slug: course.slug }
        );
    };

    const renderHeader = () => {
        const userInfo = userProfileSuccess?.data?.user_info;
        const orgInfo = userProfileSuccess?.data?.org_info;
        
        return (
            <View style={[styles.header, { paddingTop: inset.top }]}>
                <View style={styles.headerContent}>
                    {/* Profile Image */}
                    <View style={styles.profileImageContainer}>
                        {userInfo?.profile_image ? (
                            <Image 
                                source={{ uri: userInfo.profile_image }} 
                                style={styles.profileImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.colors.primary }]}>
                                <User size={scaleX(20)} color={theme.colors.onPrimary} />
                            </View>
                        )}
                    </View>

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Text style={[styles.welcomeText, { color: theme.colors.onSurfaceVariant }]}>
                            Welcome back,
                        </Text>
                        <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>
                            {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}
                        </Text>
                        {orgInfo?.name && (
                            <Text style={[styles.organizationName, { color: theme.colors.primary }]} numberOfLines={1}>
                                {orgInfo.name}
                            </Text>
                        )}
                    </View>
                </View>
                
                {/* Courses Title */}
                <Text style={[styles.coursesTitle, { color: theme.colors.text }]}>
                    My Courses
                </Text>
            </View>
        );
    };

    const renderCourseItem = ({ item }: any) => (
        <TouchableOpacity
            style={[styles.courseCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleCoursePress(item)}
            activeOpacity={0.7}
        >
            {/* Course Thumbnail */}
            <View style={styles.thumbnailContainer}>
                {item.thumbnail ? (
                    <Image 
                        source={{ uri: item.thumbnail }} 
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surfaceContainerLow }]}>
                        <BookOpen size={scaleX(40)} color={theme.colors.primary} />
                    </View>
                )}
                
                {/* Progress Overlay */}
                {item.progress > 0 && (
                    <View style={[styles.progressOverlay, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.progressText, { color: theme.colors.onPrimary }]}>
                            {item.progress}%
                        </Text>
                    </View>
                )}
            </View>

            {/* Course Info */}
            <View style={styles.courseInfo}>
                <Text style={[styles.courseTitle, { color: theme.colors.text }]} numberOfLines={2}>
                    {item.title || 'Untitled Course'}
                </Text>
                
                {item.description ? (
                    <Text style={[styles.courseDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : null}

                {/* Author Info */}
                {item.author && (
                    <Text style={[styles.authorText, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        By {item.author.first_name} {item.author.last_name}
                    </Text>
                )}

                <View style={styles.courseStats}>
                    <View style={styles.statItem}>
                        <Play size={scaleX(14)} color={theme.colors.onSurfaceVariant} />
                        <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                            {item.total_videos || 0} videos
                        </Text>
                    </View>
                    
                    {item.progress > 0 && (
                        <View style={styles.statItem}>
                            <Clock size={scaleX(14)} color={theme.colors.primary} />
                            <Text style={[styles.statText, { color: theme.colors.primary }]}>
                                {item.progress}% complete
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <BookOpen size={scaleX(60)} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Courses Yet
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
                You haven't been assigned any courses yet. Check back later!
            </Text>
        </View>
    );

    return (
        <BaseView>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Custom Header */}
                {renderHeader()}

                {/* Course List */}
                <FlatList
                    data={courseList}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={fetchMyCourses}
                    ListEmptyComponent={!loading ? renderEmptyState : null}
                />
            </View>
        </BaseView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: scaleX(20),
        paddingBottom: scaleY(20),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scaleY(16),
    },
    profileImageContainer: {
        marginRight: scaleX(12),
    },
    profileImage: {
        width: scaleX(50),
        height: scaleX(50),
        borderRadius: scaleX(25),
    },
    profileImagePlaceholder: {
        width: scaleX(50),
        height: scaleX(50),
        borderRadius: scaleX(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
    },
    welcomeText: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterRegular,
    },
    userName: {
        fontSize: scaleY(18),
        fontFamily: FONTS.InterBold,
        marginTop: scaleY(2),
    },
    organizationName: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterMedium,
        marginTop: scaleY(2),
    },
    coursesTitle: {
        fontSize: scaleY(20),
        fontFamily: FONTS.InterBold,
    },
    listContainer: {
        padding: scaleX(20),
        paddingBottom: scaleY(100), // Extra padding for tab bar
    },
    courseCard: {
        flexDirection: 'row',
        padding: scaleX(16),
        borderRadius: scaleX(12),
        marginBottom: scaleY(16),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    thumbnailContainer: {
        width: scaleX(80),
        height: scaleX(80),
        borderRadius: scaleX(8),
        marginRight: scaleX(16),
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: scaleX(8),
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: scaleX(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressOverlay: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        paddingHorizontal: scaleX(6),
        paddingVertical: scaleY(2),
        borderRadius: scaleX(4),
    },
    progressText: {
        fontSize: scaleY(10),
        fontFamily: FONTS.InterBold,
    },
    courseInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    courseTitle: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterBold,
        marginBottom: scaleY(4),
    },
    courseDescription: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterRegular,
        marginBottom: scaleY(8),
        lineHeight: scaleY(20),
    },
    authorText: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterMedium,
        marginBottom: scaleY(8),
    },
    courseStats: {
        flexDirection: 'row',
        gap: scaleX(16),
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scaleX(4),
    },
    statText: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterMedium,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scaleY(60),
    },
    emptyTitle: {
        fontSize: scaleY(18),
        fontFamily: FONTS.InterBold,
        marginTop: scaleY(16),
        marginBottom: scaleY(8),
    },
    emptyDescription: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterRegular,
        textAlign: 'center',
        paddingHorizontal: scaleX(40),
        lineHeight: scaleY(20),
    },
});

export default ViewerHomeScreen;
