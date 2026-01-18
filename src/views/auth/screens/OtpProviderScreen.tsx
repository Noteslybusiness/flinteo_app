import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BaseView } from "../../common/base/BaseView";
import { DefaultScreenProps } from "../../common/props/DefaultScreenProps";
import { ArrowLeft, Mail, Smartphone, Chrome, ChromeIcon } from "lucide-react-native";
import { scaleX, scaleY } from "../../../utils/baseDim";
import { ThemeContext } from "../../../assets/theme/themeContext";
import { FONTS } from "../../../assets/theme/appFonts";
import { AppScreens, NAV_ACTIONS, navScreen } from "../../../navigation/navUtils";
import { useAdaptiveInsets } from "../../../hooks/useAdaptiveInsets";

const OtpProviderScreen: React.FC<DefaultScreenProps> = ({ navigation }) => {
    const inset = useAdaptiveInsets();
    const theme = useContext(ThemeContext);

    return (
        <BaseView>
            <View
                style={[
                    styles.header,
                    { paddingTop: inset.top + scaleY(8), backgroundColor: theme.colors.background},
                ]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft
                        size={24}
                        color={theme.colors.surfaceText}
                    />
                </TouchableOpacity>
            </View>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text
                    style={[
                        styles.title,
                        { color: theme.colors.surfaceText },
                    ]}
                >
                    Choose an option to continue
                </Text>
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        { borderColor: theme.colors.border },
                    ]}
                    onPress={() =>
                        navScreen(
                            navigation,
                            AppScreens.LOGIN_EMAIL_OTP_SCREEN,
                            NAV_ACTIONS.NAVIGATE
                        )
                    }
                >
                    <Mail size={22} color={theme.colors.primary} />
                    <Text
                        style={[
                            styles.optionText,
                            { color: theme.colors.surfaceText },
                        ]}
                    >
                        Continue with Email OTP
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        { borderColor: theme.colors.border },
                    ]}
                    onPress={() =>
                        navScreen(
                            navigation,
                            AppScreens.LOGIN_MOBILE_OTP_SCREEN,
                            NAV_ACTIONS.NAVIGATE
                        )
                    }
                >
                    <Smartphone size={22} color="#16A34A" />
                    <Text
                        style={[
                            styles.optionText,
                            { color: theme.colors.surfaceText },
                        ]}
                    >
                        Continue with Mobile OTP
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        { borderColor: theme.colors.border },
                    ]}
                    onPress={() => {
                        // TODO: Google login handler
                    }}
                >
                    <Chrome size={22} color={theme.colors.error} />
                    <Text
                        style={[
                            styles.optionText,
                            { color: theme.colors.surfaceText },
                        ]}
                    >
                        Continue with Google
                    </Text>
                </TouchableOpacity>
            </View>
        </BaseView>
    );
};

export default OtpProviderScreen;

const styles = StyleSheet.create({
    header: {
        paddingVertical: scaleY(12),
        paddingHorizontal: scaleX(16),
    },
    container: {
        flex: 1,
        paddingHorizontal: scaleX(16),
        paddingTop: scaleY(16),
        rowGap: scaleY(16),
    },
    title: {
        fontSize: scaleY(26),
        fontFamily: FONTS.InterBold,
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center",
        borderWidth: 1,
        borderRadius: scaleY(12),
        paddingVertical: scaleY(14),
        paddingHorizontal: scaleX(16),
    },
    optionText: {
        fontSize: scaleY(16),
        marginLeft: scaleX(12),
        fontFamily: FONTS.InterMedium,
    },
});
