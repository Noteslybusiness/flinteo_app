import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { scaleX, scaleY } from '../../../../utils/baseDim';
import { FONTS } from '../../../../assets/theme/appFonts';

type SharedGroupsSectionProps = {
	sharedGroups: any[];
	onAddPress: () => void;
	theme: any;
};

// Simple hash function for consistent group avatar colors
const stringToColor = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const colors = [
		'#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
		'#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
	];
	return colors[Math.abs(hash % colors.length)];
};

const SharedGroupsSection: React.FC<SharedGroupsSectionProps> = ({
	sharedGroups,
	onAddPress,
	theme,
}) => {
	return (
		<View style={styles.container}>
			<Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
				Shared with Groups
			</Text>

			<View style={styles.contentRow}>
				{/* Fixed Add Button with Icon + Text */}
				<TouchableOpacity style={styles.addButtonContainer} onPress={onAddPress}>
					<View style={[styles.addButton, { borderColor: 'rgba(0,0,0,0.1)' }]}>
						<Plus size={24} color={theme.colors.surfaceText} />
					</View>
					<Text
						style={[
							styles.addButtonText,
							{ color: theme.colors.textSecondary },
						]}
					>
						Add
					</Text>
				</TouchableOpacity>

				{/* Scrollable Group Items */}
				{sharedGroups.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text style={[styles.noSharedText, { color: theme.colors.surfaceText }]}>
							Not shared with any group yet
						</Text>
					</View>
				) : (
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						{sharedGroups.map((group) => (
							<View key={group.id} style={styles.groupItem}>
								<View
									style={[
										styles.groupAvatar,
										{ backgroundColor: stringToColor(group.name) },
									]}
								>
									<Text style={styles.groupAvatarText}>
										{group.name.charAt(0).toUpperCase()}
									</Text>
								</View>
								<Text
									style={[styles.groupName, { color: theme.colors.textSecondary }]}
									numberOfLines={1}
								>
									{group.name}
								</Text>
							</View>
						))}
					</ScrollView>
				)}
			</View>
		</View>
	);
};

export default SharedGroupsSection;

const styles = StyleSheet.create({
	container: {
		marginTop: scaleY(16),
		marginHorizontal: scaleX(16),
	},
	sectionTitle: {
		fontSize: scaleX(16),
		fontFamily: FONTS.InterSemiBold,
		marginBottom: scaleY(12),
	},
	contentRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	addButtonContainer: {
		alignItems: 'center',
		marginRight: scaleX(20),
		width: scaleX(70),
	},
	addButton: {
		width: scaleX(56),
		height: scaleX(56),
		borderRadius: scaleX(28),
		backgroundColor: 'rgba(0,0,0,0.05)',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderStyle: 'dashed',
	},
	addButtonText: {
		fontSize: scaleX(13),
		fontFamily: FONTS.InterMedium,
		marginTop: scaleY(8),
		textAlign: 'center',
	},
	scrollContent: {
		alignItems: 'center',
		paddingEnd: scaleX(20),
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingLeft: scaleX(10),
	},
	noSharedText: {
		fontSize: scaleX(14),
		fontFamily: FONTS.InterRegular,
	},
	groupItem: {
		alignItems: 'center',
		marginRight: scaleX(20),
		width: scaleX(70),
	},
	groupAvatar: {
		width: scaleX(56),
		height: scaleX(56),
		borderRadius: scaleX(28),
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: scaleY(8),
	},
	groupAvatarText: {
		fontSize: scaleX(20),
		fontFamily: FONTS.InterSemiBold,
		color: '#FFFFFF',
	},
	groupName: {
		fontSize: scaleX(13),
		fontFamily: FONTS.InterMedium,
		textAlign: 'center',
	},
});