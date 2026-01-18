import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    Alert,
    TextInput,
    Platform,
    Dimensions,
} from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { userGroupService } from "../../../../network/repo/users/UserService";
import { Trash2, Users, Plus, Pencil } from "lucide-react-native";
import GlobalHeader from "../../../common/components/GlobalHeader";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import AddGroupUsersModal from "../components/AddGroupUsersModal";
import LinearGradient from "react-native-linear-gradient";

const UserGroupDetails: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);
    const [groupInfo, setGroupInfo] = useState<any>(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route?.params?.group?.id) {
            fetchUserGroupInfo();
        }
    }, []);

    const fetchUserGroupInfo = async () => {
        try {
            const res = await userGroupService.getUserGroupInfo(
                route?.params?.group?.id
            );
            if (res.data?.result) {
                setGroupInfo(res.data.data);
                setGroupName(res.data.data.group_name);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onAddUsers = async (ids: any[]) => {
        try {
            const res = await userGroupService.updateUserGroupMapping({
                group_id: route?.params?.group?.id,
                user_ids: ids,
            });
            if (res.data?.result) fetchUserGroupInfo();
        } catch (e) {
            console.log(e);
        }
    };

    const confirmDeleteGroup = () => {
        Alert.alert(
            "Delete Group",
            "Are you sure you want to delete this group?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: deleteGroup,
                },
            ]
        );
    };

    const deleteGroup = async () => {
        try {
            await userGroupService.deleteUserGroup({
                id: route?.params?.group?.id,
            });
            navigation.goBack();
        } catch (e) {
            console.log(e);
        }
    };

    const confirmRemoveUser = (userId: number) => {
        Alert.alert(
            "Remove User",
            "Remove this user from the group?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => removeUser(userId),
                },
            ]
        );
    };

    const removeUser = async (userId: number) => {
        try {
            await userGroupService.updateUserGroupMapping({
                group_id: route?.params?.group?.id,
                user_id: userId,
            });
            fetchUserGroupInfo();
        } catch (e) {
            console.log(e);
        }
    };

    const updateGroupName = async () => {
        if (!groupName.trim()) return;
        setLoading(true);
        try {
            await userGroupService.updateUserGroup({
                id: route?.params?.group?.id,
                name: groupName.trim(),
            });
            setShowEditModal(false);
            fetchUserGroupInfo();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseView>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <GlobalHeader
                    theme={theme}
                    title="User Group"
                    onBackPress={() => navigation.goBack()}
                    actionDelete={confirmDeleteGroup}
                />

                <View style={styles.contentContainer}>
                    {groupInfo && (
                        <LinearGradient
                            colors={[
                                theme.colors.secondary,
                                theme.colors.secondary + "CC",
                            ]}
                            style={styles.groupCard}
                        >
                            <View style={styles.groupHeader}>
                                <View style={styles.iconCircle}>
                                    <Users size={20} color="#fff" />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.groupName}>
                                        {groupInfo.group_name}
                                    </Text>
                                    <Text style={styles.groupCount}>
                                        {groupInfo.count} Members
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => setShowEditModal(true)}>
                                    <Pencil size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    )}

                    <View style={styles.usersHeader}>
                        <Text style={[styles.usersTitle, { color: theme.colors.surfaceText }]}>
                            Users
                        </Text>

                        <TouchableOpacity
                            style={[styles.addBtn,{backgroundColor: theme.colors.primary}]}
                            onPress={() => setShowAddUserModal(true)}
                        >
                            <Plus size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={groupInfo?.users || []}
                        keyExtractor={(i) => i.user_id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: scaleY(20) }}
                        renderItem={({ item }) => {
                            const initials = item.name
                                ?.split(" ")
                                ?.map((n: string) => n[0])
                                ?.join("")
                                ?.toUpperCase()
                                ?.slice(0, 2);

                            return (
                                <LinearGradient
                                    colors={[
                                        theme.colors.surface,
                                        theme.colors.surface + "FA",
                                    ]}
                                    style={[styles.userCard, { borderColor: theme.colors.border}]}
                                >
                                    {/* LEFT */}
                                    <View style={styles.userLeft}>
                                        {/* AVATAR */}
                                        <LinearGradient
                                            colors={[
                                                theme.colors.primary,
                                                theme.colors.primary + "CC",
                                            ]}
                                            style={styles.avatar}
                                        >
                                            <Text style={styles.avatarText}>
                                                {initials}
                                            </Text>
                                        </LinearGradient>

                                        {/* USER INFO */}
                                        <View style={styles.userInfo}>
                                            <Text style={styles.userName}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.userEmail}>
                                                {item.email}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* RIGHT */}
                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        onPress={() =>
                                            confirmRemoveUser(item.user_id)
                                        }
                                    >
                                        <Trash2
                                            size={16}
                                            color={theme.colors.error}
                                        />
                                    </TouchableOpacity>
                                </LinearGradient>
                            );
                        }}
                    />

                </View>

                {/* ADD USERS MODAL */}
                <AddGroupUsersModal
                    visible={showAddUserModal}
                    onClose={() => setShowAddUserModal(false)}
                    onSubmit={(userIds) => {
                        setShowAddUserModal(false);
                        onAddUsers(userIds);
                    }}
                />

                {/* EDIT GROUP MODAL */}
                <Modal transparent animationType="fade" visible={showEditModal}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
                            <Text style={styles.modalTitle}>Edit Group Name</Text>

                            <TextInput
                                value={groupName}
                                onChangeText={setGroupName}
                                placeholder="Group name"
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                style={[
                                    styles.input,
                                    { color: theme.colors.onSurface },
                                ]}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalBtn, styles.cancelBtn]}
                                    onPress={() => setShowEditModal(false)}
                                >
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalBtn,{backgroundColor: theme.colors.primary}]}
                                    disabled={loading}
                                    onPress={updateGroupName}
                                >
                                    <Text style={styles.saveText}>
                                        {loading ? "Saving..." : "Save"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </BaseView>
    );
};

export default UserGroupDetails;


const styles = StyleSheet.create({
    container: { flex: 1 },

    contentContainer: {
        flex: 1,
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(16),
    },

    groupCard: {
        width: Matrix.DIM_100,
        borderRadius: scaleX(18),
        padding: scaleX(18),
        marginBottom: scaleY(18)
    },

    groupHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: scaleX(12),
    },

    groupName: {
        fontSize: scaleY(18),
        fontWeight: "700",
        color: "#fff",
    },

    groupCount: {
        fontSize: scaleY(12),
        color: "rgba(255,255,255,0.85)",
        marginTop: 2,
    },

    usersHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: scaleY(12),
        marginHorizontal: scaleX(16)
    },

    usersTitle: {
        fontSize: scaleY(18),
        fontWeight: "600",
    },

    addBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
      
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },

    userCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scaleX(14),
        borderRadius: scaleX(12),
        marginBottom: scaleY(12),
        width: Matrix.DIM_100,
        borderWidth: 0.5,
    },

    userLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    avatar: {
        width: scaleX(44),
        height: scaleX(44),
        borderRadius: scaleX(22),
        alignItems: "center",
        justifyContent: "center",
        marginRight: scaleX(12),
    },

    avatarText: {
        color: "#fff",
        fontSize: scaleY(14),
        fontWeight: "700",
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: scaleY(15),
        fontWeight: "600",
        color: "#111",
    },

    userEmail: {
        fontSize: scaleY(12),
        color: "#666",
        marginTop: 2,
    },

    deleteBtn: {
        width: scaleX(34),
        height: scaleX(34),
        borderRadius: scaleX(17),
        backgroundColor: "rgba(255,0,0,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },

    trashBtn: {
        padding: scaleX(6),
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: scaleX(16),
    },

    modalCard: {
        borderRadius: scaleX(18),
        padding: scaleX(20),
    },

    modalTitle: {
        fontSize: scaleY(18),
        fontWeight: "700",
        marginBottom: scaleY(14),
    },

    input: {
        borderWidth: 1,
        borderRadius: scaleX(12),
        padding: scaleX(12),
        marginBottom: scaleY(18),
    },

    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    modalBtn: {
        flex: 1,
        paddingVertical: scaleY(14),
        borderRadius: scaleX(12),
        alignItems: "center",
        marginHorizontal: scaleX(6),
    },

    cancelBtn: {
        borderWidth: 1,
        borderColor: "#ccc",
    },

    saveBtn: {
        backgroundColor: "#4F46E5",
    },

    cancelText: {
        fontWeight: "600",
    },

    saveText: {
        color: "#fff",
        fontWeight: "700",
    },
});
