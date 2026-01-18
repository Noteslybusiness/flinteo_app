import { Platform } from "react-native";
import { scaleY } from "../utils/baseDim";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Insets = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

export const useAdaptiveInsets = (): Insets => {
    const insets = useSafeAreaInsets();

    const top = (() => {
        if (Platform.OS === "ios") {
            if (insets.top >= 50) {
                return insets.top + scaleY(6);
            }
            if (insets.top >= 20) {
                return insets.top + scaleY(10);
            }
            return insets.top
        }
        if (insets.top > 24) {
            return insets.top + scaleY(8);
        }
        return insets.top
    })();

    const bottom = (() => {
        if (insets.bottom > 0) {
            return insets.bottom + scaleY(8);
        }
        return scaleY(16);
    })();

    return {
        top,
        bottom,
        left: insets.left,
        right: insets.right,
    };
};
