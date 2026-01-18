import { FlatList, StyleSheet, View, Dimensions } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { act, useContext, useEffect, useRef, useState } from "react";
import VideoPlaybackItem from "../components/VideoPlaybackItem";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { contentService } from "../../../../network/repo/content/ContentService";
import { SCREEN, VIDEO_VIEWPORT_HEIGHT, VIEWER_BAR_HEIGHT } from "../../../../utils/baseDim";
import HeaderComponent from "../components/HeaderComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ViewerHomeScreen: React.FC<DefaultScreenProps> = () => {
    const theme = useContext(ThemeContext);
    const inset = useSafeAreaInsets()
    const [videoList, setVideoList] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 80,
    }).current;

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: any) => {
            if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index);
            }
        }
    ).current;

    useEffect(() => {
        fetchVideoItems();
    }, []);

    useEffect(() => {
        if (videoList.length > 0) {
            handleUserAction('view')
        }
    },[activeIndex])

    const fetchVideoItems = async () => {
        try {
            const response = await contentService.getUserFeedsContent({});
            if (response?.data?.result) {
                setVideoList(response.data.data?.items);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleUserAction = async(action: any) => {
        let payload: any = {}
        payload.content_id = videoList[activeIndex].id;
        if(action === 'like'){
            payload.action = 'like'
        }else if(action === 'dislike')
            payload.action = 'dislike'
        else if(action === 'share')
            payload.action = 'share'
        else if(action === 'view')
            payload.action = 'view'

        try{
            const response = contentService.postUserContentAction(payload);
        }catch(e){
            console.log(e);
        }
    }

    const renderItem = ({ item, index }: any) => (
        <VideoPlaybackItem
            item={item}
            index={index}
            activeIndex={activeIndex}
            onAction={(action: string) => handleUserAction(action)}
        />
    );

    return (
        <BaseView>
            <View style={{
                height: VIDEO_VIEWPORT_HEIGHT,
                backgroundColor: theme.colors.background
            }}>
                {/* <HeaderComponent
                    theme={theme}
                    title="Instalearn"
                    inset={inset}
                /> */}
                <FlatList
                    data={videoList}
                    renderItem={renderItem}
                    pagingEnabled
                    windowSize={3}
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    removeClippedSubviews
                    updateCellsBatchingPeriod={50}
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
                    getItemLayout={(_, index) => ({
                        length: VIDEO_VIEWPORT_HEIGHT,
                        offset: VIDEO_VIEWPORT_HEIGHT * index,
                        index,
                    })}
                />
            </View>
            <View style={{ height: VIEWER_BAR_HEIGHT }} />
        </BaseView>
    );
};

export default ViewerHomeScreen;
