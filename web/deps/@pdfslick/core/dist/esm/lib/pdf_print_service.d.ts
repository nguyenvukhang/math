import { PDFDocumentProxy } from "pdfjs-dist";
import { NullL10n } from "pdfjs-dist/web/pdf_viewer";
declare class PDFPrintService {
    pdfDocument: PDFDocumentProxy;
    pagesOverview: any;
    printContainer: HTMLElement;
    _printResolution: number;
    _optionalContentConfigPromise: any;
    _printAnnotationStoragePromise: any;
    l10n: typeof NullL10n;
    currentPage: number;
    scratchCanvas: HTMLCanvasElement | null;
    pageStyleSheet: HTMLStyleElement | null;
    constructor(pdfDocument: PDFDocumentProxy, pagesOverview: any, printContainer: HTMLElement, printResolution: number, optionalContentConfigPromise: null | undefined, printAnnotationStoragePromise: null | undefined, l10n: typeof NullL10n);
    layout(): void;
    destroy(): void;
    renderPages(): Promise<unknown>;
    useRenderedPage(): Promise<unknown>;
    performPrint(): Promise<void>;
    get active(): boolean;
    throwIfInactive(): void;
}
declare const PDFPrintServiceFactory: {
    instance: {
        supportsPrinting: boolean;
        createPrintService(pdfDocument: PDFDocumentProxy, pagesOverview: any, printContainer: HTMLElement, printResolution: number, optionalContentConfigPromise: any, printAnnotationStoragePromise: any, l10n: any): PDFPrintService;
    };
};
export { PDFPrintService, PDFPrintServiceFactory };
//# sourceMappingURL=pdf_print_service.d.ts.map