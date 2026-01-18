import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Search, Inbox, User } from "lucide-react-native";
import { Matrix, scaleX, scaleY, SCREEN, VIEWER_BAR_HEIGHT } from "../../../utils/baseDim";
import { ThemeContext } from "../../../assets/theme/themeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
    { id: "Home", label: "Home", icon: Home },
    { id: "Discover", label: "Discover", icon: Search },
    { id: "Inbox", label: "Inbox", icon: Inbox },
    { id: "Profile", label: "Profile", icon: User },
];

const ViewerBottomBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
    const theme = useContext(ThemeContext)
    const inset = useSafeAreaInsets()

    return (
        <View style={styles.wrapper}>
            <View style={[styles.container, { backgroundColor: theme.colors.background, paddingBottom: inset.bottom + 8}]}>
                {state.routes.map((route, index) => {
                    const isActive = state.index === index;

                    const tabConfig = tabs.find(t => t.id === route.name);
                    if (!tabConfig) return null;

                    const Icon = tabConfig.icon;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={styles.tabBtn}
                            onPress={() => navigation.navigate(route.name)}
                        >
                            <Icon
                                size={22}
                                color={isActive ? "#3366FF" : "#8A8A8A"}
                                strokeWidth={2}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    { color: isActive ? "#3366FF" : "#8A8A8A" },
                                ]}
                            >
                                {tabConfig.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default ViewerBottomBar;

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 999,
        height: VIEWER_BAR_HEIGHT,
        paddingTop: scaleY(12)
    },

    container: {
        width: Matrix.DIM_100,
        height: VIEWER_BAR_HEIGHT,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        paddingHorizontal: 14,
        // borderTopLeftRadius: scaleX(16),
        // borderTopRightRadius: scaleX(16),
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 8,
    },

    tabBtn: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },

    label: {
        marginTop: 3,
        fontSize: 12,
        fontWeight: "600",
    },
});
