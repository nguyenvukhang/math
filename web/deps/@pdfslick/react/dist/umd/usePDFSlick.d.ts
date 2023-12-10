/// <reference types="node" />
import { RefCallback } from "react";
import { StoreApi } from "zustand";
import type { PDFSlickState, PDFSlickOptions } from "@pdfslick/core";
import PDFSlickViewer from "./PDFSlickViewer";
import { PDFSlickThumbnails } from "./PDFSlickThumbnails";
export type TUsePDFSlickStore = {
    (): PDFSlickState;
    <T>(selector: (state: PDFSlickState) => T, equals?: ((a: T, b: T) => boolean) | undefined): T;
};
type TUsePDFSlick = (url: string | URL | undefined, options?: PDFSlickOptions) => {
    isDocumentLoaded: boolean;
    viewerRef: RefCallback<HTMLElement>;
    thumbsRef: RefCallback<HTMLElement>;
    store: StoreApi<PDFSlickState>;
    usePDFSlickStore: TUsePDFSlickStore;
    PDFSlickViewer: typeof PDFSlickViewer;
    PDFSlickThumbnails: typeof PDFSlickThumbnails;
};
export declare function createStore(store: StoreApi<PDFSlickState>): {
    (): PDFSlickState;
    <T>(selector: (state: PDFSlickState) => T, equals?: ((a: T, b: T) => boolean) | undefined): T;
};
/**
 *
 * @param url PDF Document path
 * @param options PDFSlick Options
 * @returns
 */
export declare const usePDFSlick: TUsePDFSlick;
export {};
//# sourceMappingURL=usePDFSlick.d.ts.map