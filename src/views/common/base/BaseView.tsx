import { Platform, SafeAreaView, StatusBar, StatusBarStyle, View } from "react-native"
import { THEME_COLORS, ThemeContext } from "../../../assets/theme/themeContext"
import { useContext, useEffect, useState } from "react"

interface ViewProp {
    statusBar?: boolean,
    backgroundColor?: string,
    children: any
}

export const BaseView:React.FC<ViewProp> = ({
    statusBar = true,
    backgroundColor = THEME_COLORS.background,
    children
}) => {
    const [bar, setBar] = useState<StatusBarStyle>('light-content');
    const theme = useContext(ThemeContext);

    useEffect(() => {
        theme && theme.isDarkMode ? setBar('light-content') : setBar('dark-content')
    },[theme])

    return (
        <View style={{flex:1}}>
            {
                Platform.OS === 'android' ?
                    <View style={{flex:1}}>
                        {
                            statusBar ?
                                <StatusBar translucent={true} barStyle={bar} backgroundColor={'transparent'}/> :
                                <StatusBar translucent={true} barStyle={bar} backgroundColor={'transparent'}/>
                        }
                        {children}
                    </View> :
                <View style={{flex:1}}>
                    {children}
                </View>
            }
        </View>
    )
}