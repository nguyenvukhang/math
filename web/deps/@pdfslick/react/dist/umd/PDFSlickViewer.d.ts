/// <reference types="react" />
import type { TUsePDFSlickStore } from "@pdfslick/react";
export type PDFSlickViewerProps = {
    viewerRef: (instance: HTMLElement) => void;
    usePDFSlickStore: TUsePDFSlickStore;
    className?: string;
};
export default function PDFSlickViewer({ usePDFSlickStore, viewerRef, className, }: PDFSlickViewerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PDFSlickViewer.d.ts.map