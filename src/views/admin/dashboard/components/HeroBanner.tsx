import React from "react";
import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { Matrix, scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import { Edit3, Camera, User, User2 } from "lucide-react-native";

interface HeroProps {
    containerStyle?: ViewStyle;
    theme: AppTheme;
    organization: any;
    onEditPress?: () => void;
}

const HeroBanner: React.FC<HeroProps> = ({
    containerStyle,
    theme,
    organization,
    onEditPress
}) => {
    const colors = theme.colors;

    return (
        <View style={[styles.wrapper, containerStyle, { backgroundColor: colors.background }]}>
            <View style={styles.bannerContainer}>
                <Image
                    resizeMode="cover"
                    style={styles.companyImage}
                    source={organization?.org_info?.banner_image ? { uri: organization?.org_info?.banner_image } : require("../../../../assets/images/banner_image.png")}
                />
                <TouchableOpacity
                    style={[styles.bannerEditBtn, { backgroundColor: colors.surface }]}
                    activeOpacity={0.7}
                    onPress={onEditPress}
                >
                    <Edit3 size={18} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.profileImageContainer}>
                    {
                        organization?.user_info?.profile_image ?
                            <Image
                                style={[
                                    styles.profileImage,
                                    {
                                        borderWidth: 3,
                                        borderColor: colors.surface,
                                    },
                                ]}
                                source={{ uri: organization?.user_info?.profile_image }}
                                resizeMode="cover"
                            /> :
                        <View style={[styles.profileImage, { backgroundColor: colors.primaryContainer }]}>
                            <User2 width={100} height={100} color={colors.primary}/>
                        </View>
                    }
                    {/* Camera Icon on Profile */}
                    <TouchableOpacity
                        style={[
                            styles.profileCameraBtn,
                            { backgroundColor: colors.surface },
                        ]}
                        activeOpacity={0.7}
                        onPress={onEditPress}
                    >
                        <Camera size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Text Info */}
                <View style={styles.textContainer}>
                    <Text style={[styles.nameText, { color: colors.onSurface }]}>
                        {organization?.user_info?.first_name}{" "}
                        {organization?.user_info?.last_name || ""}
                    </Text>
                    <Text style={[styles.roleText, { color: colors.primary }]}>{organization?.user_info?.role_name || ""}</Text>
                </View>
            </View>
        </View>
    );
};

export default HeroBanner;

const styles = StyleSheet.create({
    wrapper: {
        width: Matrix.DIM_100,
    },

    /* Banner */
    bannerContainer: {
        position: "relative",
    },
    companyImage: {
        width: Matrix.DIM_100,
        height: scaleY(100),
    },
    bannerEditBtn: {
        position: "absolute",
        top: scaleY(8),
        right: scaleX(12),
        padding: scaleX(8),
        borderRadius: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    /* Info Section */
    infoContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        columnGap: scaleX(12),
        paddingHorizontal: scaleX(12),
        paddingBottom: scaleY(12),
        height: scaleY(80),
    },

    /* Profile */
    profileImageContainer: {
        transform: [{ translateY: -scaleX(50) }],
        position: "relative",
    },
    profileImage: {
        width: scaleX(100),
        height: scaleX(100),
        borderRadius: scaleX(50),
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    profileCameraBtn: {
        position: "absolute",
        bottom: scaleX(6),
        right: scaleX(6),
        padding: scaleX(8),
        borderRadius: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    /* Text */
    textContainer: {
        marginTop: scaleY(10),
    },
    nameText: {
        fontSize: scaleX(18),
        fontFamily: FONTS.InterSemiBold,
    },
    roleText: {
        fontSize: scaleX(16),
        fontFamily: FONTS.InterSemiBold,
        marginTop: scaleY(4)
    }
});
