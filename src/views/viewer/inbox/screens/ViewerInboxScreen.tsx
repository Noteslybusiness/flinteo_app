import { StyleSheet, Text, View } from "react-native";
import { BaseView } from "../../../common/base/BaseView";
import { DefaultScreenProps } from "../../../common/props/DefaultScreenProps";
import { useContext } from "react";
import { ThemeContext } from "../../../../assets/theme/themeContext";
import GlobalHeader from "../../../common/components/GlobalHeader";


const ViewerInboxScreen:React.FC<DefaultScreenProps> = ({
    navigation,
    route
}) => {
    const theme = useContext(ThemeContext)

    return <BaseView>
        <View style={[styles.container, {
            backgroundColor: theme.colors.background
        }]}>
            <GlobalHeader theme={theme} title="Notifications"/>
        </View>
    </BaseView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default ViewerInboxScreen