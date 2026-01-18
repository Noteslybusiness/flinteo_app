import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import DraggableFlatList, {
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import CommonHeader from "../components/CommonHeader";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import { GripVertical, Plus, X } from "lucide-react-native";
import InputTextField from "../components/InputTextField";
import ImagePickerField from "../../../common/components/ImagePickerField";
import { utilsService } from "../../../../network/repo/utils/UtilsService";
import { CONTENT_TYPES } from "../../../../network/utils/constants";
import AddVideoModal from "../components/AddVideoModal";
import KeyboardAwareContainer from "../../../common/components/KeyboardAwareContainer";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { contentService } from "../../../../network/repo/content/ContentService";

const EditCourseScreen: React.FC<DefaultScreenProps> = ({
    navigation,
    route,
}) => {
    const theme = useContext(ThemeContext);
    const { colors } = theme;

    const [courseInfo, setCourseInfo] = useState<any>(null);
    const [newThumbnail, setNewThumbnail] = useState<string>("");
    const [initialVideos, setInitialVideos] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [videoModalVisible, setVideoModalVisible] = useState(false);

    useEffect(() => {
        const initialCourse = route.params.course_info;
        let initialVideos = route.params.video_contents || [];

        // Ensure every video has a position (order)
        initialVideos = initialVideos.map((video: any, index: number) => ({
            ...video,
            position: video.position ?? index + 1, // fallback to index if missing
        }));

        // Sort by position to display in correct order
        initialVideos.sort((a: any, b: any) => a.position - b.position);

        setCourseInfo(initialCourse);
        setVideos(initialVideos);
        setInitialVideos(initialVideos)
    }, []);

    const onSave = async () => {
        // Update positions before saving (in case user dragged but didn't release perfectly)
        const orderedVideos = videos.map((video, index) => ({
            ...video,
            position: index + 1,
        }));
        let payload: any = {}
        payload.id = courseInfo.id
        payload.title = courseInfo.title
        payload.description = courseInfo.description
        if(newThumbnail)
            payload.thumbnail = newThumbnail
        let payloadVideos: any[] = []
        let initialVideoIds = initialVideos.map(video => video.id)
        orderedVideos.forEach((video) => {
            if (initialVideoIds.includes(video.id)) {
                payloadVideos.push({
                    id: video.id,
                    position: video.position
                })
            } else {
                payloadVideos.push({
                    slug: video.slug,
                    position: video.position
                })
            }
        })
        payload.video_items = payloadVideos
        try {
            const response = await contentService.updateCourseContent(payload)
        } catch (err: any) {
            console.log(err)
        } finally {
            navigation.goBack()
        }
    };

    const handleUploadImage = async (
        file: any,
        fileType: string = CONTENT_TYPES.CONTENT_VIDEO_THUMBNAIL
    ): Promise<string> => {
        const formData = new FormData();
        const filePayload = {
            uri: file.uri,
            name: file.name || `image_${Date.now()}.jpg`,
            type: file.type || file.mimeType || "image/jpeg",
        };

        formData.append("file", filePayload as any);
        formData.append("file_type", fileType);

        const response = await utilsService.fileUpload(formData, () => { });
        setNewThumbnail(response.data.data.file_url);
        return response.data.data.file_url;
    };

    const onClose = () => {
        navigation.goBack();
    };

    /** ✅ receives FULL OBJECT LIST - so set directly, not append */
    const onAddVideos = (selectedVideos: any[]) => {
        // Assign positions 1-N to the full list
        const updatedVideos = selectedVideos.map((video, index) => ({
            ...video,
            position: index + 1,
        }));

        // Sort if needed (e.g., if modal doesn't preserve order)
        updatedVideos.sort((a: any, b: any) => a.position - b.position);

        setVideos(updatedVideos);
        setVideoModalVisible(false);
    };

    const onRemoveVideo = (video: any) => {
        const filtered = videos.filter((v) => v.id !== video.id);

        // Reassign positions after removal
        const reordered = filtered.map((v, idx) => ({
            ...v,
            position: idx + 1,
        }));

        setVideos(reordered);
    };

    const renderVideoItem = ({ item, drag, isActive }: RenderItemParams<any>) => (
        <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={[
                styles.videoCard,
                { borderColor: colors.border },
                isActive && { backgroundColor: colors.primary + "20" }, // optional highlight
            ]}
        >
            <View style={styles.videoLeft}>
                <GripVertical size={18} color={colors.primary} />
                <View style={styles.thumbnailWrapper}>
                    <Image
                        source={{ uri: item.thumbnail }}
                        style={styles.thumbnail}
                    />
                </View>
                <View style={styles.videoInfo}>
                    <Text
                        style={[styles.videoTitle, { color: colors.text }]}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>
                    {item.duration && (
                        <Text
                            style={[
                                styles.videoMeta,
                                { color: colors.surfaceText },
                            ]}
                        >
                            {item.duration}
                        </Text>
                    )}
                </View>
            </View>
            <TouchableOpacity
                onPress={() => onRemoveVideo(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <X size={18} color={colors.error} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <BaseView>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <CommonHeader
                    theme={theme}
                    title="Edit Course"
                    onBackPress={onClose}
                />
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <KeyboardAwareContainer>
                        {/* COURSE INFO */}
                        {courseInfo && (
                            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    Course Information
                                </Text>

                                <ImagePickerField
                                    theme={theme}
                                    imageUrl={courseInfo.thumbnail}
                                    onImageSelect={handleUploadImage}
                                />

                                <InputTextField
                                    theme={theme}
                                    value={courseInfo.title}
                                    placeholder="Course Title"
                                    onChangeText={(text) =>
                                        setCourseInfo((prev: any) => ({
                                            ...prev,
                                            title: text,
                                        }))
                                    }
                                />

                                <InputTextField
                                    theme={theme}
                                    value={courseInfo.description}
                                    placeholder="Course Description"
                                    multiline
                                    onChangeText={(text) =>
                                        setCourseInfo((prev: any) => ({
                                            ...prev,
                                            description: text,
                                        }))
                                    }
                                />
                            </View>
                        )}

                        {/* COURSE VIDEOS */}
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            <View style={styles.videoHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    Course Videos ({videos.length})
                                </Text>

                                <TouchableOpacity
                                    style={[styles.addBtn, { backgroundColor: colors.primary }]}
                                    onPress={() => setVideoModalVisible(true)}
                                >
                                    <Plus size={16} color={colors.onPrimary} />
                                    <Text style={[styles.addBtnText, { color: colors.onPrimary }]}>
                                        Add Videos
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <DraggableFlatList
                                data={videos}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderVideoItem}
                                nestedScrollEnabled
                                onDragEnd={({ data }) => {
                                    // Update positions after drag
                                    const updated = data.map((item, index) => ({
                                        ...item,
                                        position: index + 1,
                                    }));
                                    setVideos(updated);
                                }}
                                ListEmptyComponent={
                                    <Text
                                        style={[
                                            styles.emptyText,
                                            { color: colors.surfaceText },
                                        ]}
                                    >
                                        No videos added yet.
                                    </Text>
                                }
                            />
                        </View>
                    </KeyboardAwareContainer>

                    {/* BOTTOM ACTIONS */}
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: colors.border }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.closeText, { color: colors.text }]}>
                                Close
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: colors.primary }]}
                            onPress={onSave}
                        >
                            <Text style={[styles.saveText, { color: colors.onPrimary }]}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <AddVideoModal
                    visible={videoModalVisible}
                    onClose={() => setVideoModalVisible(false)}
                    onSubmit={onAddVideos}
                    alreadySelected={videos}
                    theme={theme}
                    course_slug={courseInfo?.slug}
                />
            </GestureHandlerRootView>
        </BaseView>
    );
};

export default EditCourseScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    card: {
        padding: scaleX(16),
        borderRadius: scaleX(12),
        rowGap: scaleX(12)
    },

    sectionTitle: {
        fontSize: scaleX(15),
        fontFamily: FONTS.InterSemiBold
    },

    inputPlaceholder: {
        height: scaleY(44),
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        paddingHorizontal: 12,
        marginBottom: 12,
    },

    videoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    addBtn: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: "center",
    },

    addBtnText: {
        color: "#fff",
        marginLeft: 6,
        fontSize: 12,
    },

    videoItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 0.5,
    },

    videoLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    videoIndex: {
        marginHorizontal: 6,
    },

    videoTitle: {
        fontFamily: FONTS.InterMedium,
        flex: 1,
    },

    dragHint: {
        marginTop: 8,
        fontSize: 11,
    },

    emptyText: {
        textAlign: "center",
        marginVertical: 12,
    },

    bottomBar: {
        flexDirection: "row",
        padding: scaleX(16),
        gap: 12,
        marginTop: 'auto'
    },

    btn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },

    saveText: {
        fontFamily: FONTS.InterSemiBold,
    },

    closeText: {
        color: "#374151",
    },
    videoCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: scaleY(10),
        borderBottomWidth: 0.5,
    },

    thumbnailWrapper: {
        width: scaleX(54),
        height: scaleY(36),
        borderRadius: 6,
        overflow: "hidden",
        marginHorizontal: scaleX(10),
        backgroundColor: "#E5E7EB",
    },

    thumbnail: {
        width: "100%",
        height: "100%",
    },

    videoInfo: {
        flex: 1,
        gap: 2,
    },

    videoMeta: {
        fontSize: scaleX(11),
    },
});
