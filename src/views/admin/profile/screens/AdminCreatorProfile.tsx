import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { ThemeContext } from "../../../../assets/theme/themeContext";

import CreatorProfileCard from "../components/CreatorProfileCard";
import CreatorActionsCard from "../components/CreatorActionsCard";
import UserCommonAction from "../components/UserCommonAction";
import AdminProfileHeader from "../components/AdminProfileHeader";
import { organizationService } from "../../../../network/repo/organization/OrganizationService";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../../navigation/navUtils";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHooks";
import { getUserOrgProfileData } from "../../../../redux/organization/reducers/userProfileReducer";

const AdminCreatorProfile: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);
    const [organization, setOrganization] = useState<any>()
    const dispatch = useAppDispatch()
    const userProfileData = useAppSelector(state => state.userProfileReducer.userProfileSuccess)
    const userProfileLoading = useAppSelector(state => state.userProfileReducer.userProfileLoading)

    useEffect(() => {
        if(!userProfileData)
            dispatch(getUserOrgProfileData({}))
    }, [])

    useEffect(() => {
        if(userProfileData)
            setOrganization(userProfileData?.data)
    },[userProfileData])

    const handleActionPress = (action: string) => {
        if(action === 'My Contents')
            navScreen(navigation, AppScreens.CONTENT_STACK, NAV_ACTIONS.NAVIGATE, {
                screen: AppScreens.MY_PUBLISHED_CONTENT_SCREEN
            })
        else if(action === 'Archive Contents'){
            navScreen(navigation, AppScreens.CONTENT_STACK, NAV_ACTIONS.NAVIGATE, {
                screen: AppScreens.MY_ARCHIVE_CONTENT_SCREEN
            })
        }
        else if(action === 'Pending Videos')
            console.log('Pending Videos')
        else if(action === 'New Video'){
            navScreen(navigation, AppScreens.UPLOAD_VIDEO_STACK, NAV_ACTIONS.NAVIGATE)
        }
        else if(action === 'Raise an Issue')
            console.log('Raise an Issue')
    }

    return (
        <BaseView>
            <AdminProfileHeader
                theme={theme}
                onSettingPress={() => {}}
            />
            <ScrollView
                style={[styles.container, { backgroundColor: theme.colors.background }]}
            >
                {
                    organization &&
                        <View style={{  }}>
                            <CreatorProfileCard theme={theme} data={organization} onEditPress={() => {
                                navScreen(navigation, AppScreens.ADMIN_PROFILE_EDIT_STACK, NAV_ACTIONS.NAVIGATE, {
                                    screen: AppScreens.ADMIN_PROFILE_EDIT_SCREEN,
                                    params: {...organization}
                                })
                            }}/>
                            <CreatorActionsCard theme={theme} onActionPress={handleActionPress}/>
                            <UserCommonAction theme={theme} />
                        </View>
                }
            </ScrollView>
        </BaseView>
    );
};

export default AdminCreatorProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
