import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import CommonHeader from "../components/CommonHeader";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import ArchiveVideosTab from "../components/ArchiveVideosTab";
import ArchiveCourseTab from "../components/ArchiveCourseTab";

const Tab = createMaterialTopTabNavigator();

const MyArchiveContents: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);

    return (
        <BaseView>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <CommonHeader theme={theme} title="Contents" onBackPress={() => navigation.goBack()}/>
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
                        name="Videos"
                        component={() => <ArchiveVideosTab />}
                    />
                    <Tab.Screen
                        name="Courses"
                        component={() => <ArchiveCourseTab />}
                    />
                </Tab.Navigator>
            </View>
        </BaseView>
    );
};

export default MyArchiveContents;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scene: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: scaleY(16),
    },
    placeholder: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterRegular,
        color: "#6B7280",
    },
});
