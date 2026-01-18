import { StyleSheet, View, FlatList } from "react-native";
import { BaseView } from "../../common/base/BaseView";
import { DefaultScreenProps } from "../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { notificationService } from "../../../network/repo/utils/NotificationService";
import CommonHeader from "../../admin/content/components/CommonHeader";
import { ThemeContext } from "../../../assets/theme/themeContext";
import NotificationItem from "../components/NotificationItem";

const NotificationScreen: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, [route]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.get_notfication_feeds({});
            setNotifications(response.data?.data?.results || []);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const onNotificationPress = (item: any) => {
        console.log("Notification clicked:", item);
    };

    return (
        <BaseView>
            <CommonHeader theme={theme} title="Notifications" onBackPress={() => navigation.goBack()}/>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <NotificationItem
                            item={item}
                            onPress={onNotificationPress}
                            theme={theme}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    refreshing={loading}
                    onRefresh={fetchNotifications}
                />
            </View>
        </BaseView>
    );
};

export default NotificationScreen;

/* ---------- styles ---------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 24,
    },
});
