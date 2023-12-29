import { ReactNode } from "react";
import type { TUsePDFSlickStore } from "./";
export type PDFSlickThumbProps = {
    pageNumber: number;
    width: number;
    height: number;
    scale: number;
    rotation: number;
    loaded: boolean;
    pageLabel: string | null;
    src: string | null;
};
export type PDFSlickThumbnailsContainerProps = {
    children: ({ pageNumber, src, width, height, scale, rotation, pageLabel, loaded, }: PDFSlickThumbProps) => ReactNode;
    thumbsRef: (instance: HTMLElement | null) => void;
    usePDFSlickStore: TUsePDFSlickStore;
    className?: string;
};
export declare function PDFSlickThumbnails({ children: renderChild, thumbsRef, usePDFSlickStore, className, }: PDFSlickThumbnailsContainerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PDFSlickThumbnails.d.ts.map