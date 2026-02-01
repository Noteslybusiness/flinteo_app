import {
	View,
	Text,
	StyleSheet,
	Animated,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useRef } from "react"
import { BaseView } from "../../common/base/BaseView"
import { scaleX, scaleY, SCREEN } from "../../../utils/baseDim"
import { FONTS } from "../../../assets/theme/appFonts"
import { useNavigation } from "@react-navigation/native"
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../navigation/navUtils"

export const ONBOARDING_DATA = [
  {
    id: "1",
    title: "Skill Faster",
    subtitle: "Learn industry-ready skills from experts worldwide.",
  },
  {
    id: "2",
    title: "Train Teams",
    subtitle: "Manage courses, users, and groups at scale.",
  },
  {
    id: "3",
    title: "Grow Smarter",
    subtitle: "Track progress and build real impact with Flinteo.",
  },
]


const OnBoardingAnimatedScreen = () => {
	const scrollX = useRef(new Animated.Value(0)).current
	const navigation = useNavigation()

	return (
		<BaseView>
			<LinearGradient
				colors={["#2563EB", "#22D3EE"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.container}
			>
				<View style={styles.header}>
					<Image
						source={require("../../../assets/images/FlinteoFavicon.png")}
						style={styles.logo}
						resizeMode="contain"
					/>
					<Text style={styles.brand}>FLINTEO</Text>
				</View>

				<Animated.FlatList
					data={ONBOARDING_DATA}
					keyExtractor={(item) => item.id}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{ useNativeDriver: false }
					)}
					renderItem={({ item }) => (
						<View style={styles.slide}>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={styles.subtitle}>{item.subtitle}</Text>
						</View>
					)}
				/>

				<Pagination scrollX={scrollX} />

				<TouchableOpacity
					activeOpacity={0.9}
					style={styles.cta}
					onPress={() =>
						navScreen(
							navigation,
							AppScreens.LOGIN_EMAIL_PASSWORD_SCREEN,
							NAV_ACTIONS.REPLACE
						)
					}
				>
					<Text style={styles.ctaText}>Get Started</Text>
				</TouchableOpacity>
			</LinearGradient>
		</BaseView>
	)
}

export default OnBoardingAnimatedScreen

const Pagination = ({ scrollX }: { scrollX: Animated.Value }) => {
	return (
		<View style={styles.pagination}>
			{ONBOARDING_DATA.map((_, i) => {
				const inputRange = [
					(i - 1) * SCREEN.WIDTH,
					i * SCREEN.WIDTH,
					(i + 1) * SCREEN.WIDTH,
				]

				const scale = scrollX.interpolate({
					inputRange,
					outputRange: [0.8, 1.4, 0.8],
					extrapolate: "clamp",
				})

				const opacity = scrollX.interpolate({
					inputRange,
					outputRange: [0.4, 1, 0.4],
					extrapolate: "clamp",
				})

				return (
					<Animated.View
						key={i}
						style={[
							styles.dot,
							{ transform: [{ scale }], opacity },
						]}
					/>
				)
			})}
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: scaleY(40),
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: scaleX(24),
		marginBottom: scaleY(20),
	},
	logo: {
		width: scaleY(24),
		height: scaleY(24),
		marginRight: scaleX(8),
	},
	brand: {
		color: "#FFFFFF",
		fontSize: scaleY(12),
		fontFamily: FONTS.InterSemiBold,
		letterSpacing: 2,
	},
	slide: {
		width: SCREEN.WIDTH,
		paddingHorizontal: scaleX(32),
		justifyContent: "center",
	},
	title: {
		color: "#FFFFFF",
		fontSize: scaleY(44),
		fontFamily: FONTS.InterDisplayMedium,
		lineHeight: scaleY(52),
		width: SCREEN.WIDTH * 0.85,
	},
	subtitle: {
		color: "rgba(255,255,255,0.85)",
		fontSize: scaleY(15),
		fontFamily: FONTS.InterRegular,
		marginTop: scaleY(20),
		lineHeight: scaleY(22),
		width: SCREEN.WIDTH * 0.8,
	},
	pagination: {
		position: "absolute",
		bottom: scaleY(SCREEN.HEIGHT / 6),
		flexDirection: "row",
		alignSelf: "center",
	},
	dot: {
		height: scaleY(8),
		width: scaleY(8),
		borderRadius: scaleY(4),
		backgroundColor: "#FFFFFF",
		marginHorizontal: scaleX(6),
	},
	cta: {
		position: "absolute",
		bottom: scaleY(SCREEN.HEIGHT / 18),
		left: scaleX(24),
		right: scaleX(24),
		height: scaleY(54),
		borderRadius: scaleY(16),
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
	},
	ctaText: {
		color: "#2563EB",
		fontSize: scaleY(16),
		fontFamily: FONTS.InterSemiBold,
	},
})
