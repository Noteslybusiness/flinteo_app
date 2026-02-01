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
import { useRef, useEffect } from "react"
import { BaseView } from "../../common/base/BaseView"
import { scaleX, scaleY, SCREEN } from "../../../utils/baseDim"
import { FONTS } from "../../../assets/theme/appFonts"
import { useNavigation } from "@react-navigation/native"
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../navigation/navUtils"

export const ONBOARDING_DATA = [
  {
    id: "1",
    title: "Empower Learning",
    subtitle: "Create engaging courses and deliver exceptional training experiences to your students.",
  },
  {
    id: "2",
    title: "Scale Your Center",
    subtitle: "Manage unlimited students, courses, and coaching programs from one powerful platform.",
  },
  {
    id: "3",
    title: "Track Success",
    subtitle: "Monitor student progress, engagement, and outcomes with detailed analytics and insights.",
  },
]


const OnBoardingAnimatedScreen = () => {
	const scrollX = useRef(new Animated.Value(0)).current
	const navigation = useNavigation()

	// Animation values for header
	const logoScale = useRef(new Animated.Value(0.5)).current
	const logoOpacity = useRef(new Animated.Value(0)).current
	const textOpacity = useRef(new Animated.Value(0)).current
	const textTranslateX = useRef(new Animated.Value(30)).current
	const ctaScale = useRef(new Animated.Value(1)).current

	useEffect(() => {
		// Animate header elements on mount
		Animated.sequence([
			// Logo animation
			Animated.parallel([
				Animated.timing(logoScale, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(logoOpacity, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
			]),
			// Small delay
			Animated.delay(200),
			// Text animation
			Animated.parallel([
				Animated.timing(textOpacity, {
					toValue: 1,
					duration: 600,
					useNativeDriver: true,
				}),
				Animated.timing(textTranslateX, {
					toValue: 0,
					duration: 600,
					useNativeDriver: true,
				}),
			]),
		]).start()

		// CTA pulsing animation
		const ctaPulse = Animated.loop(
			Animated.sequence([
				Animated.timing(ctaScale, {
					toValue: 1.05,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(ctaScale, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			])
		)
		
		// Start pulsing after initial animations
		setTimeout(() => {
			ctaPulse.start()
		}, 1500)

		return () => {
			ctaPulse.stop()
		}
	}, [])

	return (
		<BaseView>
			<LinearGradient
				colors={["#2563EB", "#22D3EE"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.container}
			>
				<View style={styles.header}>
					<Animated.View
						style={[
							styles.logoContainer,
							{
								opacity: logoOpacity,
								transform: [{ scale: logoScale }],
							},
						]}
					>
						<Image
							source={require("../../../assets/images/FlinteoFavicon.png")}
							style={styles.logo}
							resizeMode="contain"
						/>
					</Animated.View>
					<Animated.Text
						style={[
							styles.brand,
							{
								opacity: textOpacity,
								transform: [{ translateX: textTranslateX }],
							},
						]}
					>
						FLINTEO
					</Animated.Text>
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
					renderItem={({ item, index }) => (
						<SlideItem item={item} index={index} scrollX={scrollX} />
					)}
				/>

				<Pagination scrollX={scrollX} />

				<Animated.View
					style={[
						styles.cta,
						{
							transform: [{ scale: ctaScale }],
						},
					]}
				>
					<TouchableOpacity
						activeOpacity={0.9}
						style={styles.ctaButton}
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
				</Animated.View>
			</LinearGradient>
		</BaseView>
	)
}

export default OnBoardingAnimatedScreen

const SlideItem = ({ item, index, scrollX }: { item: any; index: number; scrollX: Animated.Value }) => {
	const inputRange = [
		(index - 1) * SCREEN.WIDTH,
		index * SCREEN.WIDTH,
		(index + 1) * SCREEN.WIDTH,
	]

	const titleOpacity = scrollX.interpolate({
		inputRange,
		outputRange: [0.3, 1, 0.3],
		extrapolate: "clamp",
	})

	const titleTranslateY = scrollX.interpolate({
		inputRange,
		outputRange: [50, 0, -50],
		extrapolate: "clamp",
	})

	const subtitleOpacity = scrollX.interpolate({
		inputRange,
		outputRange: [0, 1, 0],
		extrapolate: "clamp",
	})

	const subtitleTranslateY = scrollX.interpolate({
		inputRange,
		outputRange: [30, 0, -30],
		extrapolate: "clamp",
	})

	return (
		<View style={styles.slide}>
			<Animated.Text
				style={[
					styles.title,
					{
						opacity: titleOpacity,
						transform: [{ translateY: titleTranslateY }],
					},
				]}
			>
				{item.title}
			</Animated.Text>
			<Animated.Text
				style={[
					styles.subtitle,
					{
						opacity: subtitleOpacity,
						transform: [{ translateY: subtitleTranslateY }],
					},
				]}
			>
				{item.subtitle}
			</Animated.Text>
		</View>
	)
}

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
		marginBottom: scaleY(40),
		justifyContent: "center",
	},
	logoContainer: {
		marginRight: scaleX(12),
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	logo: {
		width: scaleY(32),
		height: scaleY(32),
	},
	brand: {
		color: "#FFFFFF",
		fontSize: scaleY(18),
		fontFamily: FONTS.InterDisplayBold,
		letterSpacing: 3,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	slide: {
		width: SCREEN.WIDTH,
		paddingHorizontal: scaleX(32),
		justifyContent: "center",
		alignItems: "flex-start",
	},
	title: {
		color: "#FFFFFF",
		fontSize: scaleY(48),
		fontFamily: FONTS.InterDisplayBold,
		lineHeight: scaleY(56),
		width: SCREEN.WIDTH * 0.85,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
	},
	subtitle: {
		color: "rgba(255,255,255,0.9)",
		fontSize: scaleY(16),
		fontFamily: FONTS.InterMedium,
		marginTop: scaleY(24),
		lineHeight: scaleY(24),
		width: SCREEN.WIDTH * 0.8,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	pagination: {
		position: "absolute",
		bottom: scaleY(SCREEN.HEIGHT / 6),
		flexDirection: "row",
		alignSelf: "center",
	},
	dot: {
		height: scaleY(10),
		width: scaleY(10),
		borderRadius: scaleY(5),
		backgroundColor: "#FFFFFF",
		marginHorizontal: scaleX(8),
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	cta: {
		position: "absolute",
		bottom: scaleY(SCREEN.HEIGHT / 18),
		left: scaleX(24),
		right: scaleX(24),
		height: scaleY(56),
		borderRadius: scaleY(18),
		backgroundColor: "#FFFFFF",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	ctaButton: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: scaleY(18),
	},
	ctaText: {
		color: "#2563EB",
		fontSize: scaleY(18),
		fontFamily: FONTS.InterDisplaySemiBold,
		letterSpacing: 0.5,
	},
})
