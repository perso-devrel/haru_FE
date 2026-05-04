import { ReactNode } from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

type Preset = "daytimeCity";

interface PhotoBackgroundProps {
    children?: ReactNode;
    /** Built-in source presets; falls back to `source` when provided. */
    preset?: Preset;
    source?: ImageSourcePropType;
    /** Pixel radius for Image.blurRadius. Defaults to a light blur (2). */
    blurRadius?: number;
    style?: ViewStyle;
    /**
     * Kept for call-site compatibility — no longer used. Overlay was removed
     * so the photo renders untinted; consumers may still pass `variant` but
     * it is ignored.
     */
    variant?: "hero" | "app";
    overlayColors?: readonly [string, string, ...string[]];
}

const PRESETS: Record<Preset, ImageSourcePropType> = {
    daytimeCity: require("../../../assets/images/daytime-city.png"),
};

export function PhotoBackground({
    children,
    preset = "daytimeCity",
    source,
    blurRadius,
    style,
}: PhotoBackgroundProps) {
    const resolvedSource = source ?? PRESETS[preset];
    const resolvedBlur = blurRadius ?? 4;

    return (
        <View style={[styles.container, style]}>
            <Image
                source={resolvedSource}
                blurRadius={resolvedBlur}
                resizeMode="cover"
                style={styles.photo}
            />
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    photo: {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
    },
    content: {
        flex: 1,
    },
});
