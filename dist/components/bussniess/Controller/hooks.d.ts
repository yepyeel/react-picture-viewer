export declare function useKeyboardClose(usingStatus: boolean, onClose: () => void): void;
export declare function useIntoViewerShown(): boolean;
export declare function useScale(): {
    zoomin: () => void;
    zoomout: () => void;
    zoomreset: () => void;
};
export declare function useToggle(): {
    goNext: () => void;
    goLast: () => void;
    isCanGoNext: boolean;
    isCanGoLast: boolean;
};
export declare function useRotate(): {
    rotate: () => void;
};
