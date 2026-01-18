import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";
import { scaleX, scaleY } from "../../../../utils/baseDim";
import { FONTS } from "../../../../assets/theme/appFonts";
import {
    Circle,
    CheckCircle2,
    Square,
    CheckSquare,
} from "lucide-react-native";

interface Props {
    visible: boolean;
    theme: any;
    data: any;
    activeKey: string | null;
    // onApply: (data: any) => void;
    onApply: (payload: any, mergedConfig: any) => void;

    onClose: () => void;
}

const FilterModal: React.FC<Props> = ({
    visible,
    theme,
    data,
    activeKey,
    onApply,
    onClose,
}) => {
    const [draft, setDraft] = useState<any>(null);

    useEffect(() => {
        if (visible && data && activeKey) {
            setDraft({
                ...data[activeKey],
                options: data[activeKey]?.options?.map((o: any) => ({ ...o })),
            });
        }
    }, [visible, activeKey, data]);

    if (!visible || !draft) return null;

    const isMulti = draft.type === "multi";

    const buildPayload = (merged: any) => {
        const payload: any = {};
        Object.keys(merged).forEach((key) => {
            const group = merged[key];
            if (group.type === "single") {
                const selected = group.options.find((o: any) => o.selected);
                if (selected) payload[key] = selected.id;
            } else {
                const ids = group.options
                    .filter((o: any) => o.selected)
                    .map((o: any) => o.id);
                if (ids.length) payload[key] =  ids.join(",");
            }
        });
        return payload;
    };

    // const emitSingle = (id: number) => {
    //     const merged = {
    //         ...data,
    //         [activeKey!]: {
    //             ...draft,
    //             options: draft.options.map((o: any) => ({
    //                 ...o,
    //                 selected: o.id === id,
    //             })),
    //         },
    //     };
    //     onApply(buildPayload(merged));
    //     onClose();
    // };

    const emitSingle = (id: number) => {
    const merged = {
        ...data,
        [activeKey!]: {
            ...draft,
            options: draft.options.map((o: any) => ({
                ...o,
                selected: o.id === id,
            })),
        },
    };

    onApply(buildPayload(merged), merged);
    onClose();
};



    
    const toggleMulti = (id: number) => {
        setDraft((prev: any) => ({
            ...prev,
            options: prev.options.map((o: any) =>
                o.id === id ? { ...o, selected: !o.selected } : o
            ),
        }));
    };

    // const handleApply = () => {
    //     const merged = {
    //         ...data,
    //         [activeKey!]: draft,
    //     };
    //     onApply(buildPayload(merged));
    //     onClose();
    // };

const handleApply = () => {
    const merged = {
        ...data,
        [activeKey!]: draft,
    };

    onApply(buildPayload(merged), merged);
    onClose();
};



    // const handleClear = () => {
    //     const merged = {
    //         ...data,
    //         [activeKey!]: {
    //             ...draft,
    //             options: draft.options.map((o: any) => ({
    //                 ...o,
    //                 selected: false,
    //             })),
    //         },
    //     };
    //     onApply(buildPayload(merged));
    //     onClose();
    // };

const handleClear = () => {
    const cleared = {
        ...data,
        [activeKey!]: {
            ...draft,
            options: draft.options.map((o: any) => ({
                ...o,
                selected: false,
            })),
        },
    };

    onApply(buildPayload(cleared), cleared);
    onClose();
};


    const renderIcon = (selected: boolean) => {
        if (isMulti) {
            return selected ? (
                <CheckSquare size={20} color={theme.colors.primary} />
            ) : (
                <Square size={20} color={theme.colors.surfaceText} />
            );
        }

        return selected ? (
            <CheckCircle2 size={20} color={theme.colors.primary} />
         
        ) : (
            <Circle size={20} color={theme.colors.surfaceText} />
        );
    };

    return (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
    >
        {/* Backdrop */}
        <TouchableOpacity
            activeOpacity={1}
            style={styles.overlay}
            onPress={onClose}
        >
            {/* Content blocker */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {}}
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.surfaceText },
                        ]}
                    >
                        {draft.title}
                    </Text>
                    <TouchableOpacity onPress={handleClear}>
                        <Text
                            style={[
                                styles.clearText,
                                { color: theme.colors.primary },
                            ]}
                        >
                            Clear
                        </Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={draft.options}
                    keyExtractor={(i: any) => i.id.toString()}
                    contentContainerStyle={styles.list}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.option}
                            activeOpacity={0.7}
                            onPress={() =>
                                isMulti
                                    ? toggleMulti(item.id)
                                    : emitSingle(item.id)
                            }
                        >
                            {renderIcon(item.selected)}
                            <Text
                                style={[
                                    styles.optionText,
                                    { color: theme.colors.surfaceText },
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {isMulti && (
                    <TouchableOpacity
                        style={[
                            styles.apply,
                            { backgroundColor: theme.colors.primary },
                        ]}
                        onPress={handleApply}
                    >
                        <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    </Modal>
);
};

export default FilterModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    container: {
        maxHeight: "80%",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: scaleX(16),
    },
    title: {
        fontFamily: FONTS.InterSemiBold,
        fontSize: scaleY(16),
    },
    clearText: {
        fontFamily: FONTS.InterMedium,
        fontSize: scaleY(13),
    },
    list: {
        paddingHorizontal: scaleX(16),
        paddingBottom: scaleY(12),
        gap: scaleY(12),
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        gap: scaleX(12),
        paddingVertical: scaleY(8),
    },
    optionText: {
        fontFamily: FONTS.InterMedium,
        fontSize: scaleY(13),
    },
    apply: {
        margin: scaleX(16),
        padding: scaleY(12),
        borderRadius: 8,
        alignItems: "center",
    },
    applyText: {
        color: "#fff",
        fontFamily: FONTS.InterSemiBold,
    },
});
