// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     Modal,
//     StyleSheet,
// } from "react-native";
// import { useContext, useEffect, useState } from "react";
// import { ThemeContext } from "../../../../assets/theme/themeContext";
// import { userService } from "../../../../network/repo/users/UserService";
// import { X, Check, Plus } from "lucide-react-native";
// import { scaleX, scaleY } from "../../../../utils/baseDim";

// interface Props {
//     visible: boolean;
//     onClose: () => void;
//     onSubmit: (userIds: number[]) => void;
// }

// const AddGroupUsersModal: React.FC<Props> = ({
//     visible,
//     onClose,
//     onSubmit,
// }) => {
//     const theme = useContext(ThemeContext);
//     const { colors } = theme;

//     const [users, setUsers] = useState<any[]>([]);
//     const [selected, setSelected] = useState<any[]>([]);
//     const [page, setPage] = useState(1);
//     const [pagination, setPagination] = useState<any>(null);
//     const [loading, setLoading] = useState(false);
//     const [query, setQuery] = useState("");

//     useEffect(() => {
//         if (visible) {
//             resetAndFetch();
//         }
//     }, [visible]);

//     const resetAndFetch = () => {
//         setUsers([]);
//         setSelected([]);
//         setPage(1);
//         fetchViewers(1, true);
//     };

//     const fetchViewers = async (pageNo = 1, reset = false) => {
//         if (loading) return;
//         setLoading(true);

//         try {
//             const res = await userService.getViewerList({
//                 page: pageNo,
//                 limit: 20,
//                 query,
//             });

//             if (res?.data?.result) {
//                 setUsers((prev) =>
//                     reset ? res.data.data.items : [...prev, ...res.data.data.items]
//                 );
//                 setPagination(res.data.data.pagination);
//                 setPage(pageNo);
//             }
//         } catch (e) {
//             console.log(e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleUser = (user: any) => {
//         const exists = selected.find((u) => u.id === user.id);
//         if (exists) {
//             setSelected((prev) => prev.filter((u) => u.id !== user.id));
//         } else {
//             setSelected((prev) => [...prev, user]);
//         }
//     };

//     const isSelected = (id: number) =>
//         selected.some((u) => u.id === id);

//     const renderUser = ({ item }: any) => (
//         <TouchableOpacity
//             style={[
//                 styles.viewerCard,
//                 {
//                     backgroundColor: colors.surface,
//                     borderColor: isSelected(item.id)
//                         ? colors.primary
//                         : colors.border,
//                 },
//             ]}
//             onPress={() => toggleUser(item)}
//         >
//             <View>
//                 <Text style={[styles.userName, { color: colors.onSurface }]}>
//                     {item.first_name} {item.last_name}
//                 </Text>
//                 <Text
//                     style={[
//                         styles.userEmail,
//                         { color: colors.onSurfaceVariant },
//                     ]}
//                 >
//                     {item.email}
//                 </Text>
//             </View>

//             {isSelected(item.id) ? (
//                 <Check size={18} color={colors.primary} />
//             ) : (
//                 <Plus size={18} color={colors.surfaceText} />
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//             <View
//                 style={[
//                     styles.modalScreen,
//                     { backgroundColor: colors.background },
//                 ]}
//             >
//                 {/* HEADER */}
//                 <View
//                     style={[
//                         styles.modalHeader,
//                         { borderBottomColor: colors.border },
//                     ]}
//                 >
//                     <Text
//                         style={[
//                             styles.modalTitle,
//                             { color: colors.onSurface },
//                         ]}
//                     >
//                         Add Users
//                     </Text>
//                     <TouchableOpacity onPress={onClose}>
//                         <X size={22} color={colors.onSurface} />
//                     </TouchableOpacity>
//                 </View>

//                 {/* SELECTED CHIPS */}
//                 {selected.length > 0 && (
//                     <View>
//                         <FlatList
//                         horizontal
//                         data={selected}
//                         keyExtractor={(i) => i.id.toString()}
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.chipRow}
//                         renderItem={({ item }) => (
//                             <View
//                                 style={[
//                                     styles.chip,
//                                     { backgroundColor: colors.primaryContainer },
//                                 ]}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.chipText,
//                                         { color: colors.primary },
//                                     ]}
//                                 >
//                                     {item.first_name}
//                                 </Text>
//                                 <TouchableOpacity
//                                     onPress={() => toggleUser(item)}
//                                 >
//                                     <X size={14} color={colors.primary} />
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     />
//                     </View>
//                 )}

//                 {/* USER LIST */}
//                 <FlatList
//                     data={users}
//                     keyExtractor={(item) => item.id.toString()}
//                     renderItem={renderUser}
//                     contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: scaleX(16) }}
//                     onEndReached={() => {
//                         if (pagination?.has_next) {
//                             fetchViewers(page + 1);
//                         }
//                     }}
//                     onEndReachedThreshold={0.4}
//                 />

//                 {/* FOOTER */}
//                 <View
//                     style={[
//                         styles.modalFooter,
//                         { borderTopColor: colors.border, backgroundColor: colors.surface},
//                     ]}
//                 >
//                     <TouchableOpacity
//                         style={[
//                             styles.footerBtn,
//                             { backgroundColor: colors.surface },
//                         ]}
//                         onPress={onClose}
//                     >
//                         <Text style={{ color: colors.onSurface }}>
//                             Close
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[
//                             styles.footerBtn,
//                             {
//                                 backgroundColor:
//                                     selected.length === 0
//                                         ? colors.border
//                                         : colors.primary,
//                             },
//                         ]}
//                         disabled={selected.length === 0}
//                         onPress={() =>
//                             onSubmit(selected.map((u) => u.id))
//                         }
//                     >
//                         <Text style={{ color: "#fff" }}>
//                             Add ({selected.length})
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// export default AddGroupUsersModal;

// const styles = StyleSheet.create({
//     modalScreen: {
//         flex: 1,
//     },

//     modalHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: scaleX(16),
//         paddingVertical: scaleY(14),
//         borderBottomWidth: 1,
//         borderTopLeftRadius: scaleX(12),
//         borderTopRightRadius: scaleX(12),
//         overflow:"hidden"
//     },

//     modalTitle: {
//         fontSize: 18,
//         fontWeight: "600",
//     },

//     chipRow: {
//         paddingHorizontal: scaleX(16),
//         paddingVertical: scaleY(8),
//         gap: scaleX(8),
//     },

//     chip: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: scaleX(12),
//         paddingVertical: scaleY(6),
//         borderRadius: 20,
//         gap: scaleX(6),
//     },

//     chipText: {
//         fontSize: 13,
//         fontWeight: "500",
//     },

//     viewerCard: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: scaleX(16),
//         paddingVertical: scaleY(14),
//         marginVertical: scaleY(6),
//         borderRadius: 12,
//         borderWidth: 1,
//     },

//     userName: {
//         fontSize: 15,
//         fontWeight: "500",
//         marginBottom: 2,
//     },

//     userEmail: {
//         fontSize: 12,
//         opacity: 0.7,
//     },

//     modalFooter: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         gap: scaleX(12),
//         paddingHorizontal: scaleX(16),
//         paddingVertical: scaleY(12),
//         borderTopWidth: 1,
//     },

//     footerBtn: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: scaleY(12),
//         borderRadius: 10,
//     },
// });

import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Platform,
    Image,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { userService } from "../../../../network/repo/users/UserService";
import { X, Check, Plus } from "lucide-react-native";
import { scaleX, scaleY } from "../../../../utils/baseDim";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (userIds: number[]) => void;
}

const AddGroupUsersModal: React.FC<Props> = ({
    visible,
    onClose,
    onSubmit,
}) => {
    const theme = useContext(ThemeContext);
    const { colors } = theme;

    const [users, setUsers] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [query] = useState("");

    useEffect(() => {
        if (visible) resetAndFetch();
    }, [visible]);

    const resetAndFetch = () => {
        setUsers([]);
        setSelected([]);
        setPage(1);
        fetchViewers(1, true);
    };

    const fetchViewers = async (pageNo = 1, reset = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await userService.getViewerList({
                page: pageNo,
                limit: 20,
                query,
            });

            if (res?.data?.result) {
                setUsers(prev =>
                    reset
                        ? res.data.data.items
                        : [...prev, ...res.data.data.items]
                );
                setPagination(res.data.data.pagination);
                setPage(pageNo);
            }
        } finally {
            setLoading(false);
        }
    };


    const toggleUser = (user: any) => {
        setSelected(prev =>
            prev.some(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        );
    };

    const isSelected = (id: number) =>
        selected.some(u => u.id === id);

    const renderUser = ({ item }: any) => {
        const selectedState = isSelected(item.id);

        console.log("RERENDER USER ITEM", item);

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.viewerCard,
                    {
                        backgroundColor: colors.surface,
                        borderColor: selectedState
                            ? colors.primary
                            : colors.border,
                    },
                ]}
                onPress={() => toggleUser(item)}
            >
                <View style={{ flexDirection: "row", gap: scaleX(12), alignItems: "center" }}>
                    <View style={styles.profileWrap} >
                        {item.profile_image ?
                            <Image source={{ uri: item.profile_image }} style={{ width: "100%", height: "100%", borderRadius: scaleY(18) }} />
                            : <Text style={{ color: colors.whiteColor, fontSize: scaleX(18), textTransform: 'capitalize' }} >
                                {item?.first_name?.charAt(0)}
                            </Text>}
                    </View>
                    <View style={{}}>
                        <Text
                            style={[
                                styles.userName,
                                { color: colors.onSurface },
                            ]}
                            numberOfLines={1}
                        >
                            {item.first_name} {item.last_name}
                        </Text>
                        <Text
                            style={[
                                styles.userEmail,
                                { color: colors.onSurfaceVariant },
                            ]}
                            numberOfLines={1}
                        >
                            {item.email}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.iconWrap,
                        {
                            backgroundColor: selectedState
                                ? colors.primary
                                : colors.surfaceVariant,
                        },
                    ]}
                >
                    {selectedState ? (
                        <Check size={16} color="#fff" />
                    ) : (
                        <Plus size={16} color={colors.onSurfaceVariant} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View
                style={[
                    styles.modalScreen,
                    { backgroundColor: colors.background },
                ]}
            >
                {/* HEADER */}
                <View
                    style={[
                        styles.modalHeader,
                        { backgroundColor: colors.surface },
                    ]}
                >
                    <Text
                        style={[
                            styles.modalTitle,
                            { color: colors.onSurface },
                        ]}
                    >
                        Add Users
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 50, padding: 6 }} onPress={onClose}>
                        <X size={12} color={colors.whiteColor} />
                    </TouchableOpacity>
                </View>

                {/* SELECTED CHIPS */}
                {selected.length > 0 && (
                    <FlatList
                        horizontal
                        data={selected}
                        keyExtractor={i => i.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipRow}
                        renderItem={({ item }) => (
                            <View style={[styles.chip, { backgroundColor: colors.primaryContainer }]}>
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: colors.primary },
                                    ]}
                                >
                                    {item.first_name}
                                </Text>
                                <TouchableOpacity onPress={() => toggleUser(item)}>
                                    <X size={14} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

                {/* USER LIST */}
                <FlatList
                    data={users}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderUser}
                    contentContainerStyle={{
                        paddingHorizontal: scaleX(16),
                        paddingBottom: scaleY(120),
                    }}
                    onEndReached={() => {
                        if (pagination?.has_next) {
                            fetchViewers(page + 1);
                        }
                    }}
                    onEndReachedThreshold={0.4}
                />

                {/* FOOTER */}
                <View
                    style={[
                        styles.modalFooter,
                        {
                            backgroundColor: colors.surface,
                            borderTopColor: colors.border,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.footerBtn,
                            { backgroundColor: colors.surfaceVariant },
                        ]}
                        onPress={onClose}
                    >
                        <Text style={{ color: colors.onSurface }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.footerBtn,
                            {
                                backgroundColor:
                                    selected.length === 0
                                        ? colors.border
                                        : colors.primary,
                            },
                        ]}
                        disabled={selected.length === 0}
                        onPress={() =>
                            onSubmit(selected.map(u => u.id))
                        }
                    >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                            Add ({selected.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddGroupUsersModal;


const styles = StyleSheet.create({
    modalScreen: {
        flex: 1,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(16),
        // borderBottomWidth: StyleSheet.hairlineWidth,
        elevation: 3,
        marginBottom: scaleY(8),
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
    },

    chipRow: {
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(10),
        gap: scaleX(8),
    },

    chip: {
        flexDirection: "row",
        gap: scaleX(6),
        alignItems: "center",
        height: scaleY(32),
        paddingHorizontal: scaleX(12),
        borderRadius: 6,

        // alignItems: "center",
        // paddingHorizontal: scaleX(12),
        // paddingVertical: scaleY(18),
        // borderRadius: 20,
        // gap: scaleX(6),
    },

    chipText: {
        fontSize: 13,
        fontWeight: "500",

    },
    profileWrap: {
        width: scaleX(40),
        height: scaleX(40),
        borderRadius: scaleY(40),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    viewerCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: scaleX(12),
        padding: scaleX(14),
        marginVertical: scaleY(6),
        borderRadius: 14,
        borderWidth: 1,
        ...Platform.select({
            android: { elevation: 2 },
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
            },
        }),
    },

    userName: {
        fontSize: 15,
        fontWeight: "500",
        textTransform: "capitalize",
    },

    userEmail: {
        fontSize: 12,
        opacity: 0.7,
    },

    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
    },

    modalFooter: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        gap: scaleX(12),
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(14),
        borderTopWidth: StyleSheet.hairlineWidth,
    },

    footerBtn: {
        flex: 1,
        height: scaleY(44),
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});
