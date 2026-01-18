import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY, SCREEN } from "../../../../utils/baseDim";
import { userService } from "../../../../network/repo/users/UserService";
import { Users, UserX, Layers, Eye } from "lucide-react-native";

const CARD_HEIGHT = 90;

const UserKpiSection = () => {
    const { colors } = useContext(ThemeContext);
    const [kpis, setKpis] = useState<any>(null);

    useEffect(() => {
        fetchKpis();
    }, []);

    const fetchKpis = async () => {
        try {
            const res = await userService.getUserKpis();
            if (res?.data?.data) {
                setKpis(res.data.data);
            }
        } catch (e) {
            console.log("KPI fetch error", e);
        }
    };

    if (!kpis) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                <KpiCard label={kpis.active_users?.title || "Active Users"} value={kpis.active_users?.count || 0} Icon={Users} accent="#22C55E" bg="#052e1d" />
                <KpiCard label={kpis.inactive_users?.title || "Inactive Users"} value={kpis.inactive_users?.count || 0} Icon={UserX} accent="#EF4444" bg="#3a0d0d" />
                <KpiCard label={kpis.active_creators?.title || "Active Creators"} value={kpis.active_creators?.count || 0} Icon={Users} accent="#3B82F6" bg="#0b1f3a" />
                <KpiCard label={kpis.active_viewers?.title || "Active Viewers"} value={kpis.active_viewers?.count || 0} Icon={Eye} accent="#A855F7" bg="#2a0f3d" />
                <KpiCard label={kpis.user_groups?.title || "Groups"} value={kpis.user_groups?.count || 0} Icon={Layers} accent="#F59E0B" bg="#3b2a0a" />
            </ScrollView>
        </View>
    );
};

type KpiCardProps = {
    label: string;
    value: number;
    Icon: any;
    accent: string;
    bg: string;
};

const KpiCard = ({ label, value, Icon, accent, bg }: KpiCardProps) => {
    return (
        <View style={[styles.card, { backgroundColor: bg }]}>
            <View style={styles.topRow}>
                <View style={[styles.iconWrapper, { backgroundColor: accent + "30" }]}>
                    <Icon size={18} color={accent} />
                </View>
                <Text style={styles.value}>{value}</Text>
            </View>
            <Text numberOfLines={1} style={styles.label}>
                {label}
            </Text>
        </View>
    );
};

export default UserKpiSection;

const styles = StyleSheet.create({
    container: {
        width: Matrix.DIM_100,
    },
    row: {
        paddingVertical: scaleY(14),
        paddingHorizontal: scaleX(8),
    },
    card: {
        width: SCREEN.WIDTH / 2.6,
        height: CARD_HEIGHT,
        borderRadius: scaleX(14),
        padding: scaleX(12),
        marginHorizontal: scaleX(8),
        justifyContent: "space-between",
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconWrapper: {
        width: scaleX(32),
        height: scaleX(32),
        borderRadius: scaleX(10),
        alignItems: "center",
        justifyContent: "center",
    },
    value: {
        fontSize: scaleY(22),
        fontWeight: "800",
        color: "#F9FAFB",
    },
    label: {
        fontSize: scaleY(12),
        fontWeight: "600",
        color: "#CBD5E1",
    },
});
