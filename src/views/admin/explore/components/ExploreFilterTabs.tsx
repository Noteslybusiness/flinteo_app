import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { SlidersHorizontal, ArrowUpDown, Shapes, User } from "lucide-react-native";

interface Props {
    theme: any;
    onSortPress: () => void;
    onTypePress: () => void;
    onUserFilterPress: () => void;
    activeTab?: "sort" | "type" | "user";
    indicators?: {
        sort?: boolean;
        type?: boolean;
        user?: boolean;
    };
}

const ExploreFilterTabs: React.FC<Props> = ({
    theme,
    onSortPress,
    onTypePress,
    onUserFilterPress,
    activeTab,
    indicators
}) => {
    return (
        <View style={styles.container}>
            {/* <Tab
                label="Sort"
                icon={ArrowUpDown}
                active={activeTab === "sort"}
                onPress={onSortPress}
                theme={theme}
            />
            <Tab
                label="Types"
                icon={Shapes}
                active={activeTab === "type"}
                onPress={onTypePress}
                theme={theme}
            />
            <Tab
                label="Users"
                icon={User}
                active={activeTab === "user"}
                onPress={onUserFilterPress}
                theme={theme}
            /> */}
            <Tab
                label="Sort"
                icon={ArrowUpDown}
                onPress={onSortPress}
                theme={theme}
                showDot={indicators?.sort}
            />

            <Tab
                label="Types"
                icon={Shapes}
                onPress={onTypePress}
                theme={theme}
                showDot={indicators?.type}
            />

            <Tab
                label="Users"
                icon={User}
                onPress={onUserFilterPress}
                theme={theme}
                showDot={indicators?.user}
            />

        </View>
    );
};

const Tab = ({
    label,
    icon: Icon,
    active,
    onPress,
    theme,
    showDot,
}: any) => {
    const bgColor = active
        ? theme.colors.primary
        : theme.colors.surface;

    const textColor = active
        ? theme.colors.whiteColor
        : theme.colors.text;

    return (
        // <TouchableOpacity
        //     activeOpacity={0.8}
        //     onPress={onPress}
        //     style={[
        //         styles.tab,
        //         {
        //             backgroundColor: bgColor,
        //             borderColor: active
        //                 ? theme.colors.primary
        //                 : theme.colors.border,
        //         },
        //     ]}
        // >
        //     <Icon size={16} color={textColor} />
        //     <Text style={[styles.text, { color: textColor }]}>
        //         {label}
        //     </Text>
        // </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.tab,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
            ]}
        >
            <View style={styles.iconWrapper}>
                <Icon size={16} color={theme.colors.text} />

               
            </View>

            <Text style={[styles.text, { color: theme.colors.text }]}>
                {label}
            </Text>
             {showDot && (
                    <View
                        style={[
                            styles.dot,
                            { backgroundColor: theme.colors.error || "#E53935" },
                        ]}
                    />
                )}
        </TouchableOpacity>

    );
};

export default ExploreFilterTabs;


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: scaleX(10),
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(10),
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scaleX(6),
        paddingHorizontal: scaleX(14),
        paddingVertical: scaleY(8),
        borderRadius: 999,
        borderWidth: 1,
        elevation: 1,
    },
    text: {
        fontSize: 13,
        fontWeight: "600",
    },

    iconWrapper: {
        // position: "relative",
    },

    dot: {
        // position: "absolute",
        top: -2,
        right: -10,
        width: 8,
        height: 8,
        borderRadius: 4,
    },

});
