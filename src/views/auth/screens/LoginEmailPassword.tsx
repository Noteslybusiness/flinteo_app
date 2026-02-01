import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BaseView } from "../../common/base/BaseView";
import { DefaultScreenProps } from "../../common/props/DefaultScreenProps";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../assets/theme/themeContext";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import { Matrix, scaleX, scaleY } from "../../../utils/baseDim";
import { FONTS } from "../../../assets/theme/appFonts";
import ActionButton from "../components/ActionButton";
import { ArrowRight } from "lucide-react-native";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../navigation/navUtils";
import { UserAuthService } from "../../../network/repo/auth/UserAuthService";
import { UserSessionService } from "../../../services/UserSessionService";
import eventEmitter from "../../../utils/eventEmiter";
import KeyboardAwareContainer from "../../common/components/KeyboardAwareContainer";
import BaseConfig from "../../../utils/baseConfig";
import { useAppDispatch } from "../../../hooks/storeHooks";
import { getUserOrgProfileData } from "../../../redux/organization/reducers/userProfileReducer";

const LoginEmailPassword: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useAppDispatch();
    console.log("======>", BaseConfig.BACKEND_SERVICE)

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        setError(undefined);
    }, [email, password]);

    const handleSubmit = () => {
        // Validate inputs before making API call
        if (!email || !email.trim()) {
            setError("Please enter your email address");
            return;
        }
        
        if (!password || !password.trim()) {
            setError("Please enter your password");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        const authService = new UserAuthService();
        authService
            .postUserLoginRepo({
                email: email.trim(),
                password: password.trim(),
                login_provider: "email-password",
            })
            .then((res) => {
                console.log("Login response:", res.data);
                if (res?.data?.result) {
                    Promise.all([
                        UserSessionService.setAuthToken({
                            accessToken: res.data.data.access,
                            refreshToken: res.data.data.refresh,
                        }),
                        UserSessionService.setUserProfile({
                            id: res.data.data.user.id,
                            email: res.data.data.user.email,
                            first_name: res.data.data.user.first_name,
                            last_name: res.data.data.user.last_name,
                            mobile_number: res.data.data.user.mobile_number || null,
                            role_id: res.data.data.user.role_id,
                            role_name: res.data.data.user.role_name,
                            organization_id: res.data.data.user.organization_id,
                            organization_name: res.data.data.user.organization_name,
                            profile_image: res.data.data.user.profile_image || null,
                        }),
                    ]).then(() => {
                        console.log("Session data saved successfully");
                        // Fetch profile data after successful login
                        dispatch(getUserOrgProfileData({}));
                        eventEmitter.emit("user-login");
                    }).catch((sessionError) => {
                        console.error("Error saving session data:", sessionError);
                        setError("Login successful but failed to save session. Please try again.");
                    });
                } else {
                    // Handle case where result is false
                    setError(res?.data?.message || "Login failed. Please try again.");
                }
            })
            .catch((err) => {
                console.log("Login error:", err);
                // Fix: Extract the actual error message string
                const errorMessage = err?.response?.data?.message || 
                                   err?.message || 
                                   "Login failed. Please check your credentials and try again.";
                setError(errorMessage);
            })
            .finally(() => setLoading(false));
    };

    return (
        <BaseView>
            <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
                <KeyboardAwareContainer
                    contentContainerStyle={
                        {...styles.container,
                        backgroundColor: theme.colors.background,}
                    }
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            resizeMode="contain"
                            style={styles.logo}
                            source={require("../../../assets/images/FlinteoFavicon.png")}
                        />
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Welcome back
                    </Text>

                    <Text
                        style={[
                            styles.subTitle,
                            { color: theme.colors.onSurfaceVariant },
                        ]}
                    >
                        Access your learning platform and explore courses
                    </Text>

                    {/* Inputs */}
                    <View style={styles.form}>
                        <EmailInput
                            theme={theme}
                            onChangeText={setEmail}
                            value={email}
                            errorMessage={error}
                        />

                        <PasswordInput
                            theme={theme}
                            onChangeText={setPassword}
                            value={password}
                            errorMessage={error}
                        />
                    </View>

                    {/* Other Options */}
                    <TouchableOpacity
                        style={styles.otherOption}
                        onPress={() =>
                            navScreen(
                                navigation,
                                AppScreens.OTP_OPTION_SCREEN,
                                NAV_ACTIONS.NAVIGATE
                            )
                        }
                    >
                        <Text
                            style={[
                                styles.otherText,
                                { color: theme.colors.primary },
                            ]}
                        >
                            Use another login method
                        </Text>
                        <ArrowRight
                            color={theme.colors.primary}
                            width={scaleX(16)}
                            height={scaleY(16)}
                            strokeWidth={2.4}
                        />
                    </TouchableOpacity>

                    {/* CTA */}
                    <ActionButton
                        disabled={loading || !email?.trim() || !password?.trim()}
                        theme={theme}
                        onPress={handleSubmit}
                        title="Login"
                    />
                </KeyboardAwareContainer>
            </View>
        </BaseView>
    );
};

export default LoginEmailPassword;


const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        paddingHorizontal: scaleX(20),
        paddingBottom: scaleY(24),
    },
    logoContainer: {
        alignItems: "center",
        marginTop: scaleY(24),
        marginBottom: scaleY(24),
    },
    logo: {
        width: scaleY(80),
        height: scaleY(80),
    },
    title: {
        fontSize: scaleY(26),
        fontFamily: FONTS.InterExtraBold,
    },
    subTitle: {
        fontSize: scaleY(15),
        fontFamily: FONTS.InterRegular,
        marginTop: scaleY(6),
        marginBottom: scaleY(24),
    },
    form: {
        rowGap: scaleY(14),
    },
    otherOption: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(6),
        marginTop: scaleY(12),
        marginBottom: scaleY(24),
        alignSelf: "flex-start",
    },
    otherText: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterSemiBold,
    },
});
