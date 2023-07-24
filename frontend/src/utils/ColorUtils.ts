import StringUtils from "./StringUtils";

export default class ColorUtils {

    public static fromHashCode(input: number) {
        let color = "#";
        for (let index = 0; index < 3; index++) {
            color += "0".concat(((input >> (index << 2)) & 0xFF).toString(16)).slice(-2);
        }
        return color;
    }

    public static fromString(input: string) {
        return ColorUtils.fromHashCode(StringUtils.hashCode(input))
    }

}