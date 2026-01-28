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

const LoginEmailPassword: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const theme = useContext(ThemeContext);

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        setError(undefined);
    }, [email, password]);

    const handleSubmit = () => {
        setLoading(true);
        const authService = new UserAuthService();
        authService
            .postUserLoginRepo({
                email,
                password,
                login_provider: "email-password",
            })
            .then((res) => {
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
                            mobile_number: res.data.data.user.mobile_number,
                            role_id: res.data.data.user.role_id,
                            role_name: res.data.data.user.role_name,
                        }),
                    ]).then(() => {
                        eventEmitter.emit("user-login");
                    });
                }
            })
            .catch((err) => {
                if (err?.response?.data?.message) {
                    setError(err);
                } else {
                    setError(err.response.data.message);
                }
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
                            source={require("../../../assets/images/flinteo.png")}
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
                        Login to continue learning with Flinteo
                    </Text>

                    {/* Inputs */}
                    <View style={styles.form}>
                        <EmailInput
                            theme={theme}
                            onChangeText={setEmail}
                            errorMessage={error}
                        />

                        <PasswordInput
                            theme={theme}
                            onChangeText={setPassword}
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
                        disabled={loading}
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
        width: Matrix.DIM_60,
        height: scaleY(120),
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
