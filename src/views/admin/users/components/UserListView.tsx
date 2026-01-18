import { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { Plus, Mail, Trash2 } from "lucide-react-native";
import { userService } from "../../../../network/repo/users/UserService";
import {
    AppScreens,
    NAV_ACTIONS,
    navScreen,
} from "../../../../navigation/navUtils";
import { useNavigation } from "@react-navigation/native";
import { UserSessionService } from "../../../../services/UserSessionService";
import { FONTS } from "../../../../assets/theme/appFonts";
import GlobalSearchBar from "../../../common/components/GlobalSearchBar";

const UserListView = () => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        UserSessionService.getUserProfile().then(setUserInfo);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await userService.getUsersList();
        if (res?.data?.data?.users) {
            setUsers(res.data.data.users);
        }
    };

    const confirmDelete = (user: any) => {
        Alert.alert("Delete User", `Delete ${user.first_name}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await userService.deleteUser({ user_id: user.id });
                    fetchUsers();
                },
            },
        ]);
    };

    const getInitials = (u: any) =>
        `${u.first_name?.[0] || ""}${u.last_name?.[0] || ""}`.toUpperCase();

    const getRoleColor = (role: string) => {
        const map: any = {
            admin: "#6366F1",
            creator: "#EC4899",
            viewer: "#14B8A6",
            manager: "#F59E0B",
        };
        return map[role?.toLowerCase()] || "#64748B";
    };

    const renderItem = ({ item }: any) => {
        const roleColor = getRoleColor(item.role_name);

        return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                {/* Header */}
                <View style={styles.row}>
                    {/* Avatar */}
                    <View
                        style={[
                            styles.avatarWrapper,
                            { borderColor: roleColor },
                        ]}
                    >
                        <View
                            style={[
                                styles.avatar,
                                { backgroundColor: roleColor },
                            ]}
                        >
                            <Text style={styles.avatarText}>
                                {getInitials(item)}
                            </Text>
                        </View>
                    </View>

                    {/* Info */}
                    <View style={styles.info}>
                        <View style={styles.nameRow}>
                            <Text
                                style={[
                                    styles.name,
                                    { color: theme.colors.text },
                                ]}
                            >
                                {item.first_name} {item.last_name || ""}
                            </Text>

                            {item.self && (
                                <View
                                    style={[
                                        styles.youBadge,
                                        {
                                            backgroundColor:
                                                theme.colors.primary,
                                        },
                                    ]}
                                >
                                    <Text style={styles.youText}>YOU</Text>
                                </View>
                            )}
                        </View>

                        {/* Role Chip */}
                        <View
                            style={[
                                styles.roleChip,
                                {
                                    backgroundColor: `${roleColor}22`,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.roleText,
                                    { color: roleColor },
                                ]}
                            >
                                {item.role_name}
                            </Text>
                        </View>
                    </View>

                    {/* Delete */}
                    {!item.self && userInfo?.role_name === "admin" && (
                        <TouchableOpacity
                            onPress={() => confirmDelete(item)}
                            style={styles.deleteBtn}
                        >
                            <Trash2
                                size={18}
                                color={theme.colors.error}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Email */}
                {item.email && (
                    <View style={styles.emailRow}>
                        <Mail size={14} color={theme.colors.surfaceText} />
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.email,
                                { color: theme.colors.surfaceText },
                            ]}
                        >
                            {item.email}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <View style={styles.headerContainer}>
                <GlobalSearchBar
                    onChange={() => { }}
                    value="" theme={theme}
                    placeholder="Search User By Name, Email.."
                />
            </View>
            <FlatList
                data={users}
                keyExtractor={(i) => i.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <TouchableOpacity
                onPress={() =>
                    navScreen(
                        navigation,
                        AppScreens.USERS_STACK,
                        NAV_ACTIONS.NAVIGATE,
                        { screen: AppScreens.ADD_USER_SCREEN }
                    )
                }
                style={[
                    styles.fab,
                    { backgroundColor: theme.colors.primary },
                ]}
            >
                <Plus size={22} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

export default UserListView;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: scaleY(16),
        paddingVertical: scaleY(16)
    },
    list: {
        padding: scaleX(14),
        paddingBottom: 90,
    },

    card: {
        borderRadius: 16,
        padding: scaleX(14),
        marginBottom: scaleY(12),
        borderWidth: 0.6,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatarWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },

    info: {
        flex: 1,
        marginLeft: scaleX(12),
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    name: {
        fontSize: 15,
        fontFamily: FONTS.InterSemiBold,
    },

    youBadge: {
        marginLeft: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },

    youText: {
        fontSize: 10,
        color: "#fff",
        fontFamily: FONTS.InterSemiBold,
    },

    roleChip: {
        marginTop: 4,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },

    roleText: {
        fontSize: 11,
        fontFamily: FONTS.InterMedium,
        textTransform: "capitalize",
    },

    deleteBtn: {
        padding: 6,
    },

    emailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: scaleY(10),
        paddingLeft: scaleX(62),
    },

    email: {
        marginLeft: 8,
        fontSize: 12,
        fontFamily: FONTS.InterRegular,
    },

    fab: {
        position: "absolute",
        right: 18,
        bottom: 18,
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
});
