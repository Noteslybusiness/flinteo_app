import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { BaseView } from '../../../common/base/BaseView';
import { DefaultScreenProps } from '../../../common/props/DefaultScreenProps';
import { ThemeContext } from '../../../../assets/theme/themeContext';
import { UserSessionService } from '../../../../services/UserSessionService';
import { scaleX, scaleY } from '../../../../utils/baseDim';
import { FONTS } from '../../../../assets/theme/appFonts';
import { User, LogOut, Settings, Edit3 } from 'lucide-react-native';
import eventEmitter from '../../../../utils/eventEmiter';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storeHooks';
import { getUserOrgProfileData } from '../../../../redux/organization/reducers/userProfileReducer';
import { AppScreens, NAV_ACTIONS, navScreen } from '../../../../navigation/navUtils';

const ViewerProfileScreen: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const { colors } = theme;
    const dispatch = useAppDispatch();
    const { userProfileSuccess, userProfileLoading } = useAppSelector(state => state.userProfileReducer);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        dispatch(getUserOrgProfileData({}));
    };

    const handleEditProfile = () => {
        if (userProfileSuccess?.data) {
            navScreen(
                navigation,
                AppScreens.VIEWER_PROFILE_EDIT_SCREEN,
                NAV_ACTIONS.NAVIGATE,
                {
                    user_info: userProfileSuccess.data.user_info,
                    org_info: userProfileSuccess.data.org_info,
                }
            );
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await UserSessionService.logout();
                            eventEmitter.emit('user-logout');
                        } catch (error) {
                            console.error('Error during logout:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <BaseView>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
                </View>

                {/* Profile Info */}
                <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.avatarContainer}>
                        {userProfileSuccess?.data?.user_info?.profile_image ? (
                            <Image 
                                source={{ uri: userProfileSuccess.data.user_info.profile_image }} 
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                                <User size={scaleX(40)} color={colors.onPrimary} />
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.profileInfo}>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {userProfileSuccess?.data?.user_info ? 
                                `${userProfileSuccess.data.user_info.first_name} ${userProfileSuccess.data.user_info.last_name}` : 
                                'Loading...'
                            }
                        </Text>
                        <Text style={[styles.email, { color: colors.onSurfaceVariant }]}>
                            {userProfileSuccess?.data?.user_info?.email || ''}
                        </Text>
                        <Text style={[styles.role, { color: colors.primary }]}>
                            {userProfileSuccess?.data?.user_info?.role_name || ''}
                        </Text>
                        {userProfileSuccess?.data?.org_info?.name && (
                            <Text style={[styles.organization, { color: colors.onSurfaceVariant }]}>
                                {userProfileSuccess.data.org_info.name}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity 
                        style={[styles.editButton, { backgroundColor: colors.primary }]}
                        onPress={handleEditProfile}
                        activeOpacity={0.7}
                    >
                        <Edit3 size={scaleX(16)} color={colors.onPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Menu Options */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity 
                        style={[styles.menuItem, { backgroundColor: colors.surface }]}
                        activeOpacity={0.7}
                    >
                        <Settings size={scaleX(20)} color={colors.onSurfaceVariant} />
                        <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.menuItem, { backgroundColor: colors.surface }]}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <LogOut size={scaleX(20)} color={colors.error} />
                        <Text style={[styles.menuText, { color: colors.error }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scaleX(20),
    },
    header: {
        paddingVertical: scaleY(20),
        alignItems: 'center',
    },
    title: {
        fontSize: scaleY(24),
        fontFamily: FONTS.InterBold,
    },
    profileCard: {
        padding: scaleX(20),
        borderRadius: scaleX(12),
        marginBottom: scaleY(20),
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    avatarContainer: {
        width: scaleX(80),
        height: scaleX(80),
        borderRadius: scaleX(40),
        marginRight: scaleX(16),
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: scaleY(18),
        fontFamily: FONTS.InterBold,
        marginBottom: scaleY(4),
    },
    email: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterRegular,
        marginBottom: scaleY(4),
    },
    role: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterMedium,
        textTransform: 'capitalize',
        marginBottom: scaleY(4),
    },
    organization: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterRegular,
    },
    editButton: {
        width: scaleX(32),
        height: scaleX(32),
        borderRadius: scaleX(16),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: scaleY(16),
        right: scaleX(16),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuContainer: {
        gap: scaleY(12),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scaleX(16),
        borderRadius: scaleX(8),
        gap: scaleX(12),
    },
    menuText: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterMedium,
    },
});

export default ViewerProfileScreen;