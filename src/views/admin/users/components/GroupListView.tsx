import { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { userGroupService } from "../../../../network/repo/users/UserService";
import { Users, Plus, User } from "lucide-react-native";
import {
    AppScreens,
    NAV_ACTIONS,
    navScreen,
} from "../../../../navigation/navUtils";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../../../assets/theme/appFonts";
import GlobalSearchBar from "../../../common/components/GlobalSearchBar";

const GroupListView = () => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation();

    const [groups, setGroups] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await userGroupService.getUserGroups();
            setGroups(res?.data?.data || []);
        } catch (e) {
            console.log(e);
        }
    };

    const createGroup = async () => {
        if (!groupName.trim()) return;
        try {
            setLoading(true);
            await userGroupService.addUserGroup({ name: groupName });
            setGroupName("");
            setShowModal(false);
            fetchGroups();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderGroupCard = ({ item }: any) => (
        <TouchableOpacity
            activeOpacity={0.85}
            style={[
                styles.card,
                { backgroundColor: theme.colors.surface },
            ]}
            onPress={() =>
                navScreen(
                    navigation,
                    AppScreens.USERS_STACK,
                    NAV_ACTIONS.NAVIGATE,
                    {
                        screen: AppScreens.USER_GROUP_DETAILS,
                        params: { group: item },
                    }
                )
            }
        >
            <View style={styles.row}>
                <View
                    style={[
                        styles.iconWrapper,
                        { backgroundColor: theme.colors.primaryContainer },
                    ]}
                >
                    <Users size={22} color={theme.colors.primary} />
                </View>
                <View style={styles.content}>
                    <Text
                        numberOfLines={1}
                        style={[styles.title, { color: theme.colors.text }]}
                    >
                        {item.name}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.subtitle,
                            { color: theme.colors.surfaceText },
                        ]}
                    >
                        {item.description || "No description added"}
                    </Text>
                </View>
                <View
                    style={[
                        styles.memberChip,
                        {
                            backgroundColor:
                                theme.colors.secondary + "22",
                        },
                    ]}
                >
                    <User size={14} color={theme.colors.secondary} />
                    <Text
                        style={[
                            styles.memberText,
                            { color: theme.colors.secondary },
                        ]}
                    >
                        {item.active_members || 0}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                    placeholder="Search Group By Name, Description.."
                />
            </View>
            <FlatList
                data={groups}
                renderItem={renderGroupCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    padding: scaleX(14),
                    paddingBottom: scaleY(90),
                }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Users size={48} color={theme.colors.surfaceText} />
                        <Text
                            style={[
                                styles.emptyTitle,
                                { color: theme.colors.text },
                            ]}
                        >
                            No groups yet
                        </Text>
                        <Text
                            style={[
                                styles.emptySub,
                                { color: theme.colors.surfaceText },
                            ]}
                        >
                            Create your first group to get started
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={[
                    styles.fab,
                    { backgroundColor: theme.colors.primary },
                ]}
            >
                <Plus size={26} color={theme.colors.onPrimary} />
            </TouchableOpacity>

            {/* Create Group Modal */}
            <Modal transparent visible={showModal} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalCard,
                            { backgroundColor: theme.colors.surface },
                        ]}
                    >
                        <Text
                            style={[
                                styles.modalTitle,
                                { color: theme.colors.text },
                            ]}
                        >
                            Create Group
                        </Text>

                        <View
                            style={[
                                styles.inputBox,
                                { borderColor: theme.colors.border },
                            ]}
                        >
                            <TextInput
                                value={groupName}
                                onChangeText={setGroupName}
                                placeholder="Group name"
                                placeholderTextColor={theme.colors.surfaceText}
                                style={[
                                    styles.input,
                                    { color: theme.colors.text },
                                ]}
                            />
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={[
                                    styles.btn,
                                    {
                                        borderColor: theme.colors.border,
                                        borderWidth: 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={{ color: theme.colors.surfaceText }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={!groupName || loading}
                                onPress={createGroup}
                                style={[
                                    styles.btn,
                                    {
                                        backgroundColor: theme.colors.primary,
                                        opacity:
                                            !groupName || loading
                                                ? 0.6
                                                : 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={{ color: theme.colors.onPrimary }}
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default GroupListView;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: scaleY(16),
        paddingVertical: scaleY(16)
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

    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },

    content: {
        flex: 1,
        marginLeft: scaleX(12),
    },

    title: {
        fontSize: 15,
        fontFamily: FONTS.InterSemiBold,
    },

    subtitle: {
        fontSize: 13,
        marginTop: 4,
        fontFamily: FONTS.InterRegular,
    },

    memberChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },

    memberText: {
        fontSize: 12,
        fontFamily: FONTS.InterSemiBold,
    },

    fab: {
        position: "absolute",
        bottom: 18,
        right: 18,
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },

    emptyState: {
        alignItems: "center",
        marginTop: scaleY(120),
    },

    emptyTitle: {
        fontSize: 18,
        marginTop: 12,
        fontFamily: FONTS.InterSemiBold,
    },

    emptySub: {
        fontSize: 14,
        marginTop: 6,
        fontFamily: FONTS.InterRegular,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end",
    },

    modalCard: {
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    modalTitle: {
        fontSize: 18,
        marginBottom: 16,
        fontFamily: FONTS.InterSemiBold,
    },

    inputBox: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        justifyContent: "center",
        marginBottom: 20,
    },

    input: {
        fontSize: 16,
    },

    actions: {
        flexDirection: "row",
        gap: 12,
    },

    btn: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
});
