import { PDFPageProxy, PageViewport } from "pdfjs-dist";
import { PDFViewer, PDFPageView, EventBus } from "pdfjs-dist/web/pdf_viewer";
import { StoreApi } from "zustand/vanilla";
import type { PDFSlickState } from "../types";
/**
 * @typedef {Object} PDFThumbnailViewOptions
 * @property {HTMLDivElement} container - The viewer element.
 * @property {EventBus} eventBus - The application event bus.
 * @property {number} id - The thumbnail's unique ID (normally its number).
 * @property {PageViewport} defaultViewport - The page viewport.
 * @property {Promise<OptionalContentConfig>} [optionalContentConfigPromise] -
 *   A promise that is resolved with an {@link OptionalContentConfig} instance.
 *   The default value is `null`.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {PDFRenderingQueue} renderingQueue - The rendering queue object.
 * @property {IL10n} l10n - Localization service.
 * @property {Object} [pageColors] - Overwrites background and foreground colors
 *   with user defined ones in order to improve readability in high contrast
 *   mode.
 */
declare class TempImageFactory {
    #private;
    static getCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D];
    static destroyCanvas(): void;
}
/**
 * @implements {IRenderableView}
 */
declare class PDFThumbnailView {
    container: HTMLElement;
    eventBus: EventBus;
    id: number;
    viewport: PageViewport;
    optionalContentConfigPromise: any;
    _optionalContentConfigPromise: any;
    linkService: any;
    renderingQueue: any;
    l10n: any;
    pageColors: Object | null;
    store: StoreApi<PDFSlickState>;
    thumbnailWidth: number;
    loaded: boolean;
    renderingId: string;
    pageLabel: string | null;
    rotation: number;
    pdfPageRotate: number;
    renderTask: any;
    renderingState: number;
    resume: any;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    pdfPage: PDFPageProxy | null;
    src?: string | null;
    canvas?: HTMLCanvasElement | null;
    div: HTMLDivElement;
    /**
     * @param {PDFThumbnailViewOptions} options
     */
    constructor({ container, eventBus, id, defaultViewport, optionalContentConfigPromise, linkService, renderingQueue, l10n, pageColors, store, thumbnailWidth, }: {
        id: any;
        container: HTMLElement;
        eventBus: EventBus;
        defaultViewport: any;
        store: StoreApi<PDFSlickState>;
        thumbnailWidth: number;
    } & Partial<Omit<PDFViewer, "container">>);
    setPdfPage(pdfPage: PDFPageProxy): void;
    reset(): void;
    update({ rotation }: {
        rotation: number | null;
    }): void;
    /**
     * PLEASE NOTE: Most likely you want to use the `this.reset()` method,
     *              rather than calling this one directly.
     */
    cancelRendering(): void;
    /**
     * @private
     */
    _getPageDrawContext(upscaleFactor?: number): {
        ctx: CanvasRenderingContext2D | null;
        canvas: HTMLCanvasElement;
        transform: number[] | null;
    };
    /**
     * @private
     */
    _convertCanvasToImage(canvas: HTMLCanvasElement): void;
    draw(): Promise<void>;
    setImage(pageView: PDFPageView): void;
    /**
     * @private
     */
    _reduceImage(img: HTMLCanvasElement): HTMLCanvasElement;
    get _thumbPageTitle(): any;
    get _thumbPageCanvas(): any;
    /**
     * @param {string|null} label
     */
    setPageLabel(label: string): void;
}
export { PDFThumbnailView, TempImageFactory };
//# sourceMappingURL=pdf_thumbnail_view.d.ts.map