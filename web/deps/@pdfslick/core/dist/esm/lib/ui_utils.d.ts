declare const DEFAULT_SCALE_VALUE = "auto";
declare const DEFAULT_SCALE = 1;
declare const DEFAULT_SCALE_DELTA = 1.1;
declare const MIN_SCALE = 0.1;
declare const MAX_SCALE = 10;
declare const UNKNOWN_SCALE = 0;
declare const MAX_AUTO_SCALE = 1.25;
declare const SCROLLBAR_PADDING = 40;
declare const VERTICAL_PADDING = 5;
declare const RenderingStates: {
    INITIAL: number;
    RUNNING: number;
    PAUSED: number;
    FINISHED: number;
};
declare const PresentationModeState: {
    UNKNOWN: number;
    NORMAL: number;
    CHANGING: number;
    FULLSCREEN: number;
};
declare const SidebarView: {
    UNKNOWN: number;
    NONE: number;
    THUMBS: number;
    OUTLINE: number;
    ATTACHMENTS: number;
    LAYERS: number;
};
declare const RendererType: {
    CANVAS: string;
    SVG: string;
};
declare const TextLayerMode: {
    DISABLE: number;
    ENABLE: number;
};
declare const ScrollMode: {
    UNKNOWN: number;
    VERTICAL: number;
    HORIZONTAL: number;
    WRAPPED: number;
    PAGE: number;
};
declare const SpreadMode: {
    UNKNOWN: number;
    NONE: number;
    ODD: number;
    EVEN: number;
};
declare const CursorTool: {
    SELECT: number;
    HAND: number;
    ZOOM: number;
};
declare const AutoPrintRegExp: RegExp;
/**
 * Scale factors for the canvas, necessary with HiDPI displays.
 */
declare class OutputScale {
    sx: number;
    sy: number;
    constructor();
    /**
     * @type {boolean} Returns `true` when scaling is required, `false` otherwise.
     */
    get scaled(): boolean;
}
/**
 * Scrolls specified element into view of its parent.
 * @param {Object} element - The element to be visible.
 * @param {Object} spot - An object with optional top and left properties,
 *   specifying the offset from the top left edge.
 * @param {boolean} [scrollMatches] - When scrolling search results into view,
 *   ignore elements that either: Contains marked content identifiers,
 *   or have the CSS-rule `overflow: hidden;` set. The default value is `false`.
 */
declare function scrollIntoView(element: HTMLElement, spot: any, scrollMatches?: boolean): void;
/**
 * Helper function to start monitoring the scroll event and converting them into
 * PDF.js friendly one: with scroll debounce and scroll direction.
 */
declare function watchScroll(viewAreaElement: HTMLElement, callback: (state: any) => void): {
    right: boolean;
    down: boolean;
    lastX: number;
    lastY: number;
    _eventHandler: (evt: Event) => void;
};
/**
 * Helper function to parse query string (e.g. ?param1=value&param2=...).
 * @param {string}
 * @returns {Map}
 */
declare function parseQueryString(query: string): Map<any, any>;
/**
 * @param {string} str
 * @param {boolean} [replaceInvisible]
 */
declare function removeNullCharacters(str: string, replaceInvisible?: boolean): string;
/**
 * Use binary search to find the index of the first item in a given array which
 * passes a given condition. The items are expected to be sorted in the sense
 * that if the condition is true for one item in the array, then it is also true
 * for all following items.
 *
 * @returns {number} Index of the first array element to pass the test,
 *                   or |items.length| if no such element exists.
 */
declare function binarySearchFirstItem(items: any[], condition: (item: any) => boolean, start?: number): number;
/**
 *  Approximates float number as a fraction using Farey sequence (max order
 *  of 8).
 *  @param {number} x - Positive float number.
 *  @returns {Array} Estimated fraction: the first array item is a numerator,
 *                   the second one is a denominator.
 */
declare function approximateFraction(x: number): number[];
declare function roundToDivide(x: number, div: number): number;
/**
 * @typedef {Object} GetPageSizeInchesParameters
 * @property {number[]} view
 * @property {number} userUnit
 * @property {number} rotate
 */
/**
 * @typedef {Object} PageSize
 * @property {number} width - In inches.
 * @property {number} height - In inches.
 */
/**
 * Gets the size of the specified page, converted from PDF units to inches.
 * @param {GetPageSizeInchesParameters} params
 * @returns {PageSize}
 */
declare function getPageSizeInches({ view, userUnit, rotate, }: {
    view: number[];
    userUnit: number;
    rotate: number;
}): {
    width: number;
    height: number;
};
/**
 * Helper function for getVisibleElements.
 *
 * @param {number} index - initial guess at the first visible element
 * @param {Array} views - array of pages, into which `index` is an index
 * @param {number} top - the top of the scroll pane
 * @returns {number} less than or equal to `index` that is definitely at or
 *   before the first visible element in `views`, but not by too much. (Usually,
 *   this will be the first element in the first partially visible row in
 *   `views`, although sometimes it goes back one row further.)
 */
declare function backtrackBeforeAllVisibleElements(index: number, views: any[], top: number): number;
/**
 * @typedef {Object} GetVisibleElementsParameters
 * @property {HTMLElement} scrollEl - A container that can possibly scroll.
 * @property {Array} views - Objects with a `div` property that contains an
 *   HTMLElement, which should all be descendants of `scrollEl` satisfying the
 *   relevant layout assumptions.
 * @property {boolean} sortByVisibility - If `true`, the returned elements are
 *   sorted in descending order of the percent of their padding box that is
 *   visible. The default value is `false`.
 * @property {boolean} horizontal - If `true`, the elements are assumed to be
 *   laid out horizontally instead of vertically. The default value is `false`.
 * @property {boolean} rtl - If `true`, the `scrollEl` container is assumed to
 *   be in right-to-left mode. The default value is `false`.
 */
/**
 * Generic helper to find out what elements are visible within a scroll pane.
 *
 * Well, pretty generic. There are some assumptions placed on the elements
 * referenced by `views`:
 *   - If `horizontal`, no left of any earlier element is to the right of the
 *     left of any later element.
 *   - Otherwise, `views` can be split into contiguous rows where, within a row,
 *     no top of any element is below the bottom of any other element, and
 *     between rows, no bottom of any element in an earlier row is below the
 *     top of any element in a later row.
 *
 * (Here, top, left, etc. all refer to the padding edge of the element in
 * question. For pages, that ends up being equivalent to the bounding box of the
 * rendering canvas. Earlier and later refer to index in `views`, not page
 * layout.)
 *
 * @param {GetVisibleElementsParameters}
 * @returns {Object} `{ first, last, views: [{ id, x, y, view, percent }] }`
 */
declare function getVisibleElements({ scrollEl, views, sortByVisibility, horizontal, rtl, }: {
    scrollEl: HTMLElement;
    views: {
        div: HTMLElement;
        id: any;
    }[];
    sortByVisibility?: boolean;
    horizontal?: boolean;
    rtl?: boolean;
}): {
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
/**
 * Event handler to suppress context menu.
 */
declare function noContextMenuHandler(evt: Event): void;
declare function normalizeWheelEventDirection(evt: WheelEvent): number;
declare function normalizeWheelEventDelta(evt: WheelEvent): number;
declare function isValidRotation(angle: number): boolean;
declare function isValidScrollMode(mode: any): boolean;
declare function isValidSpreadMode(mode: any): boolean;
declare function isPortraitOrientation(size: {
    width: number;
    height: number;
}): boolean;
/**
 * Promise that is resolved when DOM window becomes visible.
 */
declare const animationStarted: Promise<unknown>;
declare const docStyle: CSSStyleDeclaration;
declare class ProgressBar {
    #private;
    constructor(bar: HTMLElement);
    get percent(): number;
    set percent(val: number);
    setWidth(viewer: HTMLElement): void;
    setDisableAutoFetch(delay?: number): void;
    hide(): void;
    show(): void;
}
/**
 * Get the active or focused element in current DOM.
 *
 * Recursively search for the truly active or focused element in case there are
 * shadow DOMs.
 *
 * @returns {Element} the truly active or focused element.
 */
declare function getActiveOrFocusedElement(): Element | null;
/**
 * Converts API PageLayout values to the format used by `BaseViewer`.
 * @param {string} mode - The API PageLayout value.
 * @returns {Object}
 */
declare function apiPageLayoutToViewerModes(layout: string): {
    scrollMode: number;
    spreadMode: number;
};
/**
 * Converts API PageMode values to the format used by `PDFSidebar`.
 * NOTE: There's also a "FullScreen" parameter which is not possible to support,
 *       since the Fullscreen API used in browsers requires that entering
 *       fullscreen mode only occurs as a result of a user-initiated event.
 * @param {string} mode - The API PageMode value.
 * @returns {number} A value from {SidebarView}.
 */
declare function apiPageModeToSidebarView(mode: string): number;
export { animationStarted, apiPageLayoutToViewerModes, apiPageModeToSidebarView, approximateFraction, AutoPrintRegExp, backtrackBeforeAllVisibleElements, // only exported for testing
binarySearchFirstItem, CursorTool, DEFAULT_SCALE, DEFAULT_SCALE_DELTA, DEFAULT_SCALE_VALUE, docStyle, getActiveOrFocusedElement, getPageSizeInches, getVisibleElements, isPortraitOrientation, isValidRotation, isValidScrollMode, isValidSpreadMode, MAX_AUTO_SCALE, MAX_SCALE, MIN_SCALE, noContextMenuHandler, normalizeWheelEventDelta, normalizeWheelEventDirection, OutputScale, parseQueryString, PresentationModeState, ProgressBar, removeNullCharacters, RendererType, RenderingStates, roundToDivide, SCROLLBAR_PADDING, scrollIntoView, ScrollMode, SidebarView, SpreadMode, TextLayerMode, UNKNOWN_SCALE, VERTICAL_PADDING, watchScroll, };
//# sourceMappingURL=ui_utils.d.ts.map