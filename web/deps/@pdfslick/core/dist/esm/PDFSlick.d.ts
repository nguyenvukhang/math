import { PDFDocumentProxy } from "pdfjs-dist";
import { EventBus, PDFViewer, PDFLinkService, NullL10n, DownloadManager, PDFFindController, PDFPageView, PDFHistory } from "pdfjs-dist/web/pdf_viewer";
import type { PDFSlickInputArgs, PDFSlickState, TEventBusName, TEventBusOptions, TEventBusListener } from "./types";
import { PDFThumbnailViewer, PDFPresentationMode } from "./lib";
import { StoreApi } from "zustand/vanilla";
export declare class PDFSlick {
    #private;
    printService: any;
    url: string | URL | undefined;
    eventBus: EventBus;
    linkService: PDFLinkService;
    history: PDFHistory;
    downloadManager: DownloadManager | null;
    findController: PDFFindController | null;
    pdfPresentationMode: PDFPresentationMode | null;
    viewer: PDFViewer;
    thumbnailViewer?: PDFThumbnailViewer;
    document: PDFDocumentProxy | null;
    store: StoreApi<PDFSlickState>;
    filename: string;
    l10n: typeof NullL10n;
    singlePageViewer: boolean;
    removePageBorders: boolean;
    enablePrintAutoRotate: boolean;
    useOnlyCssZoom: boolean;
    pageColors: {
        background: any;
        foreground: any;
    } | null;
    textLayerMode: number;
    maxCanvasPixels: number;
    printResolution: number;
    thumbnailWidth: number;
    constructor({ container, viewer, thumbs, store, options, }: PDFSlickInputArgs);
    loadDocument(url: string | URL, options?: {
        filename?: string;
    }): Promise<void>;
    forceRendering(isThumbnailViewEnabled?: boolean): void;
    gotoPage(pageNumber: number): void;
    openOrDownloadData(element: HTMLElement, content: Uint8Array, filename: string): void;
    download(): Promise<void>;
    save(): Promise<void>;
    downloadOrSave(): void;
    get supportsPrinting(): boolean;
    beforePrint(): void;
    afterPrint(): void;
    requestPresentationMode(): void;
    triggerPrinting(): void;
    _cleanup(): void;
    setAnnotationEditorMode(annotationEditorMode: number): void;
    setAnnotationEditorParams(annotationEditorParams: {
        type: number;
        value: any;
    } | {
        type: number;
        value: any;
    }[]): void;
    setSpreadMode(spread: number): void;
    setScrollMode(scroll: number): void;
    setRotation(rotation: number): void;
    getPagesOverview(): {
        width: number;
        height: number;
        rotation: number;
    }[];
    /**
     * Zoom In
     */
    increaseScale(): void;
    /**
     * Zoom out
     */
    decreaseScale(): void;
    /**
     * Set preset value ("auto", "page-width" wtc)
     */
    set currentScaleValue(val: string);
    /**
     * Set viewer's scale to a number value
     */
    set currentScale(val: number);
    getPageView(ix: number): PDFPageView;
    /**
     * Add event listener on the pdfViewer eventBus
     * @param eventName TEventBusName
     * @param listener TEventBusListener
     * @param options TEventBusOptions
     */
    on(eventName: TEventBusName, listener: TEventBusListener, options?: TEventBusOptions): void;
    /**
     * Remove event listener from the pdfViewer eventBus
     * @param eventName TEventBusName
     * @param listener TEventBusListener
     * @param options TEventBusOptions
     */
    off(eventName: TEventBusName, listener: TEventBusListener, options?: TEventBusOptions): void;
    /**
     * Dispatch event on teh eventBus
     * @param eventName TEventBusName
     * @param data Object
     */
    dispatch(eventName: TEventBusName, data: Object): void;
}
//# sourceMappingURL=PDFSlick.d.ts.map