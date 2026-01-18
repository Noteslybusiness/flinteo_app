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

const LoginEmailPassword: React.FC<DefaultScreenProps> = ({
    navigation,
    route
}) => {
    const theme = useContext(ThemeContext)
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    useEffect(() => {
        setError(undefined)
    }, [email, password])

    const handleSubmit = () => {
        setLoading(true)
        const authService = new UserAuthService()
        authService.postUserLoginRepo({
            email: email,
            password: password,
            login_provider: 'email-password'
        }).then(res => {
            if (res?.data?.result) {
                Promise.all([
                    UserSessionService.setAuthToken({
                        accessToken: res.data.data.access,
                        refreshToken: res.data.data.refresh
                    }),
                    UserSessionService.setUserProfile({
                        id: res.data.data.user.id,
                        email: res.data.data.user.email,
                        first_name: res.data.data.user.first_name,
                        last_name: res.data.data.user.last_name,
                        mobile_number: res.data.data.user.mobile_number,
                        role_id: res.data.data.user.role_id,
                        role_name: res.data.data.user.role_name,
                    })
                ]).then(resp => {
                    eventEmitter.emit("user-login")
                })
            }
        }).catch(err => {
            console.log(err?.message)
            if (err?.response?.data?.message) {
                setError(err.response.data.message)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <BaseView>
            <View style={{ flex:1, backgroundColor: theme.colors.background}}>
                <KeyboardAwareContainer contentContainerStyle={{ paddingHorizontal: scaleY(16), backgroundColor: theme.colors.background }}>
                    <View style={styles.logoContainer}>
                        <Image resizeMode="contain" style={styles.logo} source={require('../../../assets/images/flinteo.png')} />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.primary }
                        ]}
                    >
                        Login
                    </Text>
                    <Text
                        style={[
                            styles.subTitle,
                            { color: theme.colors.surfaceText }
                        ]}
                    >
                        Enter your details to log in
                    </Text>
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

                    <TouchableOpacity
                        style={styles.otpOptonContainer}
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
                                styles.otpText,
                                { color: theme.colors.primary }
                            ]}
                        >
                            Other Login Options
                        </Text>
                        <ArrowRight
                            color={theme.colors.primary}
                            width={scaleX(16)}
                            height={scaleY(16)}
                            strokeWidth={2.6}
                        />
                    </TouchableOpacity>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scaleX(16)
    },
    content: {
        flex: 1,
        width: Matrix.DIM_100,
        rowGap: scaleY(12)
    },
    logoContainer: {
        width: Matrix.DIM_100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: Matrix.DIM_70,
        height: scaleY(120)
    },
    title: {
        fontSize: scaleY(28),
        fontFamily: FONTS.InterExtraBold
    },
    subTitle: {
        fontSize: scaleY(16),
        fontFamily: FONTS.InterRegular,
        marginBottom: scaleY(12)
    },
    otpOptonContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: scaleX(6),
        alignSelf: "flex-start",
        paddingBottom: scaleY(16)
    },
    otpText: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterSemiBold
    }
});

export default LoginEmailPassword;