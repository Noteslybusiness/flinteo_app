import React, { useContext, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from "react-native";
import { BaseView } from "../../common/base/BaseView";
import { ThemeContext } from "../../../assets/theme/themeContext";
import { scaleY } from "../../../utils/baseDim";
import { FONTS } from "../../../assets/theme/appFonts";

interface ViewProp {
    onCompleted: () => void;
}

const SplashScreen: React.FC<ViewProp> = ({ onCompleted }) => {
    const theme = useContext(ThemeContext);

    // App name animation
    const logoScale = useRef(new Animated.Value(0.85)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;

    // Tagline animation
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineTranslate = useRef(new Animated.Value(12)).current;

    useEffect(() => {
        Animated.sequence([
            // App name enters
            Animated.parallel([
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),

            // Small delay
            Animated.delay(200),

            // Tagline enters
            Animated.parallel([
                Animated.timing(taglineOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(taglineTranslate, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        const timer = setTimeout(() => {
            onCompleted();
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <BaseView>
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                {/* App Name */}
                <Animated.Text
                    style={[
                        styles.appName,
                        {
                            color: theme.colors.primary,
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    FLINTEO
                </Animated.Text>

                {/* Tagline */}
                <Animated.Text
                    style={[
                        styles.tagline,
                        {
                            color: theme.colors.surfaceText,
                            opacity: taglineOpacity,
                            transform: [{ translateY: taglineTranslate }],
                        },
                    ]}
                >
                    Learn. Anytime. Anywhere.
                </Animated.Text>
            </View>
        </BaseView>
    );
};

export default SplashScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    appName: {
        fontSize: scaleY(36),
        fontFamily: FONTS.InterDisplayMedium,
        letterSpacing: 2,
    },
    tagline: {
        marginTop: scaleY(10),
        fontSize: scaleY(14),
        fontFamily: FONTS.InterRegular,
        opacity: 0.85,
    },
});
