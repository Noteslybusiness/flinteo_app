import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BaseView } from "../../common/base/BaseView";
import { DefaultScreenProps } from "../../common/props/DefaultScreenProps";
import { ArrowLeft } from "lucide-react-native";
import { scaleX, scaleY } from "../../../utils/baseDim";
import { ThemeContext } from "../../../assets/theme/themeContext";
import { FONTS } from "../../../assets/theme/appFonts";
import MobileInput from "../components/MobileInput";
import ActionButton from "../components/ActionButton";
import OtpInput from "../components/OtpInput";
import { UserAuthService } from "../../../network/repo/auth/UserAuthService";
import { UserSessionService } from "../../../services/UserSessionService";
import eventEmitter from "../../../utils/eventEmiter";
import { useAdaptiveInsets } from "../../../hooks/useAdaptiveInsets";

const OTP_RESEND_TIME = 30;

const isValidMobile = (value: string) => /^[6-9]\d{9}$/.test(value);

const LoginMobileOtpScreen: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const inset = useAdaptiveInsets();
    const theme = useContext(ThemeContext);

    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [isdCode, setIsdCode] = useState("+91");

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeCta, setActiveCta] = useState(false);
    const [error, setError] = useState<string>();
    const [counter, setCounter] = useState(OTP_RESEND_TIME);

    const timerRef = useRef<number | null>(null);

    /** CTA enable logic */
    useEffect(() => {
        if (!otpSent) {
            setActiveCta(isValidMobile(mobile));
        } else {
            setActiveCta(otp.length === 4);
        }
    }, [mobile, otp, otpSent]);

    /** Clear error on input change */
    useEffect(() => {
        setError(undefined);
    }, [mobile, otp]);

    /** OTP countdown */
    useEffect(() => {
        if (!otpSent) return;
        timerRef.current = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    if (timerRef.current !== null) {
                        clearInterval(timerRef.current);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
            }
        };
    }, [otpSent]);

    const sendOtp = async () => {
        const authService = new UserAuthService();
        await authService.postOtpSendRepo({
            mobile_number: mobile,
            isd_code: isdCode,
        });
        setOtpSent(true);
        setCounter(OTP_RESEND_TIME);
    };

    const loginUser = async () => {
        const authService = new UserAuthService();
        const res = await authService.postUserLoginRepo({
            mobile_number: mobile,
            isd_code: isdCode,
            otp,
            login_provider: "mobile-otp",
        });

        await Promise.all([
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
        ]);
        eventEmitter.emit("user-login");
    };

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);
        setError(undefined);
        try {
            if (!otpSent) {
                await sendOtp();
            } else {
                await loginUser();
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (counter > 0 || loading) return;
        setLoading(true);
        setError(undefined);
        try {
            await sendOtp();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseView>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        paddingTop: inset.top + scaleY(8),
                        backgroundColor: theme.colors.background,
                    },
                ]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={theme.colors.surfaceText} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <Text style={[styles.title, { color: theme.colors.surfaceText }]}>
                    Verify your mobile number
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        { color: theme.colors.surfaceText },
                    ]}
                >
                    Enter your mobile number and the OTP sent to it
                </Text>

                <MobileInput
                    theme={theme}
                    value={mobile}
                    onChangeText={setMobile}
                    isdCode={isdCode}
                    editable={!otpSent}
                    errorMessage={error}
                    onPressIsd={() => {
                        // open country picker
                    }}
                />

                {otpSent && (
                    <>
                        <OtpInput
                            theme={theme}
                            value={otp}
                            onChangeText={setOtp}
                            length={4}
                        />

                        <TouchableOpacity
                            onPress={handleResendOtp}
                            disabled={counter > 0}
                        >
                            <Text
                                style={[
                                    styles.resendText,
                                    {
                                        color:
                                            counter > 0
                                                ? theme.colors.grayField
                                                : theme.colors.primary,
                                    },
                                ]}
                            >
                                {counter > 0
                                    ? `Resend OTP in ${counter}s`
                                    : "Resend OTP"}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                <ActionButton
                    disabled={!activeCta || loading}
                    theme={theme}
                    onPress={handleSubmit}
                    title={otpSent ? "Login" : "Send OTP"}
                />
            </View>
        </BaseView>
    );
};

export default LoginMobileOtpScreen;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: scaleX(16),
    },
    container: {
        flex: 1,
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(24),
        rowGap: scaleY(16),
    },
    title: {
        fontSize: scaleY(22),
        fontFamily: FONTS.InterBold,
    },
    subtitle: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterRegular,
        marginBottom: scaleY(8),
    },
    resendText: {
        fontSize: scaleY(14),
        fontFamily: FONTS.InterMedium,
        textAlign: "right",
    },
});
