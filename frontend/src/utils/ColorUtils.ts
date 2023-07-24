import StringUtils from "./StringUtils";

export default class ColorUtils {

    public static toNumber(input: string) {
        return parseInt(input.substring(1), 16);
    }

    public static fromNumber(input: number) {
        return "#".concat("00000".concat(input.toString(16)).slice(-6));
    }

    public static fromHashCode(input: number): string {
        let accumulator = 0;
        for (let index = 0; index < 3; index++) {
            accumulator = (accumulator << 8) | ((input >> (index << 2)) & 0xFF);
        }
        return ColorUtils.fromNumber(accumulator);
    }

    public static fromString(input: string): string {
        return ColorUtils.fromHashCode(StringUtils.hashCode(input))
    }

    public static getBrightness(input: string): number {
        let accumulator = 0;
        const color = ColorUtils.toNumber(input);
        for (let index = 0; index < 3; index++) {
            accumulator += (color >> (index << 3)) & 0xFF;
        }
        return accumulator / 3 / 255;
    }

    public static getContrast(foreground: string, background: string): number {
        return ColorUtils.getBrightness(foreground) / ColorUtils.getBrightness(background);
    }

    public static getForeground(background: string) {
        return ColorUtils.fromNumber((1 - Math.round(ColorUtils.getContrast("#FFFFFF", background))) * 0xFFFFFF);
    }

}