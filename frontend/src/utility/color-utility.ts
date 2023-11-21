import StringUtility from "utility/string-utility";

export default class ColorUtility {

	// public static toInteger(color: string): number {
	// 	return Number.parseInt(color.substring(1), 16);
	// }

	public static toString(integer: number): string {
		return "#".concat(integer.toString(16).padStart(6, "0"));
	}

	public static brightness(color: number): number {
		let accumulator: number = 0;
		for (let offset: number = 0; offset < 3; offset++) {
			accumulator += (color >> (offset << 3)) & 0xFF;
		}
		return accumulator / (3 * 255);
	}

	public static contrast(foreground: number, background: number): number {
		return ColorUtility.brightness(foreground) / ColorUtility.brightness(background);
	}

	public static foreground(background: number): number {
		return (1 - Math.round(ColorUtility.contrast(0xFFFFFF, background))) * 0xFFFFFF;
	}

	public static textInterpolation(text: string): number {
		let accumulator: number = 0;
		const hashCode: number = StringUtility.hashCode(text);
		for (let index: number = 0; index < 3; index++) {
			accumulator = (accumulator << 8) | ((hashCode >> (index << 2)) & 0xFF);
		}
		return accumulator;
	}

}