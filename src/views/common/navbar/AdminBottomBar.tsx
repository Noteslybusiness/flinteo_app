import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Home, Search, Users, User, Layers } from "lucide-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemeContext } from "../../../assets/theme/themeContext";
import { FONTS } from "../../../assets/theme/appFonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scaleY } from "../../../utils/baseDim";

const AdminBottomBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const icons: any = {
        Home: Home,
        Explore: Layers,
        Users: Users,
        Profile: User,
    };
    const theme = useContext(ThemeContext)
    const inset = useSafeAreaInsets()

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingBottom: inset.bottom + 8}]}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const IconComponent = icons[route.name];
                const onPress = () => {
                    if (!isFocused) navigation.navigate(route.name);
                };
                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tab}
                        activeOpacity={0.7}
                    >
                        <IconComponent
                            size={26}
                            color={isFocused ? theme.colors.primary : theme.colors.grayField}
                            strokeWidth={1.5}
                        />
                        <Text
                            style={[
                                styles.label,
                                { 
                                    color: isFocused ? theme.colors.primary : theme.colors.grayField,
                                    fontFamily: isFocused ? FONTS.InterSemiBold : FONTS.InterRegular
                                 },
                            ]}
                        >
                            {route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default AdminBottomBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderTopWidth: 0.5,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { height: -2, width: 0 },
        elevation: 10,
        paddingBottom: 10,
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: scaleY(12)
    },

    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    label: {
        fontSize: 12,
        marginTop: 2,
        fontWeight: "500",
    },
});
