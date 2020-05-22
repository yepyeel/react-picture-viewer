/// <reference types="react" />
interface ISize {
    width?: number;
    height?: number;
}
export declare function useSizeAndCanDrag(): {
    size: ISize | undefined;
    isCanDrag: boolean;
    ref: import("react").RefObject<HTMLImageElement>;
};
export {};
