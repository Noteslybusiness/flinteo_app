import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { AppTheme, ThemeContext } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY, SCREEN } from "../../../../utils/baseDim";
import { userService } from "../../../../network/repo/users/UserService";
import { Eye, BarChart2, Heart, Share } from "lucide-react-native";
import { FONTS } from "../../../../assets/theme/appFonts";
import BlockSectionShimmer from "../shimmer/BlockSectionShimmer";

interface BlockSectionProps {
    onPressInsights?: () => void;
    theme: AppTheme;
}

const BlockSection: React.FC<BlockSectionProps> = ({ onPressInsights, theme }) => {
    const { colors } = useContext(ThemeContext);
    const [kpis, setKpis] = useState<any>(null);

    useEffect(() => {
        fetchKpis();
    }, []);

    const fetchKpis = async () => {
        try {
            const res = await userService.getBlockKpis();
            if (res?.data) {
                setKpis(res?.data?.data);
            }
        } catch (e) {
            console.log("KPI fetch error", e);
        }
    };

    // if (!kpis) return null;
    if (!kpis) return <BlockSectionShimmer theme={theme}  />;

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.background },
            ]}
        >
            {/* HEADER */}
            <View style={styles.headerSection}>
                <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
                    {kpis?.block_title || "Insights"}
                </Text>
                <TouchableOpacity
                    onPress={onPressInsights}
                    style={styles.insightBtn}
                    activeOpacity={0.7}
                >
                    <BarChart2 size={16} color={colors.primary} />
                    <Text
                        style={[
                            styles.insightText,
                            { color: colors.primary },
                        ]}
                    >
                        Insights
                    </Text>
                </TouchableOpacity>
            </View>

            {/* KPI CARDS */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                <KpiCard
                    label="Views"
                    value={kpis?.kpis[0]?.count || 0}
                    Icon={Eye}
                    bgColor="#1E293B"   // slate
                />

                <KpiCard
                    label="Likes"
                    value={kpis?.kpis[1]?.count || 0}
                    Icon={Heart}
                    bgColor="#3B0764"   // purple
                />

                <KpiCard
                    label="Shares"
                    value={kpis?.kpis[2]?.count || 0}
                    Icon={Share}
                    bgColor="#064E3B"   // emerald
                />

                <KpiCard
                    label="Downloads"
                    value={kpis?.kpis[3]?.count || 0}
                    Icon={BarChart2}
                    bgColor="#7C2D12"   // orange/brown
                />
            </ScrollView>
        </View>
    );
};

const KpiCard = ({
    label,
    value,
    Icon,
    bgColor,
}: {
    label: string;
    value: number;
    Icon: any;
    bgColor: string;
}) => {
    return (
        <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.topRow}>
                <Icon size={16} color="#fff" opacity={0.9} />
                <Text style={styles.label}>{label}</Text>
            </View>

            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

export default BlockSection;

const styles = StyleSheet.create({
    container: {
        width: Matrix.DIM_100,
        marginBottom: scaleY(12),
    },

    /* Header */
    headerSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scaleX(16),
        marginBottom: scaleY(6),
    },
    headerTitle: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterSemiBold,
        fontWeight: "700",
    },
    insightBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
    },
    insightText: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterMedium,
    },

    /* Cards */
    row: {
        paddingHorizontal: scaleX(8),
        paddingVertical: scaleY(10),
    },
    card: {
        width: SCREEN.WIDTH / 2.6,
        height: scaleY(84),
        borderRadius: 12,
        padding: scaleX(12),
        marginHorizontal: scaleX(6),
        justifyContent: "space-between",
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(6),
    },

    label: {
        fontSize: scaleY(12),
        color: "#ffffffcc",
        fontWeight: "600",
        textTransform: "uppercase",
    },

    value: {
        fontSize: scaleY(22),
        fontWeight: "800",
        color: "#fff",
        letterSpacing: 0.3,
    },
});
