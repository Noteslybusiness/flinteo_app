import React from 'react';
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { X, Check, Users, CheckCheck, CheckCheckIcon, CheckSquare, BoxIcon, SquareCheck, Square } from 'lucide-react-native';
import { Matrix, scaleX, scaleY } from '../../../../utils/baseDim';
import { FONTS } from '../../../../assets/theme/appFonts';

type ShareGroupsModalProps = {
	visible: boolean;
	groups: any[];
	selectedGroups: Set<number>;
	onToggle: (id: number) => void;
	onApply: () => void;
	onClose: () => void;
	theme: any;
};

const ShareGroupsModal: React.FC<ShareGroupsModalProps> = ({
	visible,
	groups,
	selectedGroups,
	onToggle,
	onApply,
	onClose,
	theme,
}) => {
	const renderGroup = (group: any) => {
		const isSelected = selectedGroups.has(group.id);

		return (
			<TouchableOpacity
				key={group.id}
				activeOpacity={0.7}
				style={[
					styles.groupItem,
					// isSelected && styles.groupItemSelected,
				]}
				onPress={() => onToggle(group.id)}
			>
				<View style={styles.avatarContainer}>
					<View style={[styles.groupAvatar]}>
						<Users color={theme.colors.primary}/>
					</View>
					<Text style={[styles.groupName, { color: theme.colors.text }]} numberOfLines={1}>
						{group.name}
					</Text>
				</View>

				<View
					style={[
						styles.checkCircle,
						// isSelected && styles.checkCircleSelected,
					]}
				>
					{isSelected ? <SquareCheck size={24} color={theme.colors.primary}/> : <Square size={24} color={theme.colors.grayField}/>}
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<Modal visible={visible} transparent animationType="slide">
			<View style={styles.overlay}>
				<View style={[styles.content, { backgroundColor: theme.colors.background }]}>
					{/* Header */}
					<View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
						<Text style={[styles.title, { color: theme.colors.text }]}>
							Share with Groups
						</Text>
						<TouchableOpacity
							onPress={onClose}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						>
							<X size={24} color={theme.colors.textSecondary} />
						</TouchableOpacity>
					</View>

					{/* Body */}
					<ScrollView
						style={styles.body}
						contentContainerStyle={groups.length === 0 && styles.emptyBody}
						showsVerticalScrollIndicator={false}
					>
						{groups.length === 0 ? (
							<Text style={[styles.noGroupsText, { color: theme.colors.textSecondary }]}>
								No groups available
							</Text>
						) : (
							groups.map(renderGroup)
						)}
					</ScrollView>

					{/* Footer */}
					<View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
						<TouchableOpacity
							style={[styles.actionButton, styles.cancelButton]}
							onPress={onClose}
						>
							<Text style={[styles.cancelText, { color: theme.colors.surfaceText }]}>
								Cancel
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.actionButton,
								styles.applyButton,
								{ backgroundColor: theme.colors.primary },
							]}
							onPress={onApply}
						>
							<Text style={styles.applyText}>Apply</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default ShareGroupsModal;

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	content: {
		borderTopLeftRadius: scaleX(24),
		borderTopRightRadius: scaleX(24),
		maxHeight: Matrix.DIM_80
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: scaleX(16),
		paddingVertical: scaleY(16),
		borderBottomWidth: 1,
	},
	title: {
		fontSize: scaleX(18),
		fontFamily: FONTS.InterSemiBold,
	},
	body: {
		flexGrow: 1,
		paddingHorizontal: scaleX(16),
		paddingTop: scaleY(8),
	},
	emptyBody: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	noGroupsText: {
		textAlign: 'center',
		fontSize: scaleX(15),
		fontFamily: FONTS.InterRegular,
	},

	// Compact Group Item
	groupItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: scaleY(12),
		borderRadius: scaleX(14),
		backgroundColor: 'transparent',
		marginBottom: scaleY(6),
		paddingHorizontal: scaleX(8)
	},
	groupItemSelected: {
		backgroundColor: '#F0FDF4',
		borderWidth: 1,
		borderColor: '#BBF7D0',
	},
	avatarContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	groupAvatar: {
		width: scaleX(44),
		height: scaleX(44),
		borderRadius: scaleX(22),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: scaleX(14),
	},
	groupAvatarText: {
		fontSize: scaleX(16),
		fontFamily: FONTS.InterSemiBold,
	},
	groupName: {
		fontSize: scaleX(14),
		fontFamily: FONTS.InterMedium,
		flexShrink: 1,
	},

	// Smaller Checkbox
	checkCircle: {
		width: scaleX(24),
		height: scaleX(24),
		borderRadius: scaleX(12),
		alignItems: 'center',
		justifyContent: 'center',
	},
	checkCircleSelected: {
		backgroundColor: '#10B981',
		borderColor: '#10B981',
	},

	// Footer
	footer: {
		flexDirection: 'row',
		paddingHorizontal: scaleX(20),
		paddingVertical: scaleY(8),
		borderTopWidth: 1,
		gap: scaleX(12),
	},
	actionButton: {
		flex: 1,
		paddingVertical: scaleY(12),
		borderRadius: scaleX(10),
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButton: {
		backgroundColor: 'rgba(0,0,0,0.05)',
	},
	cancelText: {
		fontSize: scaleX(14),
		fontFamily: FONTS.InterMedium,
	},
	applyButton: {
		// backgroundColor set inline via theme
	},
	applyText: {
		fontSize: scaleX(14),
		fontFamily: FONTS.InterSemiBold,
		color: '#fff',
	},
});