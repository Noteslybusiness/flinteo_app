import React, { useContext, useEffect, useState } from 'react';
import { BaseView } from '../../../common/base/BaseView';
import CommonHeader from '../components/CommonHeader';
import { ThemeContext } from '../../../../assets/theme/themeContext';
import { contentService } from '../../../../network/repo/content/ContentService';
import { userGroupService } from '../../../../network/repo/users/UserService';
import { scaleY } from '../../../../utils/baseDim';
import { AppScreens, NAV_ACTIONS, navScreen } from '../../../../navigation/navUtils';
import { ScrollView, ActivityIndicator, View, StyleSheet } from 'react-native';
import { DefaultScreenProps } from '../../../common/props/DefaultScreenProps';
import CourseVideoList from '../components/CourseVideoList';
import SharedGroupsSection from '../components/SharedGroupsSection';
import CourseHeaderSection from '../components/CourseHeaderSection';
import ShareGroupsModal from '../components/ShareGroupsModal';

const CourseDetailScreen: React.FC<DefaultScreenProps> = ({ navigation, route }) => {
	const theme = useContext(ThemeContext);
	const [courseInfo, setCourseInfo] = useState<any>(null);
	const [videos, setVideos] = useState<any[]>([]);
	const [sharedGroups, setSharedGroups] = useState<any[]>([]);
	const [allAvailableGroups, setAllAvailableGroups] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());

	useEffect(() => {
		fetchCourseDetails();
	}, []);

	const fetchCourseDetails = async () => {
		try {
			setLoading(true);
			const [courseRes, groupsRes] = await Promise.all([
				contentService.getCourseContent(route.params.slug),
				userGroupService.getUserGroups(),
			]);

			if (!courseRes?.data?.result) throw new Error('Failed to fetch course');

			const { course_info, video_contents = [], shared_groups = [] } = courseRes.data.data;
			const sharedIds = shared_groups.map((g: any) => g.id);
			const allGroups = groupsRes?.data?.data || [];

			setCourseInfo(course_info);
			setVideos(video_contents);
			setAllAvailableGroups(allGroups);
			setSharedGroups(allGroups.filter((g: any) => sharedIds.includes(g.id)));
			setSelectedGroups(new Set(sharedIds));
		} catch (err) {
			console.log('Error:', err);
		} finally {
			setLoading(false);
		}
	};

	const openShareModal = () => {
		setSelectedGroups(new Set(sharedGroups.map(g => g.id)));
		setModalVisible(true);
	};

	const toggleGroup = (id: number) => {
		const newSet = new Set(selectedGroups);
		if (newSet.has(id)) newSet.delete(id);
		else newSet.add(id);
		setSelectedGroups(newSet);
	};

	const applySharing = async () => {
		setModalVisible(false);
		const newlyShared = allAvailableGroups.filter((g) => selectedGroups.has(g.id));
		setSharedGroups(newlyShared);

		const payload = {
			content_id: courseInfo.id,
			user_groups: Array.from(selectedGroups),
			content_type: 2,
		};

		try {
			await contentService.userGroupShare(payload);
		} catch (err) {
			console.log('Share failed:', err);
		}
		fetchCourseDetails();
	};

	if (loading) {
		return (
			<BaseView>
				<CommonHeader theme={theme} title="Course Details" onBackPress={() => navigation.goBack()} />
				<View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
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
				onEditPress={() =>
					navScreen(navigation, AppScreens.EDIT_COURSE_SCREEN, NAV_ACTIONS.NAVIGATE, {
						course_info: courseInfo, 
						video_contents: videos
					})
				}
			/>
			<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
				<ScrollView contentContainerStyle={{ paddingBottom: scaleY(62) }}>
					{courseInfo && (
						<>
							<CourseHeaderSection courseInfo={courseInfo} theme={theme} />
							<SharedGroupsSection
								sharedGroups={sharedGroups}
								onAddPress={openShareModal}
								theme={theme}
							/>
							<CourseVideoList
								videos={videos}
								onVideoPress={(slug: any) => navigation.navigate('VideoDetailScreen', { slug })}
								theme={theme}
							/>
						</>
					)}
				</ScrollView>
				<ShareGroupsModal
					visible={modalVisible}
					groups={allAvailableGroups}
					selectedGroups={selectedGroups}
					onToggle={toggleGroup}
					onApply={applySharing}
					onClose={() => setModalVisible(false)}
					theme={theme}
				/>
			</View>
		</BaseView>
	);
};

export default CourseDetailScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})