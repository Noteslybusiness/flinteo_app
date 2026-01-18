import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { useContext } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { FileUp, FileText, Download } from "lucide-react-native";
import ActionButton from "../../../auth/components/ActionButton";

const AddBulkUser: React.FC = () => {
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.headerSection}>
                <View
                    style={[
                        styles.iconWrapper,
                        { backgroundColor: theme.colors.primary + "15" },
                    ]}
                >
                    <FileUp size={28} color={theme.colors.primary} />
                </View>
                <Text style={[styles.title, { color: theme.colors.surfaceText }]}>
                    Bulk Upload Users
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.surfaceText }]}>
                    Upload a CSV file to add multiple users at once
                </Text>
            </View>
            <View style={styles.body}>
                <View
                    style={[
                        styles.uploadCard,
                        { borderColor: theme.colors.primary },
                    ]}
                >
                    <FileText size={40} color={theme.colors.primary} />

                    <Text
                        style={[styles.uploadTitle, { color: theme.colors.surfaceText }]}
                    >
                        Upload CSV File
                    </Text>

                    <Text
                        style={[
                            styles.uploadSubtitle,
                            { color: theme.colors.surfaceText },
                        ]}
                    >
                        Supported format: .csv
                    </Text>

                    <View
                        style={[
                            styles.fakeButton,
                            { backgroundColor: theme.colors.primary + "20" },
                        ]}
                    >
                        <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                            Select File
                        </Text>
                    </View>
                </View>

                {/* Helper text */}
                <Text
                    style={[
                        styles.helperText,
                        { color: theme.colors.surfaceText },
                    ]}
                >
                    Make sure the CSV follows the required format before uploading.
                </Text>
                <TouchableOpacity
                    style={[
                        styles.fakeButton,
                        { backgroundColor: theme.colors.primary + "20",
                            justifyContent:"center", alignItems:"center"
                         },
                    ]}
                    onPress={() => {}}
                >
                    <Download size={20} color={theme.colors.primary} />
                    <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                        Download Sample
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddBulkUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerSection: {
        alignItems: "center",
        paddingHorizontal: scaleX(20),
        paddingTop: scaleY(16),
        paddingBottom: scaleY(8),
    },

    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: scaleY(12),
    },

    title: {
        fontSize: 20,
        fontWeight: "600",
    },

    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginTop: scaleY(4),
    },

    body: {
        flex: 1,
        paddingHorizontal: scaleX(20),
        marginTop: scaleY(16),
    },

    uploadCard: {
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderRadius: 12,
        paddingVertical: scaleY(32),
        alignItems: "center",
    },

    uploadTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: scaleY(12),
    },

    uploadSubtitle: {
        fontSize: 13,
        marginTop: scaleY(4),
    },

    fakeButton: {
        marginTop: scaleY(20),
        paddingVertical: scaleY(10),
        paddingHorizontal: scaleX(24),
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: scaleX(8),
    },

    helperText: {
        textAlign: "center",
        fontSize: 12,
        marginTop: scaleY(16),
    },
});
