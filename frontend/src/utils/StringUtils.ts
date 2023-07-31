export default class StringUtils {

  public static hashCode(input: string): number {
    let accumulator = 0;
    for (let index = 0; index < input.length; index++) {
      accumulator = ((accumulator << 5) - accumulator) ^ input.charCodeAt(index);
    }
    return accumulator;
  }

  public static initialism(input: string, maxlength?: number): string {
    return input.trim().split(/\s+/, maxlength).map(word => word.charAt(0)).join("");
  }

}