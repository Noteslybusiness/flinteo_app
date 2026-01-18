import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import {
    User,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    Camera,
} from "lucide-react-native";
import { FONTS } from "../../../../assets/theme/appFonts";
import { scaleX, scaleY } from "../../../../utils/baseDim";

interface Props {
    theme: AppTheme;
    userInfo?: any
}

const ProfileDetailsCard: React.FC<Props> = ({
    theme,
    userInfo
}) => {
    const { colors } = theme;

    return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {/* Header */}
            <View style={styles.header}>
                {/* Profile Image */}
                <View
                    style={[
                        styles.avatarWrapper,
                        { backgroundColor: colors.primaryContainer },
                    ]}
                >
                    {userInfo?.profile?.profile_image ? (
                        <Image
                            source={{ uri: userInfo?.profile?.profile_image }}
                            style={styles.avatar}
                        />
                    ) : (
                        <User size={36} color={colors.primary} />
                    )}

                    {/* Camera overlay (future edit) */}
                    <View
                        style={[
                            styles.cameraBadge,
                            { backgroundColor: colors.primary },
                        ]}
                    >
                        <Camera size={14} color={colors.onPrimary} />
                    </View>
                </View>

                <View style={styles.headerText}>
                    <Text style={[styles.name, { color: colors.text }]}>
                        {userInfo?.profile?.first_name} {userInfo?.profile?.last_name || ""}
                    </Text>
                    <Text
                        style={[
                            styles.role,
                            { color: colors.surfaceText },
                        ]}
                    >
                        {userInfo?.role?.name}
                    </Text>
                </View>
            </View>
            <View style={[styles.divider, {
                marginTop: scaleY(12)
            }]}/>
            <InfoRow
                icon={Mail}
                label="Email"
                value={userInfo?.profile?.email}
                theme={theme}
            />
            <View style={styles.divider} />
            <InfoRow
                icon={Phone}
                label="Mobile"
                value={userInfo?.profile?.mobile_number}
                theme={theme}
            />
            <View style={styles.divider} />
            <InfoRow
                icon={Building2}
                label="Organization"
                value={userInfo?.organization?.name}
                theme={theme}
            />
            <View style={styles.divider} />
            <InfoRow
                icon={ShieldCheck}
                label="Role"
                value={userInfo?.role?.name}
                subValue={userInfo?.role?.description}
                theme={theme}
            />
        </View>
    );
};

export default ProfileDetailsCard;

interface InfoRowProps {
    icon: any;
    label: string;
    value: string;
    subValue?: string;
    theme: AppTheme;
}

const InfoRow: React.FC<InfoRowProps> = ({
    icon: Icon,
    label,
    value,
    subValue,
    theme,
}) => {
    const { colors } = theme;

    return (
        <View style={styles.row}>
            <Icon strokeWidth={1.2} size={scaleY(24)} color={colors.primary} />
            <View style={styles.rowText}>
                <Text
                    style={[
                        styles.label,
                        { color: colors.surfaceText },
                    ]}
                >
                    {label}
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                    {value}
                </Text>
                {subValue && (
                    <Text
                        style={[
                            styles.subValue,
                            { color: colors.surfaceText },
                        ]}
                    >
                        {subValue}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 4,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        marginLeft: 14,
    },
    name: {
        fontSize: 18,
        fontFamily: FONTS.InterSemiBold,
    },
    role: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterRegular,
        textTransform: "capitalize",
    },
    divider: {
        height: 1,
        backgroundColor: "#e5e5e5",
        marginVertical: scaleY(10),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowText: {
        marginLeft: scaleX(16),
        flex: 1,
    },
    label: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterSemiBold
    },
    value: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterRegular,
        marginTop: 2,
    },
    subValue: {
        fontSize: scaleY(10),
        marginTop: 2,
    },
});
