import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppScreens } from "./navUtils";
import LoginEmailPassword from "../views/auth/screens/LoginEmailPassword";
import React, { useEffect, useState } from "react";
import AdminDashboardScreen from "../views/admin/dashboard/screens/AdminDashboardScreen";
import AdminCreatorProfile from "../views/admin/profile/screens/AdminCreatorProfile";
import UsersScreen from "../views/admin/users/screens/UsersScreen";
import AdminBottomBar from "../views/common/navbar/AdminBottomBar";
import InsightsScreen from "../views/admin/insights/screens/InsightsScreen";
import ViewerHomeScreen from "../views/viewer/home/screens/ViewerHomeScreen";
import ViewerBottomBar from "../views/common/navbar/ViewerBottomBar";
import ViewerProfileScreen from "../views/viewer/profile/screens/ViewerProfileScreen";
import { UserSessionService } from "../services/UserSessionService";
import OtpProviderScreen from "../views/auth/screens/OtpProviderScreen";
import LoginEmailOtpScreen from "../views/auth/screens/LoginEmailOtpScreen";
import LoginMobileOtpScreen from "../views/auth/screens/LoginMobileOtpScreen";
import OnBoardingScreen from "../views/onboarding/screens/OnBoardingScreen";
import SplashScreen from "../views/onboarding/screens/SplashScreen";
import eventEmitter from "../utils/eventEmiter";
import UploadVideoScreen from "../views/admin/content/screens/UploadVideoScreen";
import UploadVideoDetails from "../views/admin/content/screens/UploadVideoDetails";
import VideoDetailScreen from "../views/admin/content/screens/VideoDetailScreen";
import AddUserScreen from "../views/admin/users/screens/AddUserScreen";
import UserGroupDetails from "../views/admin/users/screens/UserGroupDetails";
import CourseDetailScreen from "../views/admin/content/screens/CourseDetailScreen";
import EditCourseScreen from "../views/admin/content/screens/EditCourseScreen";
import EditVideoScreen from "../views/admin/content/screens/EditVideoScreen";
import { Linking } from "react-native";
import MyCourseDetailScreen from "../views/viewer/course/screens/MyCourseDetailScreen";
import MyPlaybackScreen from "../views/viewer/course/screens/MyPlaybackScreen";
import EditAdminCreatorProfile from "../views/admin/profile/screens/EditAdminCreatorProfile";
import EditViewerProfile from "../views/viewer/profile/screens/EditViewerProfile";
import NotificationScreen from "../views/notification/screen/NotificationScreen";
import MyContentsScreen from "../views/admin/content/screens/MyContentsScreen";
import MyArchiveContents from "../views/admin/content/screens/MyArchiveContents";

const AppScreenStack = createNativeStackNavigator()
const AppScreensTabs = createBottomTabNavigator()

const UserOnboardNavigator: React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.USER_ON_BOARD_SCREEN}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.USER_ON_BOARD_SCREEN} component={OnBoardingScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.LOGIN_EMAIL_PASSWORD_SCREEN} component={LoginEmailPassword} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.OTP_OPTION_SCREEN} component={OtpProviderScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.LOGIN_EMAIL_OTP_SCREEN} component={LoginEmailOtpScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.LOGIN_MOBILE_OTP_SCREEN} component={LoginMobileOtpScreen} />
    </AppScreenStack.Navigator>
)

// Admins/Creator routes

const AdminUserNavigator: React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.ADMIN_USER_TAB_STACK}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.ADMIN_USER_TAB_STACK} component={AdminUserTabNavigator} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.USERS_STACK} component={UsersNavigator} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.INSIGHT_STACK} component={InsightsNavigator} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.ADMIN_PROFILE_EDIT_STACK} component={EditAdminCreatorProfileNavigator} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.UPLOAD_VIDEO_STACK} component={UploadVideoNavigator} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.NOTIFICATION_STACK} component={NotifcationNavigator} />
        {/* Content Detail Screens - moved from ContentNavigator */}
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.MY_ARCHIVE_CONTENT_SCREEN} component={MyArchiveContents} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.VIDEO_DETAIL_SCREEN} component={VideoDetailScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.EDIT_VIDEO_SCREEN} component={EditVideoScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.COURSE_DETAIL_SCREEN} component={CourseDetailScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.EDIT_COURSE_SCREEN} component={EditCourseScreen} />
    </AppScreenStack.Navigator>
)

const EditAdminCreatorProfileNavigator: React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.ADMIN_PROFILE_EDIT_SCREEN}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.ADMIN_PROFILE_EDIT_SCREEN} component={EditAdminCreatorProfile} />
    </AppScreenStack.Navigator>
)

const AdminUserTabNavigator: React.FC = () => (
    <AppScreensTabs.Navigator
        initialRouteName="Home"
        tabBar={(props) => <AdminBottomBar {...props} />}
        screenOptions={{ headerShown: false }}
    >
        <AppScreenStack.Screen options={{ headerShown: false }} name="Home" component={AdminDashboardScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name="My Content" component={MyContentsScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name="Users" component={UsersScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name="Profile" component={AdminCreatorProfile} />
    </AppScreensTabs.Navigator>
)

const InsightsNavigator:React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.INSIGHT_SCREEN}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.INSIGHT_SCREEN} component={InsightsScreen} />
    </AppScreenStack.Navigator>
)

const UsersNavigator:React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.ADD_USER_SCREEN}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.ADD_USER_SCREEN} component={AddUserScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.USER_GROUP_DETAILS} component={UserGroupDetails} />
    </AppScreenStack.Navigator>
)

const UploadVideoNavigator:React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.UPLOAD_VIDEO_SCREEN}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.UPLOAD_VIDEO_SCREEN} component={UploadVideoScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.UPLOAD_VIDEO_DETAILS} component={UploadVideoDetails} />
    </AppScreenStack.Navigator>
)

const NotifcationNavigator:React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.NOTIFICATION_SCREEN}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.NOTIFICATION_SCREEN} component={NotificationScreen} />
    </AppScreenStack.Navigator>
)

// Viewer routes
const ViewerUserNavigator: React.FC = () => (
    <AppScreenStack.Navigator initialRouteName={AppScreens.VIEWER_USER_TAB_STACK}>
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.VIEWER_USER_TAB_STACK} component={ViewerUserTabNavigator} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.VIEWER_PROFILE_EDIT_SCREEN} component={EditViewerProfile} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.MY_COURSE_DETAIL_SCREEN} component={MyCourseDetailScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name={AppScreens.MY_PLAYBACK_SCREEN} component={MyPlaybackScreen} />
    </AppScreenStack.Navigator>
)

const ViewerUserTabNavigator: React.FC = () => (
    <AppScreensTabs.Navigator
        initialRouteName="Home"
        tabBar={(props) => <ViewerBottomBar {...props} />}
        screenOptions={{ headerShown: false }}
    >
        <AppScreenStack.Screen options={{ headerShown: false }} name="Home" component={ViewerHomeScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name="Notifications" component={NotificationScreen} />
        <AppScreenStack.Screen options={{ headerShown: false }} name="Profile" component={ViewerProfileScreen} />
    </AppScreensTabs.Navigator>
)


const AppNavigator: React.FC = () => {
    
    const [splashLoading, setSplashLoading] = useState<boolean>(true)
    const [role, setRole] = useState<string>()

    useEffect(() => {
        const loginListener = () => {
            console.log("User login event received");
            UserSessionService.getUserProfile().then((res) => {
                console.log("User profile from storage:", res);
                if(res){
                    console.log("Setting role to:", res.role_name);
                    setRole(res.role_name)
                }
            }).finally(() => {
                setSplashLoading(false)
            })
        };

        const logoutListener = () => {
            setRole(undefined)
        };

        const urlListener = (event: any) => {
            console.log('Received URL:', event.url);
        };

        eventEmitter.on("user-login", loginListener);
        eventEmitter.on("user-logout", logoutListener);
        const linkingSubscription = Linking.addEventListener('url', urlListener);

        return () => {
            eventEmitter.off("user-login", loginListener);
            eventEmitter.off("user-logout", logoutListener);
            linkingSubscription?.remove();
        }
    }, [])

    const onSplashCompleted = async() => {
        const url = await Linking.getInitialURL();
        if (url) {
            console.log('Initial URL:', url);
            
        }
        UserSessionService.getUserProfile().then((res) => {
            if(res){
                setRole(res.role_name)
            }
        }).finally(() => {
            setSplashLoading(false)
        })
    }

    if(splashLoading)
        return <SplashScreen onCompleted={onSplashCompleted}/>

    return  <NavigationContainer>
            {role === "admin" || role == 'creator' ? (
                <AdminUserNavigator />
            ) : role === "viewer" || role === "student" ? (
                <ViewerUserNavigator />
            ) : (
                <UserOnboardNavigator />
            )}
        </NavigationContainer>
}

export default AppNavigator;