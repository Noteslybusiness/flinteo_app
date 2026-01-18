import React, { useEffect, useState, useCallback, useContext } from "react";
import { StyleSheet, View, Text, Alert, Image, TouchableOpacity } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import { utilsService } from "../../../../network/repo/utils/UtilsService";
import { contentService } from "../../../../network/repo/content/ContentService";
import CommonHeader from "../components/CommonHeader";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { CONTENT_TYPES } from "../../../../network/utils/constants";
import { ArrowLeft, ArrowRight, Check, Film, MoveIcon, Send, Upload } from "lucide-react-native";

const UploadVideoDetails: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const { video, thumbnail, payload } = route.params;
    const theme = useContext(ThemeContext);
    const [step, setStep] = useState<"pending" | "video" | "thumbnail" | "content" | "done">(
        "pending"
    );
    const [progress, setProgress] = useState(0);

    const uploadFile = async (
        file: any,
        fileType: string
    ): Promise<string> => {
        const formData = new FormData();
        const filePayload = {
            uri: file.uri,
            name: file.name || `upload_${Date.now()}.mp4`, // Ensure a filename exists
            type: file.type || 'video/mp4',               // Ensure a mime type exists
        };
        formData.append('file', filePayload as any);
        formData.append("file_type", fileType);
        const response = await utilsService.fileUpload(
            formData,
            (p) => setProgress(Math.floor(p))
        );
        setProgress(100)
        return response?.data?.data?.file_url;
    };

    const normalizeThumbnail = () => {
        if (typeof thumbnail === "string") {
            return {
                uri: thumbnail,
                name: "thumbnail.jpg",
                type: "image/jpeg",
            };
        }
        return thumbnail;
    };

    const startUpload = useCallback(async () => {
        try {
            setStep("video");
            setProgress(0);
            const videoUrl = await uploadFile(video, CONTENT_TYPES.CONTENT_VIDEO);
            setStep("thumbnail");
            setProgress(0);
            const thumbFile = normalizeThumbnail();
            const thumbnailUrl = await uploadFile(
                thumbFile,
                CONTENT_TYPES.CONTENT_VIDEO_THUMBNAIL
            );
            setStep("content");
            await contentService.createVideoContent({
                title: payload.title,
                description: payload.description,
                file_url: videoUrl,                 // ⬅ uploaded video URL
                thumbnail: thumbnailUrl,             // ⬅ uploaded thumbnail URL
                status: payload.status === "publish" ? 2 : 1,              // 1 = draft, 2 = publish
                content_type: 1,                     // 1 = video (backend constant)
                category_id: payload.categoryId,
                tags: payload.tags || [],
                visibility: payload.visibilityId,
                course_id: payload.courseId,
                video_meta: payload.video_meta,
            });
            setStep("done");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Something went wrong. Please try again.";
            Alert.alert("Upload failed", message);
            console.log("UPLOAD ERROR", {
                message,
                status: error?.response?.status,
                data: error?.response?.data,
            });
        }
    }, []);

    useEffect(() => {
        // startUpload();
    }, []);

    const getStepLabel = () => {
        switch (step) {
            case "video":
                return "Uploading video";
            case "thumbnail":
                return "Uploading thumbnail";
            case "content":
                return "Publishing content";
            default:
                return "Pending Upload";
        }
    };

    return (
        <BaseView>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <CommonHeader
                    theme={theme}
                    title="Upload Video"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.card}>
                        {/* Thumbnail */}
                        <Image
                            source={{
                                uri:
                                    typeof thumbnail === "string"
                                        ? thumbnail
                                        : thumbnail?.uri,
                            }}
                            style={styles.thumbnail}
                        />
                        <View style={styles.cardInfoContainer}>
                            {/* Video Title */}
                            <Text style={styles.videoTitle} numberOfLines={2}>
                                {payload?.title}
                            </Text>
                            {/* Step */}
                            <Text style={styles.stepText}>{getStepLabel()}</Text>
                            {
                                step === "pending" ? <TouchableOpacity style={[styles.uploadDoneContainer, {
                                    backgroundColor: theme.colors.primary,
                                    borderRadius: scaleX(8),
                                    paddingHorizontal: scaleX(14),
                                    paddingVertical: scaleY(6),
                                    alignItems: 'center',
                                }]}
                                    onPress={startUpload}
                                >
                                    <Upload size={20} color={theme.colors.whiteColor} />
                                    <Text style={[styles.uploadText, {color: theme.colors.whiteColor}]}>{'Upload Video'}</Text>
                                </TouchableOpacity> :
                                    ['video', 'thumbnail', 'content'].includes(step) ?
                                        <View style={styles.progressContainer}>
                                            <View style={styles.progressBox}>
                                                <View
                                                    style={[
                                                        styles.progressFill,
                                                        {
                                                            width: `${progress}%`,
                                                            backgroundColor: theme.colors.primary,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.percent}>{progress}%</Text>
                                        </View> : <View style={[styles.uploadDoneContainer, {
                                            borderRadius: scaleX(8),
                                            paddingHorizontal: scaleX(14),
                                            paddingVertical: scaleY(6),
                                            alignItems: 'center',
                                        }]}>
                                            <Check size={20} color={'rgba(0, 168, 36, 1)'} />
                                            <Text style={[styles.uploadText, {color: theme.colors.surfaceText}]}>{'Uploaded'}</Text>
                                        </View>
                            }
                        </View>
                    </View>
                    {
                        step === 'done' &&
                            <TouchableOpacity style={[styles.backActionCta, {
                                backgroundColor: theme.colors.background,
                                borderRadius: scaleX(8),
                                borderColor: theme.colors.border,
                                marginBottom: 32
                            }]}>
                                <Text style={[styles.uploadText, {color: theme.colors.surfaceText, fontSize: scaleX(14)}]}>{"All Videos"}</Text>
                                <ArrowRight size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                    }
                </View>
            </View>
        </BaseView>
    );
};

export default UploadVideoDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(16),
    },
    card: {
        width: Matrix.DIM_100,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: scaleX(10),
        padding: scaleX(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    thumbnail: {
        width: scaleX(80),
        height: scaleY(120),
        borderRadius: scaleX(12),
        backgroundColor: "#E5E7EB",
    },
    cardInfoContainer: {
        paddingHorizontal: scaleX(12)
    },
    videoTitle: {
        marginTop: scaleY(12),
        fontSize: scaleX(16),
        fontFamily: FONTS.InterSemiBold,
        color: "#111827",
    },
    stepText: {
        marginTop: scaleY(4),
        fontSize: scaleX(13),
        fontFamily: FONTS.InterRegular,
        color: "#6B7280",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(8),
        marginTop: 'auto'
    },
    progressBox: {
        height: scaleY(8),
        width: Matrix.DIM_70,
        backgroundColor: "#E5E7EB",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
    },
    percent: {
        textAlign: "right",
        fontSize: scaleX(12),
        fontFamily: FONTS.InterMedium,
        color: "#374151",
    },
    uploadDoneContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scaleX(8),
        marginTop: 'auto'
    },
    uploadText:{
        fontSize: scaleX(12),
        fontFamily: FONTS.InterMedium
    },
    backActionCta:{
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(10),
        justifyContent:"center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 'auto',
        columnGap: scaleX(8),
        borderWidth: 1,
        width: Matrix.DIM_100
    }
});
