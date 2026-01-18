import { StyleSheet, View } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import UsersHeader from "../components/UsersHeader";
import { useContext } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { scaleX } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";

import UserListView from "../components/UserListView";
import UserKpiSection from "../components/UserKpiSection";
import GroupListView from "../components/GroupListView";

const Tab = createMaterialTopTabNavigator();

const UsersScreen: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const theme = useContext(ThemeContext);

    return (
        <BaseView>
            <View style={styles.container}>
                <UsersHeader title="Users" theme={theme} />
                {/* KPI Section */}
               
                <UserKpiSection />
               
                {/* Tabs */}
                <Tab.Navigator
                    screenOptions={{
                        swipeEnabled: true,
                        tabBarIndicatorStyle: {
                            backgroundColor: theme.colors.primary,
                            height: 3,
                            borderRadius: 3,
                          
                        },
                        tabBarStyle: {
                            backgroundColor: theme.colors.background,
                            elevation: 0,
                        },
                        tabBarLabelStyle: {
                            fontFamily: FONTS.InterSemiBold,
                            fontSize: scaleX(14),
                            textTransform: "none",
                        },
                        tabBarActiveTintColor: theme.colors.primary,
                        tabBarInactiveTintColor: theme.colors.grayField,
                    }}
                >
                    <Tab.Screen name="Users" component={UserListView} />
                    <Tab.Screen name="Groups" component={GroupListView} />
                </Tab.Navigator>
            </View>
        </BaseView>
    );
};

export default UsersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
