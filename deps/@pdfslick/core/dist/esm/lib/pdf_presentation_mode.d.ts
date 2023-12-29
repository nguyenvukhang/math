import { EventBus, PDFViewer } from "pdfjs-dist/web/pdf_viewer";
/**
 * @typedef {Object} PDFPresentationModeOptions
 * @property {HTMLDivElement} container - The container for the viewer element.
 * @property {PDFViewer} pdfViewer - The document viewer.
 * @property {EventBus} eventBus - The application event bus.
 */
declare class PDFPresentationMode {
    #private;
    container: HTMLDivElement;
    pdfViewer: PDFViewer;
    eventBus: EventBus;
    contextMenuOpen: boolean;
    mouseScrollTimeStamp: number;
    mouseScrollDelta: number;
    touchSwipeState: null | {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
    };
    controlsTimeout?: ReturnType<typeof setTimeout>;
    showControlsBind?: (e: any) => void;
    mouseDownBind?: (e: any) => void;
    mouseWheelBind?: (e: any) => void;
    resetMouseScrollStateBind?: (e: any) => void;
    contextMenuBind?: (e: any) => void;
    touchSwipeBind?: (e: any) => void;
    fullscreenChangeBind?: (e: any) => void;
    /**
     * @param {PDFPresentationModeOptions} options
     */
    constructor({ container, pdfViewer, eventBus, }: {
        container: HTMLDivElement;
        pdfViewer: PDFViewer;
        eventBus: EventBus;
    });
    /**
     * Request the browser to enter fullscreen mode.
     * @returns {Promise<boolean>} Indicating if the request was successful.
     */
    request(): Promise<boolean>;
    get active(): boolean;
}
export { PDFPresentationMode };
//# sourceMappingURL=pdf_presentation_mode.d.ts.map