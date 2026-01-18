import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import CommonHeader from "../../content/components/CommonHeader";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import InputTextField from "../../content/components/InputTextField";
import EmailInput from "../../../auth/components/EmailInput";
import MobileInput from "../../../auth/components/MobileInput";
import KeyboardAwareContainer from "../../../common/components/KeyboardAwareContainer";
import ImagePickerField from "../../../common/components/ImagePickerField";
import { CONTENT_TYPES } from "../../../../network/utils/constants";
import { utilsService } from "../../../../network/repo/utils/UtilsService";
import { organizationService } from "../../../../network/repo/organization/OrganizationService";
import { useAppDispatch } from "../../../../hooks/storeHooks";
import { getUserOrgProfileData } from "../../../../redux/organization/reducers/userProfileReducer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditAdminCreatorProfile: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);
    const dispatch = useAppDispatch()
    const inset = useSafeAreaInsets()
    const [prevData, setPrevData] = useState<any>({
        user_info: {},
        org_info: {},
    });
    const [formData, setFormData] = useState<any>({
        user_info: {
            first_name: "",
            last_name: "",
            mobile_number: "",
            isd_code: "",
            profile_image: "",
        },
        org_info: {
            name: "",
            email: "",
            mobile: "",
            website: "",
            logo: "",
            banner_image: "",
        },
    });
    console.log(formData)
    const [canEditOrganization, setCanEditOrganization] = useState(false);
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
            setCanEditOrganization(params.user_info?.role_name === 'admin');
        }

        if (params?.org_info) {
            setPrevData((p: any) => ({
                ...p,
                org_info: params.org_info,
            }));
            setFormData((p: any) => ({
                ...p,
                org_info: {
                    name: params.org_info.name ?? "",
                    email: params.org_info.email ?? "",
                    mobile: params.org_info.mobile ?? "",
                    website: params.org_info.website ?? "",
                    logo: params.org_info.logo ?? "",
                    banner_image: params.org_info.banner_image ?? "",
                },
            }));
        }
    }, [route]);

    const uploadImage = async (
        file: any,
        type: string,
        path: "user_info" | "org_info",
        key: string
    ) => {
        const data = new FormData();
        data.append("file", {
            uri: file.uri,
            name: file.name || `image_${Date.now()}.jpg`,
            type: file.type || "image/jpeg",
        } as any);
        data.append("file_type", type);
        const res = await utilsService.fileUpload(data, () => { });
        const url = res.data.data.file_url;
        setFormData((prev: any) => ({
            ...prev,
            [path]: {
                ...prev[path],
                [key]: url,
            },
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const userPayload: any = {
                first_name: formData.user_info.first_name,
                last_name: formData.user_info.last_name,
                mobile_number: formData.user_info.mobile,
                isd_code: formData.user_info.isd_code,
            };
            if (
                formData.user_info.profile_image &&
                formData.user_info.profile_image !== prevData.user_info.profile_image
            ) {
                userPayload.profile_image = formData.user_info.profile_image;
            }

            const payload: any = {
                user_info: userPayload,
            };
            if (canEditOrganization) {
                const orgPayload: any = {
                    name: formData.org_info.name,
                    email: formData.org_info.email,
                    mobile: formData.org_info.mobile,
                    website: formData.org_info.website,
                };
                if (
                    formData.org_info.logo &&
                    formData.org_info.logo !== prevData.org_info.logo
                ) {
                    orgPayload.logo = formData.org_info.logo;
                }
                if(
                    formData.org_info.banner_image &&
                    formData.org_info.banner_image !== prevData.org_info.banner_image
                ){
                    orgPayload.banner_image = formData.org_info.banner_image;
                }
                payload.org_info = orgPayload;
            }
            await organizationService.updateOrgDetails(payload);
            dispatch(getUserOrgProfileData({}))
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
                    {/* PERSONAL */}
                    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.surfaceText }]}>
                            Personal Details
                        </Text>

                        <ImagePickerField
                            theme={theme}
                            imageUrl={formData.user_info.profile_image}
                            onImageSelect={(f) =>
                                uploadImage(
                                    f,
                                    CONTENT_TYPES.USER_PROFILE_IMAGE,
                                    "user_info",
                                    "profile_image"
                                )
                            }
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

                    {/* ORGANIZATION */}
                    {
                        canEditOrganization &&
                        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.sectionTitle, { color: theme.colors.surfaceText }]}>
                                Organization Details
                            </Text>
                            <ImagePickerField
                                theme={theme}
                                imageUrl={formData.org_info.logo}
                                onImageSelect={(f) =>
                                    uploadImage(
                                        f,
                                        CONTENT_TYPES.ORGANIZATION_LOGO,
                                        "org_info",
                                        "logo"
                                    )
                                }
                            />
                            <ImagePickerField
                                theme={theme}
                                imageUrl={formData.org_info.banner_image}
                                onImageSelect={(f) =>
                                    uploadImage(
                                        f,
                                        CONTENT_TYPES.ORGANIZATION_BANNER,
                                        "org_info",
                                        "banner_image"
                                    )
                                }
                            />

                            <InputTextField
                                label="Organization Name"
                                theme={theme}
                                editable={canEditOrganization}
                                value={formData.org_info.name}
                                onChangeText={(v) =>
                                    setFormData((p: any) => ({
                                        ...p,
                                        org_info: { ...p.org_info, name: v },
                                    }))
                                }
                            />

                            <EmailInput
                                label="Organization Email"
                                theme={theme}
                                editable={canEditOrganization}
                                value={formData.org_info.email}
                                onChangeText={(v) =>
                                    setFormData((p: any) => ({
                                        ...p,
                                        org_info: { ...p.org_info, email: v },
                                    }))
                                }
                            />

                            <MobileInput
                                label="Organization Contact"
                                theme={theme}
                                editable={canEditOrganization}
                                value={formData.org_info.mobile}
                                onChangeText={(v) =>
                                    setFormData((p: any) => ({
                                        ...p,
                                        org_info: { ...p.org_info, mobile: v },
                                    }))
                                }
                            />

                            <InputTextField
                                label="Website"
                                theme={theme}
                                editable={canEditOrganization}
                                value={formData.org_info.website}
                                onChangeText={(v) =>
                                    setFormData((p: any) => ({
                                        ...p,
                                        org_info: { ...p.org_info, website: v },
                                    }))
                                }
                            />
                        </View>
                    }
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

export default EditAdminCreatorProfile;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
    container: { flex: 1 },
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
        fontSize: scaleY(12),
        fontFamily: FONTS.InterSemiBold,
    },
});
