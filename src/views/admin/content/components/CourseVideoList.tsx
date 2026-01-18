import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	StyleSheet,
} from 'react-native';
import { PlayCircle } from 'lucide-react-native';
import { Matrix, scaleX, scaleY } from '../../../../utils/baseDim';
import { FONTS } from '../../../../assets/theme/appFonts';

type VideoListProps = {
	videos: any[];
	onVideoPress: (slug: string) => void;
	theme: any;
};

const VideoItem = ({ item, onPress, theme }: { item: any; onPress: () => void; theme: any }) => {
	const hasThumbnail = item.thumbnail && typeof item.thumbnail === 'string';

	return (
		<TouchableOpacity
			style={[styles.videoItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
			onPress={onPress}
		>
			<View style={styles.thumbnailContainer}>
				{hasThumbnail ? (
					<Image
						source={{ uri: item.thumbnail }}
						style={styles.thumbnail}
						resizeMode="cover"
					/>
				) : (
					<View
						style={styles.thumbnail}

					>
						<PlayCircle size={28} color="#FFFFFF" style={styles.playOverlay} />
					</View>
				)}
			</View>
			<View style={styles.videoInfo}>
				<Text style={[styles.videoTitle, { color: theme.colors.text }]} numberOfLines={2}>
					{item.title}
				</Text>
				<Text style={[styles.videoMeta, { color: theme.colors.textSecondary }]}>
					{item.duration || 'Video'}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const CourseVideoList: React.FC<VideoListProps> = ({ videos, onVideoPress, theme }) => {
	if (videos.length === 0) {
		return (
			<View style={styles.emptyState}>
				<Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
					No videos available in this course.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
				Course Videos
			</Text>
			<View style={{ rowGap: scaleY(16) }}>
				{videos.map((video) => (
					<VideoItem
						key={video.id?.toString() || video.slug}
						item={video}
						onPress={() => onVideoPress(video.slug)}
						theme={theme}
					/>
				))}
			</View>
		</View>
	);
};

export default CourseVideoList;

const styles = StyleSheet.create({
	container: {
		width: Matrix.DIM_100,
		paddingHorizontal: scaleX(12)
	},
	sectionTitle: {
		marginHorizontal: scaleX(16),
		marginTop: scaleY(20),
		marginBottom: scaleY(10),
		fontSize: scaleX(16),
		fontFamily: FONTS.InterSemiBold,
	},
	videoItem: {
		padding: scaleX(8),
		borderRadius: scaleX(14),
		backgroundColor: '#FFFFFF',
		borderWidth: 0.5,
		borderColor: '#EAEAEA',
		flexDirection: 'row',
		alignItems: 'center',
	},
	thumbnailContainer: {
		marginRight: scaleX(14),
	},
	thumbnail: {
		width: scaleX(80),
		height: scaleY(60),
		borderRadius: scaleX(10),
		backgroundColor: '#d1d1d1ff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	playOverlay: {
		opacity: 0.9,
	},
	videoInfo: {
		flex: 1,
	},
	videoTitle: {
		fontSize: scaleX(15),
		fontFamily: FONTS.InterMedium,
		lineHeight: scaleY(20),
	},
	videoMeta: {
		marginTop: scaleY(4),
		fontSize: scaleX(13),
		fontFamily: FONTS.InterRegular,
	},
	emptyState: {
		padding: scaleY(40),
		alignItems: 'center',
	},
	emptyText: {
		fontSize: scaleX(14),
		fontFamily: FONTS.InterRegular,
	},
});