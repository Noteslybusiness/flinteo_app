// import { View, Text, StyleSheet } from "react-native";
// import { scaleY } from "../../../../utils/baseDim";

// const ExploreEmptyState = ({ text, theme }: any) => {
//     return (
//         <View style={styles.container}>
//             <Text
//                 style={[
//                     styles.text,
//                     { color: theme.colors.onSurfaceVariant },
//                 ]}
//             >
//                 {text}
//             </Text>
//         </View>
//     );
// };

// export default ExploreEmptyState;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingVertical: scaleY(80),
//     },
//     text: {
//         fontSize: 16,
//         textAlign: "center",
//         opacity: 0.7,
//     },
// });


import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { scaleY, scaleX } from "../../../../utils/baseDim";

const ExploreEmptyState = ({ text, theme }: any) => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require("../../../../assets/svg/Scan.json")}
                autoPlay
                loop
                style={styles.lottie}
                // optional: match theme
                colorFilters={[
                    {
                        keypath: "**",
                        color: theme.colors.onSurfaceVariant,
                    },
                ]}
            />

            <Text
                style={[
                    styles.text,
                    { color: theme.colors.onSurfaceVariant },
                ]}
            >
                {text}
            </Text>
        </View>
    );
};

export default ExploreEmptyState;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: scaleY(80),
    },
    lottie: {
        width: scaleX(220),
        height: scaleY(220),
        marginBottom: scaleY(12),
        opacity: 0.85,
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.7,
    },
});
