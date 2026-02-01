import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import CommonHeader from "../../../admin/content/components/CommonHeader";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import InputTextField from "../../../admin/content/components/InputTextField";
import MobileInput from "../../../auth/components/MobileInput";
import KeyboardAwareContainer from "../../../common/components/KeyboardAwareContainer";
import ImagePickerField from "../../../common/components/ImagePickerField";
import { CONTENT_TYPES } from "../../../../network/utils/constants";
import { utilsService } from "../../../../network/repo/utils/UtilsService";
import { organizationService } from "../../../../network/repo/organization/OrganizationService";
import { useAppDispatch } from "../../../../hooks/storeHooks";
import { getUserOrgProfileData } from "../../../../redux/organization/reducers/userProfileReducer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditViewerProfile: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);
    const dispatch = useAppDispatch();
    const inset = useSafeAreaInsets();
    
    const [prevData, setPrevData] = useState<any>({
        user_info: {},
    });
    
    const [formData, setFormData] = useState<any>({
        user_info: {
            first_name: "",
            last_name: "",
            mobile_number: "",
            isd_code: "",
            profile_image: "",
        },
    });
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = route.params;
        if (params?.user_info) {
            setPrevData((p: any) => ({
                ...p,
                user_info: params.user_info,
            }));
            setFormData((p: any) => ({
                ...p,
                user_info: {
                    first_name: params.user_info.first_name ?? "",
                    last_name: params.user_info.last_name ?? "",
                    mobile_number: params.user_info.mobile_number ?? "",
                    isd_code: params.user_info.isd_code ?? "",
                    profile_image: params.user_info.profile_image ?? "",
                },
            }));
        }
    }, [route]);

    const uploadImage = async (file: any) => {
        const data = new FormData();
        data.append("file", {
            uri: file.uri,
            name: file.name || `image_${Date.now()}.jpg`,
            type: file.type || "image/jpeg",
        } as any);
        data.append("file_type", CONTENT_TYPES.USER_PROFILE_IMAGE);
        
        const res = await utilsService.fileUpload(data, () => {});
        const url = res.data.data.file_url;
        
        setFormData((prev: any) => ({
            ...prev,
            user_info: {
                ...prev.user_info,
                profile_image: url,
            },
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const userPayload: any = {
                first_name: formData.user_info.first_name,
                last_name: formData.user_info.last_name,
                mobile_number: formData.user_info.mobile_number,
                isd_code: formData.user_info.isd_code,
            };
            
            if (
                formData.user_info.profile_image &&
                formData.user_info.profile_image !== prevData.user_info.profile_image
            ) {
                userPayload.profile_image = formData.user_info.profile_image;
            }

            const payload = {
                user_info: userPayload,
            };
            
            await organizationService.updateOrgDetails(payload);
            dispatch(getUserOrgProfileData({}));
            navigation.goBack();
        } catch (e) {
            console.error("Update profile error:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseView>
            <CommonHeader
                theme={theme}
                title="Edit Profile"
                onBackPress={() => navigation.goBack()}
            />
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <KeyboardAwareContainer contentContainerStyle={styles.scrollContent}>
                    {/* PERSONAL DETAILS ONLY */}
                    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.surfaceText }]}>
                            Personal Details
                        </Text>

                        <ImagePickerField
                            theme={theme}
                            imageUrl={formData.user_info.profile_image}
                            onImageSelect={uploadImage}
                        />

                        <InputTextField
                            label="First Name"
                            theme={theme}
                            value={formData.user_info.first_name}
                            onChangeText={(v) =>
                                setFormData((p: any) => ({
                                    ...p,
                                    user_info: { ...p.user_info, first_name: v },
                                }))
                            }
                        />

                        <InputTextField
                            label="Last Name"
                            theme={theme}
                            value={formData.user_info.last_name}
                            onChangeText={(v) =>
                                setFormData((p: any) => ({
                                    ...p,
                                    user_info: { ...p.user_info, last_name: v },
                                }))
                            }
                        />

                        <MobileInput
                            label="Mobile Number"
                            theme={theme}
                            value={formData.user_info.mobile_number}
                            isdCode={formData.user_info.isd_code}
                            onChangeText={(v) =>
                                setFormData((p: any) => ({
                                    ...p,
                                    user_info: { ...p.user_info, mobile_number: v },
                                }))
                            }
                            onIsdCodeChange={(isd) =>
                                setFormData((p: any) => ({
                                    ...p,
                                    user_info: { ...p.user_info, isd_code: isd },
                                }))
                            }
                        />
                    </View>

                    {/* READ-ONLY ORGANIZATION INFO */}
                    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.surfaceText }]}>
                            Organization Details
                        </Text>
                        <Text style={[styles.readOnlyNote, { color: theme.colors.onSurfaceVariant }]}>
                            Organization details can only be updated by administrators
                        </Text>
                        
                        <View style={[styles.readOnlyField, { backgroundColor: theme.colors.background }]}>
                            <Text style={[styles.readOnlyLabel, { color: theme.colors.onSurfaceVariant }]}>
                                Organization
                            </Text>
                            <Text style={[styles.readOnlyValue, { color: theme.colors.surfaceText }]}>
                                {route.params?.org_info?.name || 'Not available'}
                            </Text>
                        </View>
                    </View>
                </KeyboardAwareContainer>
                
                <View style={[styles.actionContainer, { backgroundColor: theme.colors.surface, paddingBottom: inset.bottom + scaleY(16) }]}>
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={[styles.saveText, { color: theme.colors.whiteColor }]}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseView>
    );
};

export default EditViewerProfile;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    scrollContent: {
        padding: scaleX(16),
        paddingBottom: scaleY(32)
    },
    card: {
        borderRadius: scaleX(12),
        padding: scaleX(16),
        marginBottom: scaleY(16),
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        rowGap: scaleX(16)
    },
    sectionTitle: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterSemiBold,
    },
    readOnlyNote: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterRegular,
        fontStyle: 'italic',
        marginBottom: scaleY(8),
    },
    readOnlyField: {
        padding: scaleX(12),
        borderRadius: scaleX(8),
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    readOnlyLabel: {
        fontSize: scaleY(12),
        fontFamily: FONTS.InterMedium,
        marginBottom: scaleY(4),
    },
    readOnlyValue: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterRegular,
    },
    actionContainer: {
        marginTop: 'auto',
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(16),
    },
    saveButton: {
        paddingVertical: scaleY(12),
        borderRadius: scaleX(8),
        alignItems: "center",
    },
    saveText: {
        color: "#fff",
        fontSize: scaleY(14),
        fontFamily: FONTS.InterSemiBold,
    },
});