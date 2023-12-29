import { PDFThumbnailView } from "./pdf_thumbnail_view";
import { EventBus } from "pdfjs-dist/web/pdf_viewer";
import { PDFDocumentProxy } from "pdfjs-dist";
import { StoreApi } from "zustand/vanilla";
import type { PDFSlickState } from "../types";
/**
 * @typedef {Object} PDFThumbnailViewerOptions
 * @property {HTMLDivElement} container - The container for the thumbnail
 *   elements.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {PDFRenderingQueue} renderingQueue - The rendering queue object.
 * @property {IL10n} l10n - Localization service.
 * @property {Object} [pageColors] - Overwrites background and foreground colors
 *   with user defined ones in order to improve readability in high contrast
 *   mode.
 */
/**
 * Viewer control to display thumbnails for pages in a PDF document.
 */
declare class PDFThumbnailViewer {
    #private;
    container: HTMLElement;
    eventBus: EventBus;
    linkService: any;
    renderingQueue: any;
    l10n: any;
    pageColors: {
        background: any;
        foreground: any;
    } | null;
    scroll: any;
    _thumbnails: PDFThumbnailView[];
    _currentPageNumber: number;
    _pagesRotation?: number | null;
    _pageLabels: string[];
    pdfDocument: PDFDocumentProxy | null;
    store: StoreApi<PDFSlickState>;
    thumbnailWidth: number;
    /**
     * @param {PDFThumbnailViewerOptions} options
     */
    constructor({ container, eventBus, linkService, renderingQueue, l10n, pageColors, store, thumbnailWidth, }: {
        container: HTMLDivElement;
        eventBus: EventBus;
        linkService: any;
        renderingQueue: any;
        l10n: any;
        pageColors: {
            background: any;
            foreground: any;
        } | null;
        store: StoreApi<PDFSlickState>;
        thumbnailWidth: number;
    });
    /**
     * @private
     */
    _scrollUpdated(): void;
    getThumbnail(index: number): PDFThumbnailView;
    /**
     * @private
     */
    _getVisibleThumbs(): {
        first: {
            id: any;
            x: number;
            y: number;
            view: {
                div: HTMLElement;
                id: any;
            };
            percent: number;
            widthPercent: number;
        };
        last: {
            id: any;
            x: number;
            y: number;
            view: {
                div: HTMLElement;
                id: any;
            };
            percent: number;
            widthPercent: number;
        } | undefined;
        views: {
            id: any;
            x: number;
            y: number;
            view: {
                div: HTMLElement;
                id: any;
            };
            percent: number;
            widthPercent: number;
        }[];
        ids: Set<unknown>;
    };
    scrollThumbnailIntoView(pageNumber: number): void;
    get pagesRotation(): number | null | undefined;
    set pagesRotation(rotation: number | null | undefined);
    cleanup(): void;
    /**
     * @private
     */
    _resetView(): void;
    /**
     * @param {PDFDocumentProxy} pdfDocument
     */
    setDocument(pdfDocument: PDFDocumentProxy): void;
    /**
     * @private
     */
    _cancelRendering(): void;
    /**
     * @param {Array|null} labels
     */
    setPageLabels(labels: string[]): void;
    forceRendering(): boolean;
}
export { PDFThumbnailViewer };
//# sourceMappingURL=pdf_thumbnail_viewer.d.ts.map