import { StyleSheet, View } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import UsersHeader from "../components/UsersHeader";
import { useContext } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX } from "../../../../utils/baseDim";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FONTS } from "../../../../assets/theme/appFonts";
import AddSingleUser from "../components/AddSingleUser";
import AddBulkUser from "../components/AddBulkUser";
const Tab = createMaterialTopTabNavigator();

const AddUserScreen: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);

    return (
        <BaseView>
            <View style={styles.container}>
                <UsersHeader title="Add Users" theme={theme} onBackPress={() => navigation.goBack()} />
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
                    <Tab.Screen
                        name="Single User"
                        component={AddSingleUser}
                    />
                    <Tab.Screen
                        name="Bulk Upload"
                        component={AddBulkUser}
                    />
                </Tab.Navigator>
            </View>
        </BaseView>
    );
};

export default AddUserScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});
