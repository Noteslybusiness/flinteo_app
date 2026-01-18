import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { scaleY } from "../../../../utils/baseDim";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { UserPlus, CheckCircle } from "lucide-react-native";
import KeyboardAwareContainer from "../../../common/components/KeyboardAwareContainer";
import InputTextField from "../../content/components/InputTextField";
import MobileInput from "../../../auth/components/MobileInput";
import DropdownField from "../../content/components/DropdownField";
import ActionButton from "../../../auth/components/ActionButton";
import { useNavigation } from "@react-navigation/native";
import { userService } from "../../../../network/repo/users/UserService";
import * as Clipboard from "@react-native-clipboard/clipboard";

const AddSingleUser: React.FC = () => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        role: null as any,
    });
    const [errors, setErrors] = useState<{
        name?: string;
        mobile?: string;
        email?: string;
        role?: string;
        api?: string;
    }>({});
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [createdUser, setCreatedUser] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const updateField = (key: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: undefined }));
        }
    };

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else {
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Enter a valid email";
            }
        }

        if (!formData.role) {
            newErrors.role = "Please select a role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            setErrors({}); // clear API error

            const payload = {
                users: [
                    {
                        first_name: formData.name.split(" ")[0],
                        last_name: formData.name.split(" ")[1],
                        mobile: formData.mobile || null,
                        email: formData.email,
                        role_id: formData.role.id,
                    },
                ],
            };

            const response = await userService.addUser(payload);

            if (response?.data?.result && response?.data?.data?.length > 0) {
                setCreatedUser(response.data.data[0]);
                setSuccessModal(true);
            }
        } catch (e) {
            setErrors({ api: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        setSuccessModal(false);
        navigation.goBack();
    };

    const handleCopyCredentials = () => {
        if (!createdUser) return;
        const textToCopy = `Email: ${createdUser.email}\nPassword: ${createdUser.password}`;
        Clipboard.default.setString(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAwareContainer contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerSection}>
                    <View
                        style={[
                            styles.iconWrapper,
                            { backgroundColor: theme.colors.primary + "15" },
                        ]}
                    >
                        <UserPlus size={28} color={theme.colors.primary} />
                    </View>

                    <Text style={[styles.title, { color: theme.colors.surfaceText }]}>
                        Add New User
                    </Text>

                    <Text style={[styles.subtitle, { color: theme.colors.surfaceText }]}>
                        Fill in the details below to invite a new user
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formSection}>
                    {errors.api ? (
                        <Text style={styles.apiErrorText}>{errors.api}</Text>
                    ) : null}

                    <InputTextField
                        theme={theme}
                        label="Name"
                        placeholder="Enter name"
                        value={formData.name}
                        errorMessage={errors.name}
                        onChangeText={(text) => updateField("name", text)}
                    />

                    <MobileInput
                        theme={theme}
                        label="Mobile"
                        placeholder="Enter Mobile Number"
                        value={formData.mobile}
                        errorMessage={errors.mobile}
                        onChangeText={(text) => updateField("mobile", text)}
                    />

                    <InputTextField
                        theme={theme}
                        label="Email"
                        placeholder="Enter email"
                        value={formData.email}
                        errorMessage={errors.email}
                        onChangeText={(text) => updateField("email", text)}
                    />

                    <DropdownField
                        theme={theme}
                        options={[
                            { id: 2, value: "Creator" },
                            { id: 3, value: "Viewer" },
                        ]}
                        label="Role"
                        placeholder="Select User Role"
                        selectedId={formData.role?.id}
                        errorMessage={errors.role}
                        onSelect={(item: any) => updateField("role", item)}
                    />
                </View>

                {/* Space for bottom bar */}
                <View style={{ height: scaleY(96) }} />
            </KeyboardAwareContainer>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface }]}>
                <ActionButton
                    theme={theme}
                    title="Submit"
                    disabled={loading}
                    onPress={handleSubmit}
                />
            </View>

            {/* Success Modal */}
            <Modal visible={successModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
                        <CheckCircle size={48} color={theme.colors.primary} />

                        <Text style={styles.modalTitle}>User Added Successfully</Text>
                        <Text style={styles.modalText}>
                            Login credentials have been generated
                        </Text>

                        {createdUser && (
                            <View style={styles.credentialBox}>
                                <TouchableOpacity
                                    style={[
                                        styles.copyButton,
                                        { borderColor: theme.colors.primary },
                                    ]}
                                    onPress={handleCopyCredentials}
                                >
                                    <Text style={[styles.copyButtonText, { color: theme.colors.primary }]}>
                                        {copied ? "Copied ✓" : "Copy Credentials"}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.credentialLabel}>Email</Text>
                                <Text style={styles.credentialValue}>{createdUser.email}</Text>

                                <Text style={[styles.credentialLabel, { marginTop: 8 }]}>
                                    Temporary Password
                                </Text>
                                <Text style={styles.credentialValue}>
                                    {createdUser.password}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.modalButton,
                                { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={handleGoBack}
                        >
                            <Text style={styles.modalButtonText}>
                                Back to User Listing
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AddSingleUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingBottom: scaleY(62),
    },

    headerSection: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },

    formSection: {
        paddingHorizontal: scaleY(16),
        rowGap: scaleY(16),
    },

    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    title: {
        fontSize: 20,
        fontWeight: "600",
    },

    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 4,
        opacity: 0.85,
    },

    apiErrorText: {
        fontSize: 13,
        color: "#DC2626",
        textAlign: "center",
    },

    bottomBar: {
        position: "absolute",
        bottom: 12,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
    },
    copyButton: {
        marginTop: 12,
        width: "100%",
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
    },

    copyButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    modalCard: {
        width: "100%",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 12,
    },

    modalText: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 6,
        opacity: 0.8,
    },

    credentialBox: {
        width: "100%",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
    },

    credentialLabel: {
        fontSize: 12,
        color: "#6B7280",
    },

    credentialValue: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 2,
        color: "#111827",
    },

    modalButton: {
        marginTop: 20,
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    modalButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
});
