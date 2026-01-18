import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { scaleX, SCREEN } from "../../../../utils/baseDim";

interface RawViewItem {
    date: string;   // "2026-01-03" OR "03 Jan"
    views: number;
}

interface Props {
    theme: AppTheme;
    rawData: RawViewItem[];
    dayRange: number;
}

const MAX_BARS = 7;

const isFormattedDate = (date: string) => date.includes(" ");

const formatDate = (date: string) => {
    if (isFormattedDate(date)) return date;
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
};

const groupBy = (data: RawViewItem[], bucketSize: number) => {
    if (data.length <= MAX_BARS) {
        return data.map(d => ({
            date: formatDate(d.date),
            views: d.views,
        }));
    }

    const result: { date: string; views: number }[] = [];
    let acc = 0;
    let lastDate = "";

    data.forEach((item, index) => {
        acc += item.views;
        lastDate = item.date;

        if ((index + 1) % bucketSize === 0 || index === data.length - 1) {
            result.push({
                date: formatDate(lastDate),
                views: acc,
            });
            acc = 0;
        }
    });

    return result.slice(-MAX_BARS);
};

const normalizeData = (
    rawData: RawViewItem[],
    dayRange: number
) => {
    if (!rawData?.length) return [];

    // 1 day → single bar
    if (dayRange === 1) {
        return rawData.map(d => ({
            date: formatDate(d.date),
            views: d.views,
        }));
    }

    // ≤ 30 days → daily (last 7)
    if (dayRange <= 30) {
        return rawData
            .slice(-MAX_BARS)
            .map(d => ({
                date: formatDate(d.date),
                views: d.views,
            }));
    }

    // 31–90 → weekly
    if (dayRange <= 90) return groupBy(rawData, 7);

    // 91–180 → bi-weekly
    if (dayRange <= 180) return groupBy(rawData, 14);

    // >180 → monthly
    return groupBy(rawData, 30);
};

const ViewsBarChart: React.FC<Props> = ({
    theme,
    rawData,
    dayRange,
}) => {
    const colors = theme.colors;

    const data = useMemo(
        () => normalizeData(rawData, dayRange),
        [rawData, dayRange]
    );

    if (!data.length) return null;

    const chartData = data.map(item => ({
        value: item.views,
        label: item.date,
        frontColor: colors.primary,
    }));

    const title =
        dayRange === 1
            ? "Today"
            : dayRange <= 7
            ? "Last 7 Days"
            : dayRange <= 30
            ? "Recent Activity"
            : dayRange <= 90
            ? "Weekly Views"
            : dayRange <= 180
            ? "Bi-Weekly Views"
            : "Monthly Views";

    return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                {title}
            </Text>

            <BarChart
                data={chartData}
                barWidth={SCREEN.WIDTH / Math.max(10, chartData.length * 2)}
                spacing={SCREEN.WIDTH / 24}
                // barBorderRadius={6}
                yAxisThickness={0}
                xAxisThickness={1}
                yAxisTextStyle={{ color: colors.surfaceText }}
                xAxisLabelTextStyle={{
                    color: colors.surfaceText,
                    fontSize: 11,
                }}
                rulesColor={colors.border}
                noOfSections={4}
                isAnimated
                showYAxisIndices
            />
        </View>
    );
};

export default ViewsBarChart;

const styles = StyleSheet.create({
    card: {
        padding: scaleX(16),
        borderRadius: 16,
        marginTop: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
});
