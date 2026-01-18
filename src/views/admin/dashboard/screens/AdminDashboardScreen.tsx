import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import DashboardHeader from "../components/HeaderView";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { useContext, useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import VideoSection from "../components/VideoSection";
import { ThumbsUp, MessageCircle, Share2, Eye } from "lucide-react-native";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../../navigation/navUtils";
import { organizationService } from "../../../../network/repo/organization/OrganizationService";
import { contentService } from "../../../../network/repo/content/ContentService";
import { FONTS } from "../../../../assets/theme/appFonts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHooks";
import { getUserOrgProfileData } from "../../../../redux/organization/reducers/userProfileReducer";
import BlockSection from "../components/BlockSection";
import RecentVideosSerction from "../components/RecentVideosSerction";


const AdminDashboardScreen: React.FC<DefaultScreenProps> = ({
    route,
    navigation
}) => {
    const theme = useContext(ThemeContext);
    const colors = theme.colors;
    const dispatch = useAppDispatch()
    const userProfileData = useAppSelector(state => state.userProfileReducer.userProfileSuccess)
    const userProfileLoading = useAppSelector(state => state.userProfileReducer.userProfileLoading)

    const [organization, setOrganization] = useState<any>()
    const [topVideos, setTopVideos] = useState<any>([])
    const [recentVideos, setRecentVideos] = useState<any>([])
    const [recentVideoLoading, setRecentVideoLoading] = useState<boolean>(false)
    const [topVideoLoading, setTopVideoLoading] = useState<boolean>(false)

    useEffect(() => {
        dispatch(getUserOrgProfileData({}))
        fetchRecentVideos()
        fetchTopVides()
    }, [])

    useEffect(() => {
        if (userProfileData) {
            console.log(userProfileData)
            setOrganization(userProfileData?.data)
        }
    }, [userProfileData])

    const fetchRecentVideos = async () => {
        setRecentVideoLoading(true)
        try {
            const response = await contentService.getRecentContent({})
            setRecentVideos(response?.data?.data)
            console.log(response?.data?.data)
        } catch (error) {
            console.log(error)
        }finally{
            setRecentVideoLoading(false)
        }
    }

    const fetchTopVides = async () => {
        setTopVideoLoading(true)
        try {
            const response = await contentService.getMostViewedContent({})
            setTopVideos(response?.data?.data)
        } catch (error) {
            console.log(error)
        }finally{
            setTopVideoLoading(false)
        }
    }

    const handleEditProfilePress = () => {
        navScreen(navigation, AppScreens.ADMIN_PROFILE_EDIT_STACK, NAV_ACTIONS.NAVIGATE, {
            screen: AppScreens.ADMIN_PROFILE_EDIT_SCREEN,
            params: {
                ...organization
            }
        })
    }

    const handleAddVideoPress = () => {
        navScreen(navigation, AppScreens.UPLOAD_VIDEO_STACK, NAV_ACTIONS.NAVIGATE, {
            screen: AppScreens.UPLOAD_VIDEO_SCREEN
        })
    }

    return (
        <BaseView>
            <DashboardHeader
                theme={theme}
                title={organization?.org_info?.name || "Dashboard"}
                onNotificationPress={() => {
                    navScreen(navigation, AppScreens.NOTIFICATION_STACK, NAV_ACTIONS.NAVIGATE, {
                        screen: AppScreens.NOTIFICATION_SCREEN,
                        params: {
                            ...organization
                        }
                    })
                }}
                onEditPress={() => { }}
            />
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ScrollView
                >
                    <HeroBanner
                        theme={theme}
                        organization={organization}
                        onEditPress={handleEditProfilePress}
                    />
                    <BlockSection
                       theme={theme} 
                        onPressInsights={() => navScreen(navigation, AppScreens.INSIGHT_STACK, NAV_ACTIONS.NAVIGATE)}
                    />
                    <VideoSection theme={theme} videos={topVideos}
                        title="Most Viewed"
                        onItemClick={(slug: string) => {
                            navScreen(navigation, AppScreens.CONTENT_STACK, NAV_ACTIONS.NAVIGATE, {
                                screen: AppScreens.VIDEO_DETAIL_SCREEN,
                                params: {
                                    slug: slug
                                }
                            })
                        }}
                        onViewAll={() => {
                            navScreen(navigation, "Explore", NAV_ACTIONS.NAVIGATE)
                        }}
                        onEmptyAction={handleAddVideoPress}
                        emptyActionText="Create New"
                        loading={topVideoLoading}
                    />
                    <RecentVideosSerction theme={theme} videos={recentVideos}
                        onItemClick={(slug: string) => {
                            navScreen(navigation, AppScreens.CONTENT_STACK, NAV_ACTIONS.NAVIGATE, {
                                screen: AppScreens.VIDEO_DETAIL_SCREEN,
                                params: {
                                    slug: slug
                                }
                            })
                        }}
                        loading={recentVideoLoading}
                        emptyActionText="Upload First Video"
                        onEmptyAction={handleAddVideoPress}
                    />
                </ScrollView>
            </View>
        </BaseView>
    );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});
