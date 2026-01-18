import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import {
    pick,
    types,
    DocumentPickerResponse,
} from "@react-native-documents/picker";
import { Upload, X } from "lucide-react-native";
import Video from "react-native-video";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import CommonHeader from "../components/CommonHeader";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import InputTextField from "../components/InputTextField";
import InputTextAreaField from "../components/InputTextAreaField";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { createThumbnail } from "react-native-create-thumbnail";
import ThumbnailPicker from "../components/ThumbnailPicker";
import DropdownField from "../components/DropdownField";
import KeyboardAwareContainer from "../../../common/components/KeyboardAwareContainer";
import CoursePickerField from "../components/CoursePickerField";
import VideoVisibilityField from "../components/VideoVisibilityField";
import { contentService } from "../../../../network/repo/content/ContentService";
import { FONTS } from "../../../../assets/theme/appFonts";
import {
    AppScreens,
    NAV_ACTIONS,
    navScreen,
} from "../../../../navigation/navUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VideoMeta {
    mime_type?: string;
    file_extension?: string;
    duration?: number;
    size?: number;
    width?: number;
    height?: number;
}

interface UploadVideoForm {
    video: DocumentPickerResponse | null;
    title: string;
    description: string;
    tags: string;
    categoryId?: number;
    courseId?: number;
    visibilityId?: number;
    thumbnail: string | DocumentPickerResponse | null;
    videoMeta: VideoMeta | null;
}

const UploadVideoScreen: React.FC<DefaultScreenProps> = ({
    navigation,
}) => {
    const theme = useContext(ThemeContext);
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [fieldOptions, setFieldOptions] = useState<any>();
    const inset = useSafeAreaInsets()

    const [form, setForm] = useState<UploadVideoForm>({
        video: null,
        title: "",
        description: "",
        tags: "",
        thumbnail: null,
        videoMeta: null,
    });

    const updateForm = <K extends keyof UploadVideoForm>(
        key: K,
        value: UploadVideoForm[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchFieldOptions();
    }, []);

    const fetchFieldOptions = async () => {
        try {
            const response =
                await contentService.getContentFieldOptions();
            if (response?.data?.result) {
                setFieldOptions(response?.data?.data);
            }
        } catch { }
    };

    const createNewCourse = async (title: string) => {
        try {
            const response =
                await contentService.createCourseContent({
                    title,
                    visibility: 1,
                });
            if (response?.data?.result) {
                fetchFieldOptions();
                updateForm(
                    "courseId",
                    response?.data?.data?.id
                );
            }
        } catch { }
    };

    const CATEGORY_OPTIONS = [
        { id: 1, value: "Education" },
        { id: 2, value: "Entertainment" },
        { id: 3, value: "Technology" },
    ];

    /* ================= VIDEO PICK ================= */

    const pickVideo = async () => {
        try {
            const result = await pick({
                type: types.video,
                allowMultiSelection: false,
            });

            if (!result?.length) return;

            const videoFile = result[0];

            const extension =
                videoFile.name?.split(".").pop() || "";

            updateForm("video", videoFile);
            updateForm("videoMeta", {
                mime_type: videoFile.type || "",
                file_extension: extension || "",
                size: videoFile.size || 0,
            });

            const thumb1 = await createThumbnail({
                url: videoFile.uri,
                timeStamp: 1000,
            });
            const thumb2 = await createThumbnail({
                url: videoFile.uri,
                timeStamp: 3000,
            });

            setThumbnails([thumb1.path, thumb2.path]);
            updateForm("thumbnail", thumb1.path);
        } catch { }
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async (
        status: "draft" | "publish"
    ) => {
        if (!form.video) {
            Alert.alert("Please select a video");
            return;
        }
        if (!form.title) {
            Alert.alert("Please enter video title");
            return;
        }
        if (!form.thumbnail) {
            Alert.alert("Please select a thumbnail");
            return;
        }
        if (!form.categoryId) {
            Alert.alert("Please select a category");
            return;
        }
        if (!form.visibilityId) {
            Alert.alert("Please select visibility");
            return;
        }

        navScreen(
            navigation,
            AppScreens.UPLOAD_VIDEO_DETAILS,
            NAV_ACTIONS.NAVIGATE,
            {
                video: form.video,
                thumbnail: form.thumbnail,
                payload: {
                    title: form.title,
                    description: form.description,
                    tags: form.tags
                        ? form.tags
                            .split(",")
                            .map(t => t.trim())
                        : [],
                    categoryId: form.categoryId,
                    courseId: form.courseId,
                    visibilityId: form.visibilityId,
                    status,
                    video_meta: form.videoMeta,
                },
            }
        );
    };

    console.log(form);

    return (
        <BaseView>
            <CommonHeader
                theme={theme}
                title="Upload Video"
                onBackPress={() =>
                    navigation.goBack()
                }
            />
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <KeyboardAwareContainer>
                    {!form.video ? (
                        <TouchableOpacity
                            style={styles.pickerBox}
                            onPress={pickVideo}
                        >
                            <Upload
                                size={40}
                                color={theme.colors.primary}
                            />
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        color:
                                            theme.colors.text,
                                    },
                                ]}
                            >
                                Tap to select a video
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.videoWrapper}>
                            <Video
                                source={{
                                    uri: form.video.uri,
                                }}
                                style={styles.video}
                                resizeMode="contain"
                                controls
                                onLoad={data => {
                                    updateForm(
                                        "videoMeta",
                                        {
                                            ...form.videoMeta,
                                            width:
                                                data.naturalSize
                                                    ?.width,
                                            height:
                                                data.naturalSize
                                                    ?.height,
                                        }
                                    );
                                }}
                                onProgress={data => {
                                    updateForm(
                                        "videoMeta",
                                        {
                                            ...form.videoMeta,
                                            duration: Math.floor(
                                                data.seekableDuration
                                            ),
                                        }
                                    )
                                }}
                                progressUpdateInterval={1000}

                            />

                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={() => {
                                    updateForm(
                                        "video",
                                        null
                                    );
                                    updateForm(
                                        "videoMeta",
                                        null
                                    );
                                    setThumbnails([]);
                                    updateForm(
                                        "thumbnail",
                                        null
                                    );
                                }}
                            >
                                <X
                                    size={18}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.descContainer}>
                        {thumbnails.length > 0 && (
                            <ThumbnailPicker
                                theme={theme}
                                thumbnails={thumbnails}
                                onSelect={thumb =>
                                    updateForm(
                                        "thumbnail",
                                        thumb
                                    )
                                }
                            />
                        )}

                        <InputTextField
                            theme={theme}
                            label="Video Title"
                            placeholder="Enter Video Title"
                            value={form.title}
                            onChangeText={text =>
                                updateForm("title", text)
                            }
                        />

                        <InputTextAreaField
                            theme={theme}
                            label="Video Description"
                            placeholder="Enter Video Description"
                            value={form.description}
                            onChangeText={text =>
                                updateForm(
                                    "description",
                                    text
                                )
                            }
                        />

                        <InputTextField
                            theme={theme}
                            label="Video Tags"
                            placeholder="Ex - Reels,Video,Music"
                            value={form.tags}
                            onChangeText={text =>
                                updateForm("tags", text)
                            }
                        />

                        <VideoVisibilityField
                            theme={theme}
                            selectedId={
                                form.visibilityId
                            }
                            options={
                                fieldOptions?.visibility_options ||
                                []
                            }
                            onSelect={id =>
                                updateForm(
                                    "visibilityId",
                                    id
                                )
                            }
                        />

                        <DropdownField
                            theme={theme}
                            label="Category"
                            placeholder="Select category"
                            options={CATEGORY_OPTIONS}
                            selectedId={form.categoryId}
                            onSelect={opt =>
                                updateForm(
                                    "categoryId",
                                    opt.id
                                )
                            }
                        />

                        <CoursePickerField
                            theme={theme}
                            options={
                                fieldOptions?.course_options ||
                                []
                            }
                            selectedId={form.courseId}
                            onSelect={course =>
                                updateForm(
                                    "courseId",
                                    course.id
                                )
                            }
                            onCreate={createNewCourse}
                        />
                    </View>
                </KeyboardAwareContainer>
                <View
                    style={[
                        styles.bottomBar,
                        {
                            backgroundColor:
                                theme.colors.background,
                            paddingBottom: inset.bottom
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.draftBtn,
                            {
                                borderColor:
                                    theme.colors.grayField,
                            },
                        ]}
                        onPress={() =>
                            handleSubmit("draft")
                        }
                    >
                        <Text
                            style={[
                                styles.draftText,
                                {
                                    color:
                                        theme.colors
                                            .surfaceText,
                                },
                            ]}
                        >
                            Save Draft
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.publishBtn,
                            {
                                backgroundColor:
                                    theme.colors.primary,
                            },
                        ]}
                        onPress={() =>
                            handleSubmit("publish")
                        }
                    >
                        <Text
                            style={styles.publishText}
                        >
                            Publish
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseView>
    );
};

export default UploadVideoScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: { flex: 1 },

    pickerBox: {
        height: scaleY(180),
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: scaleX(16),
        marginTop: scaleY(16),
    },

    text: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "500",
    },

    videoWrapper: {
        height: scaleY(200),
        width: Matrix.DIM_100,
        overflow: "hidden",
    },

    video: { width: "100%", height: "100%" },

    removeBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 6,
        borderRadius: 16,
    },

    descContainer: {
        paddingHorizontal: scaleX(16),
        marginTop: scaleY(24),
        rowGap: scaleY(16),
    },

    bottomBar: {
        flexDirection: "row",
        paddingHorizontal: scaleX(16),
        paddingVertical: scaleY(12),
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
});
