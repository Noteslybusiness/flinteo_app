import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ThemeContext } from '../../../assets/theme/themeContext';
import { scaleX, scaleY } from '../../../utils/baseDim';
import { Home, Bell, User } from 'lucide-react-native';

const ViewerBottomBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const theme = useContext(ThemeContext);
    const { colors } = theme;

    const getTabIcon = (routeName: string, isFocused: boolean) => {
        const iconColor = isFocused ? colors.primary : colors.onSurfaceVariant;
        const iconSize = scaleX(24);

        switch (routeName) {
            case 'Home':
                return <Home size={iconSize} color={iconColor} />;
            case 'Notifications':
                return <Bell size={iconSize} color={iconColor} />;
            case 'Profile':
                return <User size={iconSize} color={iconColor} />;
            default:
                return <Home size={iconSize} color={iconColor} />;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined 
                    ? options.tabBarLabel 
                    : options.title !== undefined 
                    ? options.title 
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        style={styles.tab}
                        activeOpacity={0.7}
                    >
                        {getTabIcon(route.name, isFocused)}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: scaleY(60),
        paddingHorizontal: scaleX(20),
        paddingBottom: scaleY(8),
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ViewerBottomBar;