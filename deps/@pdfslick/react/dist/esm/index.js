import { useState, useMemo, useCallback, useEffect } from 'react';
import { useStore } from 'zustand';
import { create, PDFSlick } from '@pdfslick/core';
export * from '@pdfslick/core';
import { jsx } from 'react/jsx-runtime';
import { useMeasure, useDebounce } from 'react-use';
import { createPortal } from 'react-dom';

function PDFSlickViewer({ usePDFSlickStore, viewerRef, className, }) {
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const scaleValue = usePDFSlickStore((s) => s.scaleValue);
    const [resizeRef, { width }] = useMeasure();
    useDebounce(() => {
        if (width) {
            if (pdfSlick &&
                (scaleValue === "auto" ||
                    scaleValue === "page-fit" ||
                    scaleValue === "page-width")) {
                pdfSlick.viewer.currentScaleValue = scaleValue;
            }
            pdfSlick === null || pdfSlick === void 0 ? void 0 : pdfSlick.viewer.update();
        }
    }, 0, [width]);
    return (jsx("div", Object.assign({ ref: (el) => {
            viewerRef(el);
            resizeRef(el);
        }, id: "viewerContainer", className: `pdfSlickContainer ${className !== null && className !== void 0 ? className : ""}`, style: {
            position: "absolute",
            inset: 0,
        } }, { children: jsx("div", { id: "viewer", className: "pdfSlickViewer pdfViewer" }) })));
}

function PDFSlickThumbnails({ children: renderChild, thumbsRef, usePDFSlickStore, className, }) {
    const thumbnailViews = usePDFSlickStore((s) => s.thumbnailViews);
    const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);
    const [resizeRef, { width }] = useMeasure();
    useDebounce(() => {
        if (width) {
            pdfSlick === null || pdfSlick === void 0 ? void 0 : pdfSlick.forceRendering();
        }
    }, 0, [width]);
    return (jsx("div", Object.assign({ ref: (el) => {
            thumbsRef(el);
            resizeRef(el);
        } }, { className }, { style: {
            position: "absolute",
            overflow: "auto",
            inset: 0,
        } }, { children: Array.from(thumbnailViews).map(([pageNumber, view]) => {
            var _a;
            return createPortal(renderChild({
                pageNumber,
                width: view.canvasWidth,
                height: view.canvasHeight,
                scale: view.scale,
                src: (_a = view === null || view === void 0 ? void 0 : view.src) !== null && _a !== void 0 ? _a : null,
                rotation: view.rotation,
                pageLabel: view.pageLabel,
                loaded: view.loaded,
            }), view.div);
        }) })));
}

function createStore(store) {
    function usePDFSlickStore(selector, equals) {
        return useStore(store, selector, equals);
    }
    return usePDFSlickStore;
}
/**
 *
 * @param url PDF Document path
 * @param options PDFSlick Options
 * @returns
 */
const usePDFSlick = (url, options) => {
    const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
    const [container, setContainer] = useState(null);
    const [thumbs, setThumbs] = useState(null);
    const store = useMemo(() => create(), []);
    const usePDFSlickStore = useMemo(() => createStore(store), []);
    const viewerRef = useCallback((node) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);
    const thumbsRef = useCallback((node) => {
        if (node !== null) {
            setThumbs(node);
        }
    }, []);
    useEffect(() => {
        if (url && container) {
            const pdfSlick = new PDFSlick({
                container,
                thumbs: thumbs,
                store,
                options,
            });
            pdfSlick.loadDocument(url, options).then(() => setIsDocumentLoaded(true));
            store.setState({ pdfSlick });
        }
        return () => { };
    }, [url, container]);
    return {
        isDocumentLoaded,
        viewerRef,
        thumbsRef,
        usePDFSlickStore,
        store,
        PDFSlickViewer,
        PDFSlickThumbnails,
    };
};

export { PDFSlickThumbnails, createStore, usePDFSlick };
