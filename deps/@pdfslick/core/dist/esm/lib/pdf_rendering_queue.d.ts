import { PDFThumbnailView } from "./pdf_thumbnail_view";
import { IRenderableView } from "pdfjs-dist/types/web/interfaces.js";
import { PDFThumbnailViewer } from "./pdf_thumbnail_viewer";
import { PDFViewer, PDFPageView } from "pdfjs-dist/web/pdf_viewer";
/**
 * Controls rendering of the views for pages and thumbnails.
 */
declare class PDFRenderingQueue {
    pdfViewer: PDFViewer | null;
    pdfThumbnailViewer: PDFThumbnailViewer | null;
    onIdle: (() => void) | null;
    highestPriorityPage: string | null;
    idleTimeout: ReturnType<typeof setTimeout> | null;
    printing: boolean;
    isThumbnailViewEnabled: boolean;
    constructor();
    /**
     * @param {PDFViewer} pdfViewer
     */
    setViewer(pdfViewer: PDFViewer): void;
    /**
     * @param {PDFThumbnailViewer} pdfThumbnailViewer
     */
    setThumbnailViewer(pdfThumbnailViewer: PDFThumbnailViewer): void;
    /**
     * @param {IRenderableView} view
     * @returns {boolean}
     */
    isHighestPriority(view: PDFPageView): boolean;
    /**
     * @returns {boolean}
     */
    hasViewer(): boolean;
    /**
     * @param {Object} currentlyVisiblePages
     */
    renderHighestPriority(currentlyVisiblePages?: Object): void;
    /**
     * @param {Object} visible
     * @param {Array} views
     * @param {boolean} scrolledDown
     * @param {boolean} [preRenderExtra]
     */
    getHighestPriority(visible: {
        first: any;
        last: any;
        views: any;
        ids: any;
    }, views: PDFThumbnailView[], scrolledDown: boolean, preRenderExtra?: boolean): any;
    /**
     * @param {IRenderableView} view
     * @returns {boolean}
     */
    isViewFinished(view: IRenderableView): boolean;
    /**
     * Render a page or thumbnail view. This calls the appropriate function
     * based on the views state. If the view is already rendered it will return
     * `false`.
     *
     * @param {IRenderableView} view
     */
    renderView(view: IRenderableView): boolean;
}
export { PDFRenderingQueue };
//# sourceMappingURL=pdf_rendering_queue.d.ts.map