import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Matrix, scaleY } from "../../../../utils/baseDim";
import { AppTheme } from "../../../../assets/theme/themeContext";
import { FONTS } from "../../../../assets/theme/appFonts";


interface ViewProp {
    contaienrStyle?: ViewStyle,
    theme: AppTheme,
    title: string,
    inset: any
}

const HeaderComponent:React.FC<ViewProp> = ({
    contaienrStyle,
    title,
    theme,
    inset
}) => {
    return <View style={[styles.container, {
        paddingTop: inset.top
    }]}>
        <Text style={[styles.title, {
            color: theme.colors.surfaceText
        }]}>{title || "Header Component"}</Text>
    </View>
}

export default HeaderComponent;

const styles = StyleSheet.create({
    container: {
        width: Matrix.DIM_100,
        backgroundColor: "transparent",
        paddingVertical: scaleY(8),
        paddingHorizontal: scaleY(16),
        position: "absolute",
        zIndex: 1000
    },
    title:{
        fontSize: scaleY(22),
        fontFamily: FONTS.InterBold
    }
})