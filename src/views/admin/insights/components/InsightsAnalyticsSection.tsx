import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { LucideIcon } from "lucide-react-native";

interface AnalyticsItem {
    title: string;
    value: string | number;
    icon?: LucideIcon;
}

interface AnalyticsProps {
    theme: AppTheme;
    filters: Record<string, number>;
    selectedFilter: string;
    onFilterChange?: (title: string, dayRange: number) => void;
    analytics: AnalyticsItem[];
    sectionTitle?: string;
}

const InsightsAnalyticsSection: React.FC<AnalyticsProps> = ({
    theme,
    filters,
    selectedFilter,
    onFilterChange,
    analytics,
    sectionTitle,
}) => {
    const { colors } = theme;

    return (
        <View style={styles.container}>
            {/* ---------- Header ---------- */}
            <View style={styles.headerRow}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {sectionTitle || "Analytics"}
                </Text>

                <Text style={[styles.filterText, { color: colors.primary }]}>
                    {selectedFilter}
                </Text>
            </View>

            {/* ---------- Filters ---------- */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
            >
                {Object.entries(filters).map(([label, range]) => {
                    const isActive = selectedFilter === label;

                    return (
                        <TouchableOpacity
                            key={label}
                            onPress={() => onFilterChange?.(label, range)}
                            style={[
                                styles.filterPill,
                                {
                                    backgroundColor: isActive
                                        ? colors.primary
                                        : colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterPillText,
                                    {
                                        color: isActive ? "#fff" : colors.text,
                                    },
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* ---------- Analytics Cards ---------- */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardRow}
            >
                {analytics.map((item) => {
                    const Icon = item.icon;
                    return (
                        <View
                            key={item.title}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            {Icon && (
                                <View
                                    style={[
                                        styles.iconWrapper,
                                        {
                                            backgroundColor:
                                                colors.primary + "15",
                                        },
                                    ]}
                                >
                                    <Icon
                                        size={18}
                                        color={colors.primary}
                                    />
                                </View>
                            )}

                            <Text
                                style={[
                                    styles.cardLabel,
                                    { color: colors.surfaceText },
                                ]}
                            >
                                {item.title}
                            </Text>

                            <Text
                                style={[
                                    styles.cardValue,
                                    { color: colors.text },
                                ]}
                            >
                                {item.value}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default InsightsAnalyticsSection;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: scaleX(16),
        marginTop: scaleY(12),
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: scaleY(18),
        fontWeight: "700",
    },
    filterText: {
        fontSize: scaleY(14),
        fontWeight: "600",
    },
    filterRow: {
        marginTop: scaleY(10),
        paddingRight: scaleX(16),
        flexDirection: "row",
        gap: scaleX(10),
    },
    filterPill: {
        paddingVertical: scaleY(6),
        paddingHorizontal: scaleX(12),
        borderRadius: 16,
        borderWidth: 1,
    },
    filterPillText: {
        fontSize: scaleY(13),
        fontWeight: "600",
    },

    cardRow: {
        paddingVertical: scaleY(12),
    },
    card: {
        width: scaleX(150),
        padding: scaleX(16),
        marginRight: scaleX(12),
        borderRadius: 12,
        borderWidth: 1,
        position: "relative",
    },
    iconWrapper: {
        position: "absolute",
        top: scaleY(10),
        right: scaleX(10),
        width: scaleX(32),
        height: scaleX(32),
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    cardLabel: {
        fontSize: scaleY(13),
        marginBottom: scaleY(6),
    },
    cardValue: {
        fontSize: scaleY(20),
        fontWeight: "700",
    },
});
