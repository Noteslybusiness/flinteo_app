import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { contentService } from "../../../../network/repo/content/ContentService";
import CommonHeader from "../components/CommonHeader";
import InputTextField from "../components/InputTextField";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import InputTextAreaField from "../components/InputTextAreaField";
import VideoVisibilityField from "../components/VideoVisibilityField";
import { FONTS } from "../../../../assets/theme/appFonts";
import KeyboardAwareContainer from "../../../common/components/KeyboardAwareContainer";


const EditVideoScreen: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext)
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        setVideoInfo(route.params.videoInfo)
    }, []);

    const handleSubmit = async () => {
        setLoading(true)
        const payload: any = {}
        payload.id = videoInfo?.id
        payload.title = videoInfo?.title
        payload.description = videoInfo?.description
        payload.tags = videoInfo?.tags
        try {
            const response = await contentService.updateVideoContent(payload)
            navigation.goBack()
        } catch (e: any) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return <BaseView>
        <CommonHeader
            theme={theme}
            onBackPress={() => navigation.goBack()}
            title="Edit Video"
        />
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAwareContainer contentContainerStyle={styles.contentContainer}>
                <InputTextField
                    theme={theme}
                    label="Video Title"
                    value={videoInfo?.title}
                    onChangeText={(text: string) => {
                        setVideoInfo((prev: any) => ({
                            ...prev,
                            title: text
                        }))
                    }}
                />
                <InputTextAreaField
                    theme={theme}
                    label="Description"
                    value={videoInfo?.description}
                    onChangeText={(text: string) => {
                        setVideoInfo((prev: any) => ({
                            ...prev,
                            description: text
                        }))
                    }}
                />
                <InputTextField
                    theme={theme}
                    label="Video Tags"
                    placeholder="Ex - Reels,Video,Music"
                    value={videoInfo?.tags}
                    onChangeText={(text: string) => {
                        setVideoInfo((prev: any) => ({
                            ...prev,
                            tags: text
                        }))
                    }}
                />

            </KeyboardAwareContainer>
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.background }]}>
                <TouchableOpacity
                    style={[styles.draftBtn, { borderColor: theme.colors.grayField }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.draftText, { color: theme.colors.surfaceText }]}>
                        Go Back
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.publishBtn, { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleSubmit()}
                >
                    <Text style={styles.publishText}>Publish</Text>
                </TouchableOpacity>
            </View>
        </View>
    </BaseView>
}

export default EditVideoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(16),
        rowGap: scaleY(16),

    },
    bottomBar: {
        flexDirection: "row",
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(18),
        gap: scaleX(12),
    },

    draftBtn: {
        flex: 1,
        borderWidth: 1,
        borderRadius: scaleX(8),
        paddingVertical: scaleY(8),
        alignItems: "center",
    },

    draftText: {
        fontSize: scaleX(14),
        fontFamily: FONTS.InterRegular,
    },

    publishBtn: {
        flex: 1,
        borderRadius: scaleX(8),
        paddingVertical: scaleY(8),
        alignItems: "center",
    },

    publishText: {
        fontSize: scaleX(14),
        fontWeight: "600",
        color: "#fff",
        fontFamily: FONTS.InterRegular,
    },
})