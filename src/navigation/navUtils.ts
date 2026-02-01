import { CommonActions, StackActions } from '@react-navigation/native';

export const AppScreens = {
    // OnBoarding Screens
    ON_BOARDING_STACK: 'OnBoardingStack',
    SPLASH_SCREEN: 'SplashScreen',
    USER_ON_BOARD_SCREEN: 'UserOnBoardScreeen',

    // Auth screens
    LOGIN_EMAIL_PASSWORD_SCREEN: 'LoginEmailPasswordScreen',
    OTP_OPTION_SCREEN: 'OtpOptionScreen',
    LOGIN_EMAIL_OTP_SCREEN: 'LoginEmailOtpScreen',
    LOGIN_MOBILE_OTP_SCREEN: 'LoginMobileOtpScreen',
    OTP_VERIFICATION_SCREEN: 'OtpVerificationScreen',
    RESET_PASSWORD_SCREEN: 'ResetPasswordScreen',

    // Admin user tab
    ADMIN_USER_TAB_STACK: 'AdminUserTab',
    DASHBOARD_SCREEN: 'DashboardScreen',
    USER_LIST_SCREEN: 'UserListScreen',
    PROFILE_SCREEN: 'ProfileScreen',

    USERS_STACK: 'UsersStack',
    ADD_USER_SCREEN: 'AddUserScreen',
    USER_DETAIL_SCREEN: 'UserDetailScreen',
    EDIT_USER_SCREEN: 'EditUserScree',
    USER_GROUP_DETAILS: 'UserGroupDetails',
    CREATE_USER_GROUP: 'CreateUserGroup',
    EDIT_USER_GROUP: 'EditUserGroup',

    // Insights
    INSIGHT_STACK: 'InsightStack',
    INSIGHT_SCREEN: 'InsightScreen',

    MY_PUBLISHED_CONTENT_SCREEN: 'MyPublishedContentsScreen',
    MY_ARCHIVE_CONTENT_SCREEN: 'MyArchiveContentsScreen',
    VIDEO_DETAIL_SCREEN: 'VideoDetailScreen',
    EDIT_VIDEO_SCREEN: 'EditVideoScreen',
    COURSE_DETAIL_SCREEN: 'CourseDetailScreen',
    EDIT_COURSE_SCREEN: 'EditCourseScreen',


    // Upload content
    UPLOAD_VIDEO_STACK: 'UploadVideoStack',
    UPLOAD_VIDEO_SCREEN: 'UploadVideoScreen',
    UPLOAD_VIDEO_DETAILS: 'UploadVideoDetails',

    // Profile edit 
    ADMIN_PROFILE_EDIT_STACK: 'AdminProfileEditStack',
    ADMIN_PROFILE_EDIT_SCREEN: 'AdminProfileEditScreen',

    // Notifications
    NOTIFICATION_STACK: 'NotificationStack',
    NOTIFICATION_SCREEN: 'NotificationScreen',

    // Viewer Users
    VIEWER_USER_STACK: 'ViewerUserStack',
    VIEWER_USER_TAB_STACK: 'ViewerUserTabStack',
    VIEWER_PROFILE_EDIT_SCREEN: 'ViewerProfileEditScreen',

    // Courses screen
    MY_COURSE_DETAIL_SCREEN: 'CourseDetailScreen',
    MY_PLAYBACK_SCREEN: 'MyPlaybackScreen'


}

export const NAV_ACTIONS = {
    NAVIGATE: 'navigate',
    PUSH: 'push',
    REPLACE: 'replace',
    RESET: 'reset',
    GO_BACK: 'goBack',
    POP: 'pop',
    POP_TO_TOP: 'popToTop',
};

export const navScreen = (navigation: any, screen: string, action: string, param?: any) => {
    switch (action) {
        case NAV_ACTIONS.NAVIGATE:
            navigation.navigate(screen, param);
            break;

        case NAV_ACTIONS.PUSH:
            navigation.push(screen, param);
            break;

        case NAV_ACTIONS.REPLACE:
            navigation.replace(screen, param);
            break;

        case NAV_ACTIONS.RESET:
            navigation.reset({
                index: 0,
                routes: [{ name: screen, params: param }],
            });
            break;

        case NAV_ACTIONS.GO_BACK:
            navigation.goBack();
            break;

        case NAV_ACTIONS.POP:
            navigation.dispatch(StackActions.pop(param?.count || 1)); // Default to popping one screen if count is not provided
            break;

        case NAV_ACTIONS.POP_TO_TOP:
            navigation.popToTop();
            break;

        default:
            console.warn(`Unknown action: ${action}`);
    }
};