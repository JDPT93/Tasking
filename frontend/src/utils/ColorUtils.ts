import StringUtils from "./StringUtils";

export default class ColorUtils {

    static fromHashCode(input: number) {
        let color = "#";
        for (let index = 0; index < 3; index++) {
            color += "0".concat(((input >> (index << 2)) & 0xFF).toString(16)).slice(-2);
        }
        return color;
    }

    static fromString(input: string) {
        return ColorUtils.fromHashCode(StringUtils.hashCode(input))
    }

}