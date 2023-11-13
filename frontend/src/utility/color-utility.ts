import StringUtility from "utility/string-utility";

export default class ColorUtility {

	public static toInteger(color: string): number {
		return Number.parseInt(color.substring(1), 16);
	}

	public static fromInteger(integer: number): string {
		return "#".concat(integer.toString(16).padStart(6, "0"));
	}

	public static textInterpolation(text: string): string {
		let accumulator: number = 0;
		const hashCode: number = StringUtility.hashCode(text);
		for (let index: number = 0; index < 3; index++) {
			accumulator = (accumulator << 8) | ((hashCode >> (index << 2)) & 0xFF);
		}
		return ColorUtility.fromInteger(accumulator);
	}

	public static brightness(color: string): number {
		let accumulator: number = 0;
		const value: number = ColorUtility.toInteger(color);
		for (let offset: number = 0; offset < 3; offset++) {
			accumulator += (value >> (offset << 3)) & 0xFF;
		}
		return accumulator / (3 * 255);
	}

	public static contrast(foreground: string, background: string): number {
		return ColorUtility.brightness(foreground) / ColorUtility.brightness(background);
	}

}