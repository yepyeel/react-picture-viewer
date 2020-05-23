import { MouseEvent } from 'react';
export declare function useWindowSize(): {
    windowWidth: number;
    windowHeight: number;
};
export declare function useImgSize(fn: () => HTMLImageElement | null): {
    imgWidth: number;
    imgHeight: number;
};
export declare function useDragInfo(): {
    isCanDrag: boolean;
    windowWidth: number;
    windowHeight: number;
    imgWidth: number;
    imgHeight: number;
};
export declare function useMove(): {
    onStartMove: (e: MouseEvent<HTMLImageElement>) => void;
    onMoving: (e: MouseEvent<HTMLImageElement>) => void;
    onEndMove: (e: MouseEvent<HTMLImageElement>) => void;
    offsetPos: {
        x: number;
        y: number;
    };
    dragStatus: boolean;
};
