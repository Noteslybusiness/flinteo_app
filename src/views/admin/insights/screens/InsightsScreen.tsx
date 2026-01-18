import { StyleSheet, View } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import HeaderView from "../components/HeaderView";
import InsightsAnalyticsSection from "../components/InsightsAnalyticsSection";
import ViewsBarChart from "../components/ViewsBarChart";
import { contentService } from "../../../../network/repo/content/ContentService";
import { FILTERS } from "../../content/utils/utils";

const InsightsScreen: React.FC<DefaultScreenProps> = ({
    navigation,
}) => {
    const theme = useContext(ThemeContext);

    const [insights, setInsights] = useState<any>(null);
    const [selectedFilter, setSelectedFilter] =
        useState<keyof typeof FILTERS>("Last Week");

    const dayRange = FILTERS[selectedFilter];

    useEffect(() => {
        fetchInsights(dayRange);
    }, [dayRange]);

    const fetchInsights = async (day_range: number) => {
        try {
            const response = await contentService.getContentInsights({
                day_range,
            });
            setInsights(response.data?.data);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <BaseView>
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <HeaderView
                    theme={theme}
                    onBackPress={() => navigation.goBack()}
                />

                <InsightsAnalyticsSection
                    theme={theme}
                    analytics={insights?.kpis || []}
                    selectedFilter={selectedFilter}
                    onFilterChange={(label) => setSelectedFilter(label)}
                    filters={FILTERS}
                />

                <ViewsBarChart
                    rawData={insights?.graph || []}
                    theme={theme}
                    dayRange={dayRange}
                />
            </View>
        </BaseView>
    );
};

export default InsightsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
