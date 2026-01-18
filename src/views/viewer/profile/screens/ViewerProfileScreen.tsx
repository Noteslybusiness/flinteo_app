import { StyleSheet, Text, View } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import ProfileHeader from "../components/ProfileHeader";
import UserCommonAction from "../../../admin/profile/components/UserCommonAction";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { userService } from "../../../../network/repo/users/UserService";
import ProfileDetailsCard from "../components/ProfileDetailsCard";


const ViewerProfileScreen:React.FC<DefaultScreenProps> = () => {
    const theme = useContext(ThemeContext)
    const [userInfo, setUserInfo] = useState<any>()

    useEffect(() => {
        fetchUserInfo()
    },[])

    const fetchUserInfo = async () => {
        try {
            const response = await userService.getUserProfile()
            setUserInfo(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    return <BaseView>
        <View style={[styles.container, {
            backgroundColor: theme.colors.background,
        }]}>
            <ProfileHeader theme={theme} title="Profile"/>
            <View style={styles.contentContainer}>
                {
                    userInfo &&
                        <ProfileDetailsCard
                            theme={theme}
                            userInfo={userInfo}
                        />
                }
                <UserCommonAction theme={theme}/>
                
            </View>
        </View>
    </BaseView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(16)
    }
})

export default ViewerProfileScreen