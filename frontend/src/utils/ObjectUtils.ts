export default class ObjectUtils {

    public static query<T>(object: T, path: string): any {
        const [key, subpath] = path.split(".", 2);
        return subpath === undefined
            ? object[key as keyof T]
            : ObjectUtils.query(object[key as keyof T], subpath);
    }

}