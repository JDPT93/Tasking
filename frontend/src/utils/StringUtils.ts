export default class StringUtils {

    public static hashCode(input: string): number {
        let hash = 0;
        for (let index = 0; index < input.length; index++) {
            hash = ((hash << 5) - hash) ^ input.charCodeAt(index);
        }
        return hash;
    }

    public static initialism(input: string, maxlength?: number) {
        return input.trim().split(/\s+/, maxlength).map(word => word.charAt(0)).join("");
    }

}