import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import {
    Edit3,
    Globe,
    Phone,
    Mail,
    Plus,
} from "lucide-react-native";

const CreatorProfileCard = ({
    theme,
    data,
    onEditPress,
}: {
    theme: AppTheme;
    data: any;
    onEditPress?: () => void;
}) => {
    const { colors } = theme;

    const user = data?.user_info || {};
    const org = data?.org_info || {};

    console.log("CreatorProfileCard - data:", data);

    const fullName =
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
        "—";

    return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {/* EDIT BUTTON */}


            {/* HEADER */}
            <View style={[styles.header, { backgroundColor: colors.surfaceVariant }]}>
               
                <View style={{ flexDirection: 'column', alignItems: 'center', paddingHorizontal: 16, zIndex: 99999 }} >
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                        }} >
                        <Image
                            source={{
                                uri:
                                    user?.profile_image ||
                                    "https://ui-avatars.com/api/?name=User",
                            }}
                            style={[styles.avatar, { borderColor: colors.primary }]}
                        />
                        {onEditPress && (
                            <TouchableOpacity
                                style={[
                                    styles.editBtn,
                                    { backgroundColor: colors.surfaceVariant },
                                ]}
                                onPress={onEditPress}
                                activeOpacity={0.7}
                            >
                                <Edit3 size={18} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={[styles.name, { color: colors.text }]}>
                        {fullName}
                    </Text>
                     {user?.role_name && (
                        <Text
                          
                            style={[
                                styles.orgName,
                                { color: colors.primary , marginTop: 0},
                            ]}
                        >
                            {user.role_name}
                        </Text>
                   )} 
                    <Text
                        style={[
                            styles.subText,
                            { color: colors.surfaceText },
                        ]}
                        numberOfLines={1}
                    >
                        {user?.email || "—"}
                    </Text>

                    {user?.mobile_number && (
                        <Text
                            style={[
                                styles.subText,
                                { color: colors.surfaceText },
                            ]}
                        >
                            {user.isd_code + " " + user.mobile_number}
                        </Text>
                    )}

                    {org?.name && (
                        <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                                styles.orgName,
                                { color: colors.primary, },
                            ]}
                        >
                            {org.name}
                        </Text>
                    )}
                </View>
            </View>

            {/* ORGANIZATION INFO */}
            <View
                style={[
                    styles.infoContainer,
                    // { backgroundColor: colors.surfaceVariant },
                ]}
            >
                <InfoRow
                    icon={<Globe size={18} color={colors.primary} />}
                    label="Website"
                    value={org?.website}
                    placeholder="Add website"
                    theme={theme}
                />

                <InfoRow
                    icon={<Phone size={18} color={colors.primary} />}
                    label="Organization Mobile"
                    value={org?.mobile}
                    placeholder="Add mobile"
                    theme={theme}
                />

                <InfoRow
                    icon={<Mail size={18} color={colors.primary} />}
                    label="Organization Email"
                    value={org?.email}
                    placeholder="Add email"
                    theme={theme}
                />
            </View>
        </View>
    );
};

const InfoRow = ({
    icon,
    label,
    value,
    placeholder,
    theme,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    placeholder: string;
    theme: AppTheme;
}) => {
    const { colors } = theme;
    const hasValue = Boolean(value);

    return (
        
        <View style={[styles.infoRow,{backgroundColor: colors.surfaceVariant}]}>
            {/* ICON */}
            <View
                style={[
                    styles.infoIcon,
                    { backgroundColor: colors.surface },
                ]}
            >
                {icon}
            </View>

            {/* TEXT */}
            <View style={styles.infoText}>
                <Text
                    style={[
                        styles.infoLabel,
                        { color: colors.surfaceText },
                    ]}
                >
                    {label}
                </Text>

                {hasValue ? (
                    <Text
                        style={[
                            styles.infoValue,
                            { color: colors.text },
                        ]}
                        numberOfLines={1}
                    >
                        {value}
                    </Text>
                ) : (
                    <View style={styles.addRow}>
                        <Plus size={14} color={colors.primary} />
                        <Text
                            style={[
                                styles.addText,
                                { color: colors.primary },
                            ]}
                        >
                            {placeholder}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default CreatorProfileCard;

const styles = StyleSheet.create({
    card: {
        // padding: 16,
        borderRadius: 18,
        marginBottom: 16,
        // elevation: 3,
        position: "relative",
    },

    editBtn: {
        position: "absolute",
        bottom: 0,
        right: -4,
        padding: 4,
        borderRadius: 12,
        zIndex: 10,
    },

    header: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: 'green',
        padding: 16,
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 16,
    },

    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        borderWidth: 4,

    },

    headerText: {
        flex: 1,
        // marginLeft: 16,
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
    },

    subText: {
        marginTop: 4,
        fontSize: 13,
        textAlign: "center",
    },

    orgName: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "600",
        textTransform: "capitalize",
    },

    infoContainer: {
        borderRadius: 14,
        paddingHorizontal: 16,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 10,
        gap: 12,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
    },

    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    infoText: {
        flex: 1,
    },

    infoLabel: {
        fontSize: 13,
        marginBottom: 4,
    },

    infoValue: {
        fontSize: 15,
        fontWeight: "600",
    },

    addRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    addText: {
        fontSize: 14,
        fontWeight: "600",
    },
    bgImg : {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});
