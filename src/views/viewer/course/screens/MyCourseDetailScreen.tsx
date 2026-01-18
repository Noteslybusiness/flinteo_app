import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import { contentService } from "../../../../network/repo/content/ContentService";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import CommonHeader from "../../../admin/content/components/CommonHeader";
import CourseVideoList from "../components/CourseVideoList";
import CourseHeaderSection from "../components/CourseHeaderSection";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../../navigation/navUtils";

const MyCourseDetailScreen: React.FC<DefaultScreenProps> = ({
	navigation,
	route,
}) => {
	const theme = useContext(ThemeContext);

	const [courseInfo, setCourseInfo] = useState<any>(null);
	const [courseVideos, setCourseVideos] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCourseInfo();
	}, []);

	const fetchCourseInfo = async () => {
		try {
			setLoading(true);
			const response = await contentService.getMySharedCourses({
				course_slug: route.params.slug,
			});

			const data = response?.data?.data;
			if (data) {
				setCourseInfo(data.course_info);
				setCourseVideos(data.video_contents || []);
			}
		} catch (err) {
			console.log("Viewer course fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<BaseView>
				<CommonHeader
					theme={theme}
					title="Course Details"
					onBackPress={() => navigation.goBack()}
				/>
				<View style={styles.loader}>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>
			</BaseView>
		);
	}

	return (
		<BaseView>
			<CommonHeader
				theme={theme}
				title="Course Details"
				onBackPress={() => navigation.goBack()}
			/>
			<ScrollView contentContainerStyle={{ paddingBottom: scaleY(30) }}>
				{courseInfo && (
					<>
						{/* Course Info */}
						<CourseHeaderSection courseInfo={courseInfo} theme={theme} />

						{/* Videos List */}
						<CourseVideoList
							videos={courseVideos}
							theme={theme}
							onVideoPress={(videoInfo: any) =>
								navScreen(navigation, AppScreens.MY_PLAYBACK_SCREEN, NAV_ACTIONS.NAVIGATE, {
									videoInfo: videoInfo
								})
							}
						/>
					</>
				)}
			</ScrollView>
		</BaseView>
	);
};

export default MyCourseDetailScreen;

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
