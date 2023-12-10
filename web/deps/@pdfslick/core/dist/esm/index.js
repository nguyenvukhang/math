import { RenderingCancelledException, PixelsPerInch, getXfaPageViewport, AnnotationMode, AnnotationEditorType, GlobalWorkerOptions, version, getPdfFilenameFromUrl, getDocument, PDFDateString } from 'pdfjs-dist';
import { SimpleLinkService, XfaLayerBuilder, NullL10n, DownloadManager, EventBus, PDFLinkService, PDFHistory, PDFSinglePageViewer, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { createStore } from 'zustand/vanilla';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _ProgressBar_classList, _ProgressBar_disableAutoFetchTimeout, _ProgressBar_percent, _ProgressBar_style, _ProgressBar_visible;
const DEFAULT_SCALE_VALUE = "auto";
const DEFAULT_SCALE = 1.0;
const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10.0;
const UNKNOWN_SCALE = 0;
const MAX_AUTO_SCALE = 1.25;
const SCROLLBAR_PADDING = 40;
const VERTICAL_PADDING = 5;
const RenderingStates = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    FINISHED: 3,
};
const PresentationModeState = {
    UNKNOWN: 0,
    NORMAL: 1,
    CHANGING: 2,
    FULLSCREEN: 3,
};
const SidebarView = {
    UNKNOWN: -1,
    NONE: 0,
    THUMBS: 1,
    OUTLINE: 2,
    ATTACHMENTS: 3,
    LAYERS: 4,
};
const RendererType = {
    CANVAS: "canvas",
    SVG: "svg",
};
const TextLayerMode = {
    DISABLE: 0,
    ENABLE: 1,
};
const ScrollMode = {
    UNKNOWN: -1,
    VERTICAL: 0,
    HORIZONTAL: 1,
    WRAPPED: 2,
    PAGE: 3,
};
const SpreadMode = {
    UNKNOWN: -1,
    NONE: 0,
    ODD: 1,
    EVEN: 2,
};
const CursorTool = {
    SELECT: 0,
    HAND: 1,
    ZOOM: 2,
};
// Used by `PDFViewerApplication`, and by the API unit-tests.
const AutoPrintRegExp = /\bprint\s*\(/;
/**
 * Scale factors for the canvas, necessary with HiDPI displays.
 */
class OutputScale {
    constructor() {
        const pixelRatio = window.devicePixelRatio || 1;
        /**
         * @type {number} Horizontal scale.
         */
        this.sx = pixelRatio;
        /**
         * @type {number} Vertical scale.
         */
        this.sy = pixelRatio;
    }
    /**
     * @type {boolean} Returns `true` when scaling is required, `false` otherwise.
     */
    get scaled() {
        return this.sx !== 1 || this.sy !== 1;
    }
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
function scrollIntoView(element, spot, scrollMatches = false) {
    // Assuming offsetParent is available (it's not available when viewer is in
    // hidden iframe or object). We have to scroll: if the offsetParent is not set
    // producing the error. See also animationStarted.
    let parent = element.offsetParent;
    if (!parent) {
        console.error("offsetParent is not set -- cannot scroll");
        return;
    }
    let offsetY = element.offsetTop + element.clientTop;
    let offsetX = element.offsetLeft + element.clientLeft;
    while ((parent.clientHeight === parent.scrollHeight &&
        parent.clientWidth === parent.scrollWidth) ||
        (scrollMatches &&
            (parent.classList.contains("markedContent") ||
                getComputedStyle(parent).overflow === "hidden"))) {
        offsetY += parent.offsetTop;
        offsetX += parent.offsetLeft;
        parent = parent.offsetParent;
        if (!parent) {
            return; // no need to scroll
        }
    }
    if (spot) {
        if (spot.top !== undefined) {
            offsetY += spot.top;
        }
        if (spot.left !== undefined) {
            offsetX += spot.left;
            parent.scrollLeft = offsetX;
        }
    }
    parent.scrollTop = offsetY;
    parent.scrollLeft = offsetX;
}
/**
 * Helper function to start monitoring the scroll event and converting them into
 * PDF.js friendly one: with scroll debounce and scroll direction.
 */
function watchScroll(viewAreaElement, callback) {
    const debounceScroll = function (evt) {
        if (rAF) {
            return;
        }
        // schedule an invocation of scroll for next animation frame.
        rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
            rAF = null;
            const currentX = viewAreaElement.scrollLeft;
            const lastX = state.lastX;
            if (currentX !== lastX) {
                state.right = currentX > lastX;
            }
            state.lastX = currentX;
            const currentY = viewAreaElement.scrollTop;
            const lastY = state.lastY;
            if (currentY !== lastY) {
                state.down = currentY > lastY;
            }
            state.lastY = currentY;
            callback(state);
        });
    };
    const state = {
        right: true,
        down: true,
        lastX: viewAreaElement.scrollLeft,
        lastY: viewAreaElement.scrollTop,
        _eventHandler: debounceScroll,
    };
    let rAF = null;
    viewAreaElement.addEventListener("scroll", debounceScroll, true);
    return state;
}
/**
 * Helper function to parse query string (e.g. ?param1=value&param2=...).
 * @param {string}
 * @returns {Map}
 */
function parseQueryString(query) {
    const params = new Map();
    for (const [key, value] of new URLSearchParams(query)) {
        params.set(key.toLowerCase(), value);
    }
    return params;
}
const NullCharactersRegExp = /\x00/g;
const InvisibleCharactersRegExp = /[\x01-\x1F]/g;
/**
 * @param {string} str
 * @param {boolean} [replaceInvisible]
 */
function removeNullCharacters(str, replaceInvisible = false) {
    if (typeof str !== "string") {
        console.error(`The argument must be a string.`);
        return str;
    }
    if (replaceInvisible) {
        str = str.replace(InvisibleCharactersRegExp, " ");
    }
    return str.replace(NullCharactersRegExp, "");
}
/**
 * Use binary search to find the index of the first item in a given array which
 * passes a given condition. The items are expected to be sorted in the sense
 * that if the condition is true for one item in the array, then it is also true
 * for all following items.
 *
 * @returns {number} Index of the first array element to pass the test,
 *                   or |items.length| if no such element exists.
 */
function binarySearchFirstItem(items, condition, start = 0) {
    let minIndex = start;
    let maxIndex = items.length - 1;
    if (maxIndex < 0 || !condition(items[maxIndex])) {
        return items.length;
    }
    if (condition(items[minIndex])) {
        return minIndex;
    }
    while (minIndex < maxIndex) {
        const currentIndex = (minIndex + maxIndex) >> 1;
        const currentItem = items[currentIndex];
        if (condition(currentItem)) {
            maxIndex = currentIndex;
        }
        else {
            minIndex = currentIndex + 1;
        }
    }
    return minIndex; /* === maxIndex */
}
/**
 *  Approximates float number as a fraction using Farey sequence (max order
 *  of 8).
 *  @param {number} x - Positive float number.
 *  @returns {Array} Estimated fraction: the first array item is a numerator,
 *                   the second one is a denominator.
 */
function approximateFraction(x) {
    // Fast paths for int numbers or their inversions.
    if (Math.floor(x) === x) {
        return [x, 1];
    }
    const xinv = 1 / x;
    const limit = 8;
    if (xinv > limit) {
        return [1, limit];
    }
    else if (Math.floor(xinv) === xinv) {
        return [1, xinv];
    }
    const x_ = x > 1 ? xinv : x;
    // a/b and c/d are neighbours in Farey sequence.
    let a = 0, b = 1, c = 1, d = 1;
    // Limiting search to order 8.
    while (true) {
        // Generating next term in sequence (order of q).
        const p = a + c, q = b + d;
        if (q > limit) {
            break;
        }
        if (x_ <= p / q) {
            c = p;
            d = q;
        }
        else {
            a = p;
            b = q;
        }
    }
    let result;
    // Select closest of the neighbours to x.
    if (x_ - a / b < c / d - x_) {
        result = x_ === x ? [a, b] : [b, a];
    }
    else {
        result = x_ === x ? [c, d] : [d, c];
    }
    return result;
}
function roundToDivide(x, div) {
    const r = x % div;
    return r === 0 ? x : Math.round(x - r + div);
}
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
function getPageSizeInches({ view, userUnit, rotate, }) {
    const [x1, y1, x2, y2] = view;
    // We need to take the page rotation into account as well.
    const changeOrientation = rotate % 180 !== 0;
    const width = ((x2 - x1) / 72) * userUnit;
    const height = ((y2 - y1) / 72) * userUnit;
    return {
        width: changeOrientation ? height : width,
        height: changeOrientation ? width : height,
    };
}
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
function backtrackBeforeAllVisibleElements(index, views, top) {
    // binarySearchFirstItem's assumption is that the input is ordered, with only
    // one index where the conditions flips from false to true: [false ...,
    // true...]. With vertical scrolling and spreads, it is possible to have
    // [false ..., true, false, true ...]. With wrapped scrolling we can have a
    // similar sequence, with many more mixed true and false in the middle.
    //
    // So there is no guarantee that the binary search yields the index of the
    // first visible element. It could have been any of the other visible elements
    // that were preceded by a hidden element.
    // Of course, if either this element or the previous (hidden) element is also
    // the first element, there's nothing to worry about.
    if (index < 2) {
        return index;
    }
    // That aside, the possible cases are represented below.
    //
    //     ****  = fully hidden
    //     A*B*  = mix of partially visible and/or hidden pages
    //     CDEF  = fully visible
    //
    // (1) Binary search could have returned A, in which case we can stop.
    // (2) Binary search could also have returned B, in which case we need to
    // check the whole row.
    // (3) Binary search could also have returned C, in which case we need to
    // check the whole previous row.
    //
    // There's one other possibility:
    //
    //     ****  = fully hidden
    //     ABCD  = mix of fully and/or partially visible pages
    //
    // (4) Binary search could only have returned A.
    // Initially assume that we need to find the beginning of the current row
    // (case 1, 2, or 4), which means finding a page that is above the current
    // page's top. If the found page is partially visible, we're definitely not in
    // case 3, and this assumption is correct.
    let elt = views[index].div;
    let pageTop = elt.offsetTop + elt.clientTop;
    if (pageTop >= top) {
        // The found page is fully visible, so we're actually either in case 3 or 4,
        // and unfortunately we can't tell the difference between them without
        // scanning the entire previous row, so we just conservatively assume that
        // we do need to backtrack to that row. In both cases, the previous page is
        // in the previous row, so use its top instead.
        elt = views[index - 1].div;
        pageTop = elt.offsetTop + elt.clientTop;
    }
    // Now we backtrack to the first page that still has its bottom below
    // `pageTop`, which is the top of a page in the first visible row (unless
    // we're in case 4, in which case it's the row before that).
    // `index` is found by binary search, so the page at `index - 1` is
    // invisible and we can start looking for potentially visible pages from
    // `index - 2`. (However, if this loop terminates on its first iteration,
    // which is the case when pages are stacked vertically, `index` should remain
    // unchanged, so we use a distinct loop variable.)
    for (let i = index - 2; i >= 0; --i) {
        elt = views[i].div;
        if (elt.offsetTop + elt.clientTop + elt.clientHeight <= pageTop) {
            // We have reached the previous row, so stop now.
            // This loop is expected to terminate relatively quickly because the
            // number of pages per row is expected to be small.
            break;
        }
        index = i;
    }
    return index;
}
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
function getVisibleElements({ scrollEl, views, sortByVisibility = false, horizontal = false, rtl = false, }) {
    const top = scrollEl.scrollTop, bottom = top + scrollEl.clientHeight;
    const left = scrollEl.scrollLeft, right = left + scrollEl.clientWidth;
    // Throughout this "generic" function, comments will assume we're working with
    // PDF document pages, which is the most important and complex case. In this
    // case, the visible elements we're actually interested is the page canvas,
    // which is contained in a wrapper which adds no padding/border/margin, which
    // is itself contained in `view.div` which adds no padding (but does add a
    // border). So, as specified in this function's doc comment, this function
    // does all of its work on the padding edge of the provided views, starting at
    // offsetLeft/Top (which includes margin) and adding clientLeft/Top (which is
    // the border). Adding clientWidth/Height gets us the bottom-right corner of
    // the padding edge.
    function isElementBottomAfterViewTop(view) {
        const element = view.div;
        const elementBottom = element.offsetTop + element.clientTop + element.clientHeight;
        return elementBottom > top;
    }
    function isElementNextAfterViewHorizontally(view) {
        const element = view.div;
        const elementLeft = element.offsetLeft + element.clientLeft;
        const elementRight = elementLeft + element.clientWidth;
        return rtl ? elementLeft < right : elementRight > left;
    }
    const visible = [], ids = new Set(), numViews = views.length;
    let firstVisibleElementInd = binarySearchFirstItem(views, horizontal
        ? isElementNextAfterViewHorizontally
        : isElementBottomAfterViewTop);
    // Please note the return value of the `binarySearchFirstItem` function when
    // no valid element is found (hence the `firstVisibleElementInd` check below).
    if (firstVisibleElementInd > 0 &&
        firstVisibleElementInd < numViews &&
        !horizontal) {
        // In wrapped scrolling (or vertical scrolling with spreads), with some page
        // sizes, isElementBottomAfterViewTop doesn't satisfy the binary search
        // condition: there can be pages with bottoms above the view top between
        // pages with bottoms below. This function detects and corrects that error;
        // see it for more comments.
        firstVisibleElementInd = backtrackBeforeAllVisibleElements(firstVisibleElementInd, views, top);
    }
    // lastEdge acts as a cutoff for us to stop looping, because we know all
    // subsequent pages will be hidden.
    //
    // When using wrapped scrolling or vertical scrolling with spreads, we can't
    // simply stop the first time we reach a page below the bottom of the view;
    // the tops of subsequent pages on the same row could still be visible. In
    // horizontal scrolling, we don't have that issue, so we can stop as soon as
    // we pass `right`, without needing the code below that handles the -1 case.
    let lastEdge = horizontal ? right : -1;
    for (let i = firstVisibleElementInd; i < numViews; i++) {
        const view = views[i], element = view.div;
        const currentWidth = element.offsetLeft + element.clientLeft;
        const currentHeight = element.offsetTop + element.clientTop;
        const viewWidth = element.clientWidth, viewHeight = element.clientHeight;
        const viewRight = currentWidth + viewWidth;
        const viewBottom = currentHeight + viewHeight;
        if (lastEdge === -1) {
            // As commented above, this is only needed in non-horizontal cases.
            // Setting lastEdge to the bottom of the first page that is partially
            // visible ensures that the next page fully below lastEdge is on the
            // next row, which has to be fully hidden along with all subsequent rows.
            if (viewBottom >= bottom) {
                lastEdge = viewBottom;
            }
        }
        else if ((horizontal ? currentWidth : currentHeight) > lastEdge) {
            break;
        }
        if (viewBottom <= top ||
            currentHeight >= bottom ||
            viewRight <= left ||
            currentWidth >= right) {
            continue;
        }
        const hiddenHeight = Math.max(0, top - currentHeight) + Math.max(0, viewBottom - bottom);
        const hiddenWidth = Math.max(0, left - currentWidth) + Math.max(0, viewRight - right);
        const fractionHeight = (viewHeight - hiddenHeight) / viewHeight, fractionWidth = (viewWidth - hiddenWidth) / viewWidth;
        const percent = (fractionHeight * fractionWidth * 100) | 0;
        visible.push({
            id: view.id,
            x: currentWidth,
            y: currentHeight,
            view,
            percent,
            widthPercent: (fractionWidth * 100) | 0,
        });
        ids.add(view.id);
    }
    const first = visible[0], last = visible.at(-1);
    if (sortByVisibility) {
        visible.sort(function (a, b) {
            const pc = a.percent - b.percent;
            if (Math.abs(pc) > 0.001) {
                return -pc;
            }
            return a.id - b.id; // ensure stability
        });
    }
    return { first, last, views: visible, ids };
}
/**
 * Event handler to suppress context menu.
 */
function noContextMenuHandler(evt) {
    evt.preventDefault();
}
function normalizeWheelEventDirection(evt) {
    let delta = Math.hypot(evt.deltaX, evt.deltaY);
    const angle = Math.atan2(evt.deltaY, evt.deltaX);
    if (-0.25 * Math.PI < angle && angle < 0.75 * Math.PI) {
        // All that is left-up oriented has to change the sign.
        delta = -delta;
    }
    return delta;
}
function normalizeWheelEventDelta(evt) {
    const deltaMode = evt.deltaMode; // Avoid being affected by bug 1392460.
    let delta = normalizeWheelEventDirection(evt);
    const MOUSE_PIXELS_PER_LINE = 30;
    const MOUSE_LINES_PER_PAGE = 30;
    // Converts delta to per-page units
    if (deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
        delta /= MOUSE_PIXELS_PER_LINE * MOUSE_LINES_PER_PAGE;
    }
    else if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta /= MOUSE_LINES_PER_PAGE;
    }
    return delta;
}
function isValidRotation(angle) {
    return Number.isInteger(angle) && angle % 90 === 0;
}
function isValidScrollMode(mode) {
    return (Number.isInteger(mode) &&
        Object.values(ScrollMode).includes(mode) &&
        mode !== ScrollMode.UNKNOWN);
}
function isValidSpreadMode(mode) {
    return (Number.isInteger(mode) &&
        Object.values(SpreadMode).includes(mode) &&
        mode !== SpreadMode.UNKNOWN);
}
function isPortraitOrientation(size) {
    return size.width <= size.height;
}
/**
 * Promise that is resolved when DOM window becomes visible.
 */
const animationStarted = new Promise(function (resolve) {
    window.requestAnimationFrame(resolve);
});
const docStyle = document.documentElement.style;
function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}
class ProgressBar {
    constructor(bar) {
        _ProgressBar_classList.set(this, null);
        _ProgressBar_disableAutoFetchTimeout.set(this, null);
        _ProgressBar_percent.set(this, 0);
        _ProgressBar_style.set(this, null);
        _ProgressBar_visible.set(this, true);
        __classPrivateFieldSet(this, _ProgressBar_classList, bar.classList, "f");
        __classPrivateFieldSet(this, _ProgressBar_style, bar.style, "f");
    }
    get percent() {
        return __classPrivateFieldGet(this, _ProgressBar_percent, "f");
    }
    set percent(val) {
        var _a, _b, _c;
        __classPrivateFieldSet(this, _ProgressBar_percent, clamp(val, 0, 100), "f");
        if (isNaN(val)) {
            (_a = __classPrivateFieldGet(this, _ProgressBar_classList, "f")) === null || _a === void 0 ? void 0 : _a.add("indeterminate");
            return;
        }
        (_b = __classPrivateFieldGet(this, _ProgressBar_classList, "f")) === null || _b === void 0 ? void 0 : _b.remove("indeterminate");
        (_c = __classPrivateFieldGet(this, _ProgressBar_style, "f")) === null || _c === void 0 ? void 0 : _c.setProperty("--progressBar-percent", `${__classPrivateFieldGet(this, _ProgressBar_percent, "f")}%`);
    }
    setWidth(viewer) {
        var _a;
        if (!viewer) {
            return;
        }
        const container = viewer.parentNode;
        const scrollbarWidth = container.offsetWidth - viewer.offsetWidth;
        if (scrollbarWidth > 0) {
            (_a = __classPrivateFieldGet(this, _ProgressBar_style, "f")) === null || _a === void 0 ? void 0 : _a.setProperty("--progressBar-end-offset", `${scrollbarWidth}px`);
        }
    }
    setDisableAutoFetch(delay = /* ms = */ 5000) {
        if (isNaN(__classPrivateFieldGet(this, _ProgressBar_percent, "f"))) {
            return;
        }
        if (__classPrivateFieldGet(this, _ProgressBar_disableAutoFetchTimeout, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _ProgressBar_disableAutoFetchTimeout, "f"));
        }
        this.show();
        __classPrivateFieldSet(this, _ProgressBar_disableAutoFetchTimeout, setTimeout(() => {
            __classPrivateFieldSet(this, _ProgressBar_disableAutoFetchTimeout, null, "f");
            this.hide();
        }, delay), "f");
    }
    hide() {
        var _a;
        if (!__classPrivateFieldGet(this, _ProgressBar_visible, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _ProgressBar_visible, false, "f");
        (_a = __classPrivateFieldGet(this, _ProgressBar_classList, "f")) === null || _a === void 0 ? void 0 : _a.add("hidden");
    }
    show() {
        var _a;
        if (__classPrivateFieldGet(this, _ProgressBar_visible, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _ProgressBar_visible, true, "f");
        (_a = __classPrivateFieldGet(this, _ProgressBar_classList, "f")) === null || _a === void 0 ? void 0 : _a.remove("hidden");
    }
}
_ProgressBar_classList = new WeakMap(), _ProgressBar_disableAutoFetchTimeout = new WeakMap(), _ProgressBar_percent = new WeakMap(), _ProgressBar_style = new WeakMap(), _ProgressBar_visible = new WeakMap();
/**
 * Get the active or focused element in current DOM.
 *
 * Recursively search for the truly active or focused element in case there are
 * shadow DOMs.
 *
 * @returns {Element} the truly active or focused element.
 */
function getActiveOrFocusedElement() {
    let curRoot = document;
    let curActiveOrFocused = curRoot.activeElement || curRoot.querySelector(":focus");
    while (curActiveOrFocused === null || curActiveOrFocused === void 0 ? void 0 : curActiveOrFocused.shadowRoot) {
        curRoot = curActiveOrFocused.shadowRoot;
        curActiveOrFocused =
            curRoot.activeElement || curRoot.querySelector(":focus");
    }
    return curActiveOrFocused;
}
/**
 * Converts API PageLayout values to the format used by `BaseViewer`.
 * @param {string} mode - The API PageLayout value.
 * @returns {Object}
 */
function apiPageLayoutToViewerModes(layout) {
    let scrollMode = ScrollMode.VERTICAL, spreadMode = SpreadMode.NONE;
    switch (layout) {
        case "SinglePage":
            scrollMode = ScrollMode.PAGE;
            break;
        case "OneColumn":
            break;
        case "TwoPageLeft":
            scrollMode = ScrollMode.PAGE;
        /* falls through */
        case "TwoColumnLeft":
            spreadMode = SpreadMode.ODD;
            break;
        case "TwoPageRight":
            scrollMode = ScrollMode.PAGE;
        /* falls through */
        case "TwoColumnRight":
            spreadMode = SpreadMode.EVEN;
            break;
    }
    return { scrollMode, spreadMode };
}
/**
 * Converts API PageMode values to the format used by `PDFSidebar`.
 * NOTE: There's also a "FullScreen" parameter which is not possible to support,
 *       since the Fullscreen API used in browsers requires that entering
 *       fullscreen mode only occurs as a result of a user-initiated event.
 * @param {string} mode - The API PageMode value.
 * @returns {number} A value from {SidebarView}.
 */
function apiPageModeToSidebarView(mode) {
    switch (mode) {
        case "UseNone":
            return SidebarView.NONE;
        case "UseThumbs":
            return SidebarView.THUMBS;
        case "UseOutlines":
            return SidebarView.OUTLINE;
        case "UseAttachments":
            return SidebarView.ATTACHMENTS;
        case "UseOC":
            return SidebarView.LAYERS;
    }
    return SidebarView.NONE; // Default value.
}

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** @typedef {import("./interfaces").IRenderableView} IRenderableView */
/** @typedef {import("./pdf_viewer").PDFViewer} PDFViewer */
// eslint-disable-next-line max-len
/** @typedef {import("./pdf_thumbnail_viewer").PDFThumbnailViewer} PDFThumbnailViewer */
const CLEANUP_TIMEOUT = 30000;
/**
 * Controls rendering of the views for pages and thumbnails.
 */
class PDFRenderingQueue {
    constructor() {
        this.pdfViewer = null;
        this.pdfThumbnailViewer = null;
        this.onIdle = null;
        this.highestPriorityPage = null;
        /** @type {number} */
        this.idleTimeout = null;
        this.printing = false;
        this.isThumbnailViewEnabled = false;
    }
    /**
     * @param {PDFViewer} pdfViewer
     */
    setViewer(pdfViewer) {
        this.pdfViewer = pdfViewer;
    }
    /**
     * @param {PDFThumbnailViewer} pdfThumbnailViewer
     */
    setThumbnailViewer(pdfThumbnailViewer) {
        this.pdfThumbnailViewer = pdfThumbnailViewer;
    }
    /**
     * @param {IRenderableView} view
     * @returns {boolean}
     */
    isHighestPriority(view) {
        return this.highestPriorityPage === view.renderingId;
    }
    /**
     * @returns {boolean}
     */
    hasViewer() {
        return !!this.pdfViewer;
    }
    /**
     * @param {Object} currentlyVisiblePages
     */
    renderHighestPriority(currentlyVisiblePages) {
        var _a, _b;
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
        // Pages have a higher priority than thumbnails, so check them first.
        if ((_a = this.pdfViewer) === null || _a === void 0 ? void 0 : _a.forceRendering(currentlyVisiblePages)) {
            return;
        }
        // No pages needed rendering, so check thumbnails.
        if (this.isThumbnailViewEnabled &&
            ((_b = this.pdfThumbnailViewer) === null || _b === void 0 ? void 0 : _b.forceRendering())) {
            return;
        }
        if (this.printing) {
            // If printing is currently ongoing do not reschedule cleanup.
            return;
        }
        if (this.onIdle) {
            this.idleTimeout = setTimeout(this.onIdle.bind(this), CLEANUP_TIMEOUT);
        }
    }
    /**
     * @param {Object} visible
     * @param {Array} views
     * @param {boolean} scrolledDown
     * @param {boolean} [preRenderExtra]
     */
    getHighestPriority(visible, views, scrolledDown, preRenderExtra = false) {
        /**
         * The state has changed. Figure out which page has the highest priority to
         * render next (if any).
         *
         * Priority:
         * 1. visible pages
         * 2. if last scrolled down, the page after the visible pages, or
         *    if last scrolled up, the page before the visible pages
         */
        const visibleViews = visible.views, numVisible = visibleViews.length;
        if (numVisible === 0) {
            return null;
        }
        for (let i = 0; i < numVisible; i++) {
            const view = visibleViews[i].view;
            if (!this.isViewFinished(view)) {
                return view;
            }
        }
        const firstId = visible.first.id, lastId = visible.last.id;
        // All the visible views have rendered; try to handle any "holes" in the
        // page layout (can happen e.g. with spreadModes at higher zoom levels).
        if (lastId - firstId + 1 > numVisible) {
            const visibleIds = visible.ids;
            for (let i = 1, ii = lastId - firstId; i < ii; i++) {
                const holeId = scrolledDown ? firstId + i : lastId - i;
                if (visibleIds.has(holeId)) {
                    continue;
                }
                const holeView = views[holeId - 1];
                if (!this.isViewFinished(holeView)) {
                    return holeView;
                }
            }
        }
        // All the visible views have rendered; try to render next/previous page.
        // (IDs start at 1, so no need to add 1 when `scrolledDown === true`.)
        let preRenderIndex = scrolledDown ? lastId : firstId - 2;
        let preRenderView = views[preRenderIndex];
        if (preRenderView && !this.isViewFinished(preRenderView)) {
            return preRenderView;
        }
        if (preRenderExtra) {
            preRenderIndex += scrolledDown ? 1 : -1;
            preRenderView = views[preRenderIndex];
            if (preRenderView && !this.isViewFinished(preRenderView)) {
                return preRenderView;
            }
        }
        // Everything that needs to be rendered has been.
        return null;
    }
    /**
     * @param {IRenderableView} view
     * @returns {boolean}
     */
    isViewFinished(view) {
        return view.renderingState === RenderingStates.FINISHED;
    }
    /**
     * Render a page or thumbnail view. This calls the appropriate function
     * based on the views state. If the view is already rendered it will return
     * `false`.
     *
     * @param {IRenderableView} view
     */
    renderView(view) {
        switch (view.renderingState) {
            case RenderingStates.FINISHED:
                return false;
            case RenderingStates.PAUSED:
                this.highestPriorityPage = view.renderingId;
                view.resume();
                break;
            case RenderingStates.RUNNING:
                this.highestPriorityPage = view.renderingId;
                break;
            case RenderingStates.INITIAL:
                this.highestPriorityPage = view.renderingId;
                view
                    .draw()
                    .finally(() => {
                    this.renderHighestPriority();
                })
                    .catch((reason) => {
                    if (reason instanceof RenderingCancelledException) {
                        return;
                    }
                    console.error(`renderView: "${reason}"`);
                });
                break;
        }
        return true;
    }
}

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a, _TempImageFactory_tempCanvas;
const DRAW_UPSCALE_FACTOR = 2; // See comment in `PDFThumbnailView.draw` below.
const MAX_NUM_SCALING_STEPS = 3;
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
class TempImageFactory {
    static getCanvas(width, height) {
        const tempCanvas = (__classPrivateFieldSet(this, _a, __classPrivateFieldGet(this, _a, "f", _TempImageFactory_tempCanvas) || document.createElement("canvas"), "f", _TempImageFactory_tempCanvas));
        tempCanvas.width = width;
        tempCanvas.height = height;
        // Since this is a temporary canvas, we need to fill it with a white
        // background ourselves. `_getPageDrawContext` uses CSS rules for this.
        const ctx = tempCanvas.getContext("2d", { alpha: false });
        ctx.save();
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        const c = tempCanvas.getContext("2d");
        return [tempCanvas, c];
    }
    static destroyCanvas() {
        const tempCanvas = __classPrivateFieldGet(this, _a, "f", _TempImageFactory_tempCanvas);
        if (tempCanvas) {
            // Zeroing the width and height causes Firefox to release graphics
            // resources immediately, which can greatly reduce memory consumption.
            tempCanvas.width = 0;
            tempCanvas.height = 0;
        }
        __classPrivateFieldSet(this, _a, null, "f", _TempImageFactory_tempCanvas);
    }
}
_a = TempImageFactory;
_TempImageFactory_tempCanvas = { value: null };
/**
 * @implements {IRenderableView}
 */
class PDFThumbnailView {
    /**
     * @param {PDFThumbnailViewOptions} options
     */
    constructor({ container, eventBus, id, defaultViewport, optionalContentConfigPromise, linkService, renderingQueue, l10n, pageColors, store, thumbnailWidth, }) {
        this.container = container;
        this.eventBus = eventBus;
        this.id = id;
        this.renderingId = "thumbnail" + id;
        this.pageLabel = null;
        this.store = store;
        this.loaded = false;
        this.pdfPage = null;
        this.rotation = 0;
        this.viewport = defaultViewport;
        this.pdfPageRotate = defaultViewport.rotation;
        this._optionalContentConfigPromise = optionalContentConfigPromise || null;
        this.pageColors = pageColors || null;
        this.linkService = linkService;
        this.renderingQueue = renderingQueue;
        this.renderTask = null;
        this.renderingState = RenderingStates.INITIAL;
        this.resume = null;
        const pageWidth = this.viewport.width, pageHeight = this.viewport.height, pageRatio = pageWidth / pageHeight;
        this.canvasWidth = thumbnailWidth; // THUMBNAIL_WIDTH;
        this.canvasHeight = (this.canvasWidth / pageRatio) | 0;
        this.scale = this.canvasWidth / pageWidth;
        this.l10n = l10n;
        this.canvas = null;
        this.src = null;
        const div = document.createElement("div");
        div.className = "thumbnail pdfSlickThumbHolder";
        div.setAttribute("data-page-number", this.id.toString());
        this.div = div;
        container.append(div);
    }
    setPdfPage(pdfPage) {
        this.pdfPage = pdfPage;
        this.pdfPageRotate = pdfPage.rotate;
        const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
        this.viewport = pdfPage.getViewport({ scale: 1, rotation: totalRotation });
        this.reset();
    }
    reset() {
        this.cancelRendering();
        this.renderingState = RenderingStates.INITIAL;
        const pageWidth = this.viewport.width, pageHeight = this.viewport.height, pageRatio = pageWidth / pageHeight;
        this.canvasHeight = (this.canvasWidth / pageRatio) | 0;
        this.scale = this.canvasWidth / pageWidth;
        this.div.removeAttribute("data-loaded");
        this.loaded = false;
        if (this.canvas) {
            // Zeroing the width and height causes Firefox to release graphics
            // resources immediately, which can greatly reduce memory consumption.
            this.canvas.width = 0;
            this.canvas.height = 0;
            delete this.canvas;
        }
    }
    update({ rotation = null }) {
        if (typeof rotation === "number") {
            this.rotation = rotation; // The rotation may be zero.
        }
        const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
        this.viewport = this.viewport.clone({
            scale: 1,
            rotation: totalRotation,
        });
        this.reset();
    }
    /**
     * PLEASE NOTE: Most likely you want to use the `this.reset()` method,
     *              rather than calling this one directly.
     */
    cancelRendering() {
        if (this.renderTask) {
            this.renderTask.cancel();
            this.renderTask = null;
        }
        this.resume = null;
    }
    /**
     * @private
     */
    _getPageDrawContext(upscaleFactor = 1) {
        // Keep the no-thumbnail outline visible, i.e. `data-loaded === false`,
        // until rendering/image conversion is complete, to avoid display issues.
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        const outputScale = new OutputScale();
        canvas.width = (upscaleFactor * this.canvasWidth * outputScale.sx) | 0;
        canvas.height = (upscaleFactor * this.canvasHeight * outputScale.sy) | 0;
        const transform = outputScale.scaled
            ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0]
            : null;
        return { ctx, canvas, transform };
    }
    /**
     * @private
     */
    _convertCanvasToImage(canvas) {
        if (this.renderingState !== RenderingStates.FINISHED) {
            throw new Error("_convertCanvasToImage: Rendering has not finished.");
        }
        const reducedCanvas = this._reduceImage(canvas);
        this.src = reducedCanvas.toDataURL();
        this.div.setAttribute("data-loaded", "true");
        this.loaded = true;
        // this.store.getState()._setThumbnail(this.id, this.src)
        this.store.getState()._setThumbnailView(this.id, this);
        // Zeroing the width and height causes Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        reducedCanvas.width = 0;
        reducedCanvas.height = 0;
    }
    draw() {
        if (this.renderingState !== RenderingStates.INITIAL) {
            console.error("Must be in new state before drawing");
            return Promise.resolve();
        }
        const { pdfPage } = this;
        if (!pdfPage) {
            this.renderingState = RenderingStates.FINISHED;
            return Promise.reject(new Error("pdfPage is not loaded"));
        }
        this.renderingState = RenderingStates.RUNNING;
        const finishRenderTask = (error = null) => __awaiter(this, void 0, void 0, function* () {
            // The renderTask may have been replaced by a new one, so only remove
            // the reference to the renderTask if it matches the one that is
            // triggering this callback.
            if (renderTask === this.renderTask) {
                this.renderTask = null;
            }
            if (error instanceof RenderingCancelledException) {
                return;
            }
            this.renderingState = RenderingStates.FINISHED;
            this._convertCanvasToImage(canvas);
            if (error) {
                throw error;
            }
        });
        // Render the thumbnail at a larger size and downsize the canvas (similar
        // to `setImage`), to improve consistency between thumbnails created by
        // the `draw` and `setImage` methods (fixes issue 8233).
        // NOTE: To primarily avoid increasing memory usage too much, but also to
        //   reduce downsizing overhead, we purposely limit the up-scaling factor.
        const { ctx, canvas, transform } = this._getPageDrawContext(DRAW_UPSCALE_FACTOR);
        const drawViewport = this.viewport.clone({
            scale: DRAW_UPSCALE_FACTOR * this.scale,
        });
        const renderContinueCallback = (cont) => {
            if (!this.renderingQueue.isHighestPriority(this)) {
                this.renderingState = RenderingStates.PAUSED;
                this.resume = () => {
                    this.renderingState = RenderingStates.RUNNING;
                    cont();
                };
                return;
            }
            cont();
        };
        const renderContext = {
            canvasContext: ctx,
            transform,
            viewport: drawViewport,
            optionalContentConfigPromise: this._optionalContentConfigPromise,
            pageColors: this.pageColors,
        };
        const renderTask = (this.renderTask = pdfPage.render(renderContext));
        renderTask.onContinue = renderContinueCallback;
        const resultPromise = renderTask.promise.then(function () {
            return finishRenderTask(null);
        }, function (error) {
            return finishRenderTask(error);
        });
        resultPromise.finally(() => {
            // Zeroing the width and height causes Firefox to release graphics
            // resources immediately, which can greatly reduce memory consumption.
            canvas.width = 0;
            canvas.height = 0;
            this.eventBus.dispatch("thumbnailrendered", {
                source: this,
                pageNumber: this.id,
                pdfPage: this.pdfPage,
            });
        });
        return resultPromise;
    }
    setImage(pageView) {
        if (this.renderingState !== RenderingStates.INITIAL) {
            return;
        }
        const { thumbnailCanvas: canvas, pdfPage, scale } = pageView;
        if (!canvas) {
            return;
        }
        if (!this.pdfPage) {
            this.setPdfPage(pdfPage);
        }
        if (scale < this.scale) {
            // Avoid upscaling the image, since that makes the thumbnail look blurry.
            return;
        }
        this.renderingState = RenderingStates.FINISHED;
        this._convertCanvasToImage(canvas);
    }
    /**
     * @private
     */
    _reduceImage(img) {
        const { ctx, canvas } = this._getPageDrawContext();
        if (img.width <= 2 * canvas.width) {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            return canvas;
        }
        // drawImage does an awful job of rescaling the image, doing it gradually.
        let reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS;
        let reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS;
        const [reducedImage, reducedImageCtx] = TempImageFactory.getCanvas(reducedWidth, reducedHeight);
        while (reducedWidth > img.width || reducedHeight > img.height) {
            reducedWidth >>= 1;
            reducedHeight >>= 1;
        }
        reducedImageCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, reducedWidth, reducedHeight);
        while (reducedWidth > 2 * canvas.width) {
            reducedImageCtx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, reducedWidth >> 1, reducedHeight >> 1);
            reducedWidth >>= 1;
            reducedHeight >>= 1;
        }
        ctx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, canvas.width, canvas.height);
        return canvas;
    }
    get _thumbPageTitle() {
        var _b;
        return this.l10n.get("thumb_page_title", {
            page: (_b = this.pageLabel) !== null && _b !== void 0 ? _b : this.id,
        });
    }
    get _thumbPageCanvas() {
        var _b;
        return this.l10n.get("thumb_page_canvas", {
            page: ((_b = this.pageLabel) !== null && _b !== void 0 ? _b : this.id),
        });
    }
    /**
     * @param {string|null} label
     */
    setPageLabel(label) {
        this.pageLabel = typeof label === "string" ? label : null;
        // this._thumbPageTitle.then((msg: string) => {
        //   this.anchor.title = msg;
        // });
        // if (this.renderingState !== RenderingStates.FINISHED) {
        //   return;
        // }
        // this._thumbPageCanvas.then((msg: string) => {
        //   this.image?.setAttribute("aria-label", msg);
        // });
    }
}

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _PDFThumbnailViewer_instances, _PDFThumbnailViewer_ensurePdfPageLoaded, _PDFThumbnailViewer_getScrollAhead;
const THUMBNAIL_SCROLL_MARGIN = -19;
const THUMBNAIL_SELECTED_CLASS = "selected";
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
class PDFThumbnailViewer {
    /**
     * @param {PDFThumbnailViewerOptions} options
     */
    constructor({ container, eventBus, linkService, renderingQueue, l10n, pageColors, store, thumbnailWidth, }) {
        _PDFThumbnailViewer_instances.add(this);
        this.container = container;
        this.eventBus = eventBus;
        this.linkService = linkService;
        this.renderingQueue = renderingQueue;
        this.l10n = l10n;
        this.pageColors = pageColors || null;
        this._thumbnails = [];
        this._currentPageNumber = 0;
        this._pagesRotation = 0;
        this._pageLabels = [];
        this.pdfDocument = null;
        this.store = store;
        this.thumbnailWidth = thumbnailWidth;
        if (this.pageColors &&
            !(CSS.supports("color", this.pageColors.background) &&
                CSS.supports("color", this.pageColors.foreground))) {
            if (this.pageColors.background || this.pageColors.foreground) {
                console.warn("PDFThumbnailViewer: Ignoring `pageColors`-option, since the browser doesn't support the values used.");
            }
            this.pageColors = null;
        }
        this.scroll = watchScroll(this.container, this._scrollUpdated.bind(this));
        this._resetView();
    }
    /**
     * @private
     */
    _scrollUpdated() {
        this.renderingQueue.renderHighestPriority();
    }
    getThumbnail(index) {
        return this._thumbnails[index];
    }
    /**
     * @private
     */
    _getVisibleThumbs() {
        return getVisibleElements({
            scrollEl: this.container,
            views: this._thumbnails,
        });
    }
    scrollThumbnailIntoView(pageNumber) {
        if (!this.pdfDocument) {
            return;
        }
        const thumbnailView = this._thumbnails[pageNumber - 1];
        if (!thumbnailView) {
            console.error('scrollThumbnailIntoView: Invalid "pageNumber" parameter.');
            return;
        }
        if (pageNumber !== this._currentPageNumber) {
            const prevThumbnailView = this._thumbnails[this._currentPageNumber - 1];
            // Remove the highlight from the previous thumbnail...
            prevThumbnailView.div.classList.remove(THUMBNAIL_SELECTED_CLASS);
            // ... and add the highlight to the new thumbnail.
            thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);
        }
        const visibleThumbs = this._getVisibleThumbs();
        const { first, last, views } = visibleThumbs;
        // If the thumbnail isn't currently visible, scroll it into view.
        if (views.length > 0) {
            let shouldScroll = false;
            if (pageNumber <= first.id || pageNumber >= (last === null || last === void 0 ? void 0 : last.id)) {
                shouldScroll = true;
            }
            else {
                for (const { id, percent } of views) {
                    if (id !== pageNumber) {
                        continue;
                    }
                    shouldScroll = percent < 100;
                    break;
                }
            }
            if (shouldScroll) {
                scrollIntoView(thumbnailView.div, { top: THUMBNAIL_SCROLL_MARGIN });
            }
        }
        this._currentPageNumber = pageNumber;
        this.forceRendering();
    }
    get pagesRotation() {
        return this._pagesRotation;
    }
    set pagesRotation(rotation) {
        if (!isValidRotation(rotation)) {
            throw new Error("Invalid thumbnails rotation angle.");
        }
        if (!this.pdfDocument) {
            return;
        }
        if (this._pagesRotation === rotation) {
            return; // The rotation didn't change.
        }
        this._pagesRotation = rotation;
        const updateArgs = { rotation: rotation };
        for (const thumbnail of this._thumbnails) {
            thumbnail.update(updateArgs);
        }
    }
    cleanup() {
        for (const thumbnail of this._thumbnails) {
            if (thumbnail.renderingState !== RenderingStates.FINISHED) {
                thumbnail.reset();
            }
        }
        TempImageFactory.destroyCanvas();
    }
    /**
     * @private
     */
    _resetView() {
        this._thumbnails = [];
        this._currentPageNumber = 1;
        this._pageLabels = [];
        this._pagesRotation = 0;
        // Remove the thumbnails from the DOM.
        this.container.textContent = "";
    }
    /**
     * @param {PDFDocumentProxy} pdfDocument
     */
    setDocument(pdfDocument) {
        if (this.pdfDocument) {
            this._cancelRendering();
            this._resetView();
        }
        this.pdfDocument = pdfDocument;
        if (!pdfDocument) {
            return;
        }
        const firstPagePromise = pdfDocument.getPage(1);
        const optionalContentConfigPromise = pdfDocument.getOptionalContentConfig();
        firstPagePromise
            .then((firstPdfPage) => {
            var _a;
            const pagesCount = pdfDocument.numPages;
            const viewport = firstPdfPage.getViewport({ scale: 1 });
            for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
                const thumbnail = new PDFThumbnailView({
                    container: this.container,
                    eventBus: this.eventBus,
                    id: pageNum,
                    defaultViewport: viewport.clone(),
                    optionalContentConfigPromise,
                    linkService: this.linkService,
                    renderingQueue: this.renderingQueue,
                    l10n: this.l10n,
                    pageColors: this.pageColors,
                    store: this.store,
                    thumbnailWidth: this.thumbnailWidth,
                });
                this._thumbnails.push(thumbnail);
            }
            // Set the first `pdfPage` immediately, since it's already loaded,
            // rather than having to repeat the `PDFDocumentProxy.getPage` call in
            // the `this.#ensurePdfPageLoaded` method before rendering can start.
            (_a = this._thumbnails[0]) === null || _a === void 0 ? void 0 : _a.setPdfPage(firstPdfPage);
            // Ensure that the current thumbnail is always highlighted on load.
            const thumbnailView = this._thumbnails[this._currentPageNumber - 1];
            thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);
            this.store.getState()._setThumbnailsViews(this._thumbnails);
        })
            .catch((reason) => {
            console.error("Unable to initialize thumbnail viewer", reason);
        });
    }
    /**
     * @private
     */
    _cancelRendering() {
        for (const thumbnail of this._thumbnails) {
            thumbnail.cancelRendering();
        }
    }
    /**
     * @param {Array|null} labels
     */
    setPageLabels(labels) {
        var _a, _b;
        if (!this.pdfDocument) {
            return;
        }
        if (!labels) {
            this._pageLabels = [];
        }
        else if (!(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)) {
            this._pageLabels = [];
            console.error("PDFThumbnailViewer_setPageLabels: Invalid page labels.");
        }
        else {
            this._pageLabels = labels;
        }
        // Update all the `PDFThumbnailView` instances.
        for (let i = 0, ii = this._thumbnails.length; i < ii; i++) {
            this._thumbnails[i].setPageLabel((_b = (_a = this._pageLabels) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : null);
        }
    }
    forceRendering() {
        const visibleThumbs = this._getVisibleThumbs();
        // console.log(`forceRendering, visibleThumbs: `, visibleThumbs)
        const scrollAhead = __classPrivateFieldGet(this, _PDFThumbnailViewer_instances, "m", _PDFThumbnailViewer_getScrollAhead).call(this, visibleThumbs);
        const thumbView = this.renderingQueue.getHighestPriority(visibleThumbs, this._thumbnails, scrollAhead);
        // console.log(`forceRendering, thumbView: `, thumbView)
        if (thumbView) {
            __classPrivateFieldGet(this, _PDFThumbnailViewer_instances, "m", _PDFThumbnailViewer_ensurePdfPageLoaded).call(this, thumbView).then(() => {
                this.renderingQueue.renderView(thumbView);
            });
            return true;
        }
        return false;
    }
}
_PDFThumbnailViewer_instances = new WeakSet(), _PDFThumbnailViewer_ensurePdfPageLoaded = function _PDFThumbnailViewer_ensurePdfPageLoaded(thumbView) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (thumbView === null || thumbView === void 0 ? void 0 : thumbView.pdfPage) {
            return thumbView.pdfPage;
        }
        try {
            const pdfPage = yield ((_a = this.pdfDocument) === null || _a === void 0 ? void 0 : _a.getPage(thumbView.id));
            if (!(thumbView === null || thumbView === void 0 ? void 0 : thumbView.pdfPage)) {
                thumbView.setPdfPage(pdfPage);
            }
            return pdfPage;
        }
        catch (reason) {
            console.error("Unable to get page for thumb view", reason);
            return null; // Page error -- there is nothing that can be done.
        }
    });
}, _PDFThumbnailViewer_getScrollAhead = function _PDFThumbnailViewer_getScrollAhead(visible) {
    var _a, _b;
    // console.log(`visible: `, visible)
    if (((_a = visible.first) === null || _a === void 0 ? void 0 : _a.id) === 1) {
        return true;
    }
    else if (((_b = visible.last) === null || _b === void 0 ? void 0 : _b.id) === this._thumbnails.length) {
        return false;
    }
    return this.scroll.down;
};

/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _OverlayManager_overlays, _OverlayManager_active;
class OverlayManager {
    constructor() {
        _OverlayManager_overlays.set(this, new WeakMap());
        _OverlayManager_active.set(this, null);
    }
    get active() {
        return __classPrivateFieldGet(this, _OverlayManager_active, "f");
    }
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @param {boolean} [canForceClose] - Indicates if opening the overlay closes
     *                  an active overlay. The default is `false`.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    registered.
     */
    register(dialog, canForceClose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof dialog !== "object") {
                throw new Error("Not enough parameters.");
            }
            else if (__classPrivateFieldGet(this, _OverlayManager_overlays, "f").has(dialog)) {
                throw new Error("The overlay is already registered.");
            }
            __classPrivateFieldGet(this, _OverlayManager_overlays, "f").set(dialog, { canForceClose });
            dialog.addEventListener("cancel", () => {
                __classPrivateFieldSet(this, _OverlayManager_active, null, "f");
            });
        });
    }
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    unregistered.
     */
    unregister(dialog) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _OverlayManager_overlays, "f").has(dialog)) {
                throw new Error("The overlay does not exist.");
            }
            else if (__classPrivateFieldGet(this, _OverlayManager_active, "f") === dialog) {
                throw new Error("The overlay cannot be removed while it is active.");
            }
            __classPrivateFieldGet(this, _OverlayManager_overlays, "f").delete(dialog);
        });
    }
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    opened.
     */
    open(dialog) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _OverlayManager_overlays, "f").has(dialog)) {
                throw new Error("The overlay does not exist.");
            }
            else if (__classPrivateFieldGet(this, _OverlayManager_active, "f")) {
                if (__classPrivateFieldGet(this, _OverlayManager_active, "f") === dialog) {
                    throw new Error("The overlay is already active.");
                }
                else if (__classPrivateFieldGet(this, _OverlayManager_overlays, "f").get(dialog).canForceClose) {
                    yield this.close();
                }
                else {
                    throw new Error("Another overlay is currently active.");
                }
            }
            __classPrivateFieldSet(this, _OverlayManager_active, dialog, "f");
            dialog.showModal();
        });
    }
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    closed.
     */
    close(dialog = __classPrivateFieldGet(this, _OverlayManager_active, "f")) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dialog || !__classPrivateFieldGet(this, _OverlayManager_overlays, "f").has(dialog)) {
                throw new Error("The overlay does not exist.");
            }
            else if (!__classPrivateFieldGet(this, _OverlayManager_active, "f")) {
                throw new Error("The overlay is currently not active.");
            }
            else if (__classPrivateFieldGet(this, _OverlayManager_active, "f") !== dialog) {
                throw new Error("Another overlay is currently active.");
            }
            dialog.close();
            __classPrivateFieldSet(this, _OverlayManager_active, null, "f");
        });
    }
}
_OverlayManager_overlays = new WeakMap(), _OverlayManager_active = new WeakMap();

/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
// https://github.com/mozilla/pdf.js/blob/master/web/print_utils.js
//
function getXfaHtmlForPrinting(printContainer, pdfDocument) {
    const xfaHtml = pdfDocument.allXfaHtml;
    const linkService = new SimpleLinkService();
    const scale = Math.round(PixelsPerInch.PDF_TO_CSS_UNITS * 100) / 100;
    for (const xfaPage of xfaHtml === null || xfaHtml === void 0 ? void 0 : xfaHtml.children) {
        const page = document.createElement("div");
        page.className = "xfaPrintedPage";
        printContainer.append(page);
        const builder = new XfaLayerBuilder({
            pageDiv: page,
            pdfPage: null,
            annotationStorage: pdfDocument.annotationStorage,
            linkService,
            xfaHtml: xfaPage,
        });
        const viewport = getXfaPageViewport(xfaPage, { scale });
        builder.render(viewport, "print");
    }
}
let activeService = null;
let dialog = null;
let overlayManager = new OverlayManager();
// Renders the page to the canvas of the given print service, and returns
// the suggested dimensions of the output page.
function renderPage(activeServiceOnEntry, pdfDocument, pageNumber, size, printResolution, optionalContentConfigPromise, printAnnotationStoragePromise) {
    const scratchCanvas = activeService.scratchCanvas;
    // The size of the canvas in pixels for printing.
    const PRINT_UNITS = printResolution / PixelsPerInch.PDF;
    scratchCanvas.width = Math.floor(size.width * PRINT_UNITS);
    scratchCanvas.height = Math.floor(size.height * PRINT_UNITS);
    const ctx = scratchCanvas.getContext("2d");
    ctx.save();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    ctx.restore();
    return Promise.all([
        pdfDocument.getPage(pageNumber),
        printAnnotationStoragePromise,
    ]).then(function ([pdfPage, printAnnotationStorage]) {
        const renderContext = {
            canvasContext: ctx,
            transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
            viewport: pdfPage.getViewport({ scale: 1, rotation: size.rotation }),
            intent: "print",
            annotationMode: AnnotationMode.ENABLE_STORAGE,
            optionalContentConfigPromise,
            printAnnotationStorage,
        };
        return pdfPage.render(renderContext).promise;
    });
}
class PDFPrintService {
    constructor(pdfDocument, pagesOverview, printContainer, printResolution, optionalContentConfigPromise = null, printAnnotationStoragePromise = null, l10n) {
        this.pdfDocument = pdfDocument;
        this.pagesOverview = pagesOverview;
        this.printContainer = printContainer;
        this._printResolution = printResolution || 150;
        this._optionalContentConfigPromise =
            optionalContentConfigPromise || pdfDocument.getOptionalContentConfig();
        this._printAnnotationStoragePromise =
            printAnnotationStoragePromise || Promise.resolve();
        this.l10n = l10n;
        this.currentPage = -1;
        // The temporary canvas where renderPage paints one page at a time.
        this.scratchCanvas = document.createElement("canvas");
    }
    layout() {
        this.throwIfInactive();
        const body = document.querySelector("body");
        body === null || body === void 0 ? void 0 : body.setAttribute("data-pdfjsprinting", "true");
        const hasEqualPageSizes = this.pagesOverview.every((size) => {
            return (size.width === this.pagesOverview[0].width &&
                size.height === this.pagesOverview[0].height);
        }, this);
        if (!hasEqualPageSizes) {
            console.warn("Not all pages have the same size. The printed " +
                "result may be incorrect!");
        }
        // Insert a @page + size rule to make sure that the page size is correctly
        // set. Note that we assume that all pages have the same size, because
        // variable-size pages are not supported yet (e.g. in Chrome & Firefox).
        // TODO(robwu): Use named pages when size calculation bugs get resolved
        // (e.g. https://crbug.com/355116) AND when support for named pages is
        // added (http://www.w3.org/TR/css3-page/#using-named-pages).
        // In browsers where @page + size is not supported (such as Firefox,
        // https://bugzil.la/851441), the next stylesheet will be ignored and the
        // user has to select the correct paper size in the UI if wanted.
        this.pageStyleSheet = document.createElement("style");
        const pageSize = this.pagesOverview[0];
        this.pageStyleSheet.textContent =
            "@page { size: " + pageSize.width + "pt " + pageSize.height + "pt;}";
        body === null || body === void 0 ? void 0 : body.append(this.pageStyleSheet);
    }
    destroy() {
        if (activeService !== this) {
            // |activeService| cannot be replaced without calling destroy() first,
            // so if it differs then an external consumer has a stale reference to us.
            return;
        }
        this.printContainer.textContent = "";
        const body = document.querySelector("body");
        body === null || body === void 0 ? void 0 : body.removeAttribute("data-pdfjsprinting");
        if (this.pageStyleSheet) {
            this.pageStyleSheet.remove();
            this.pageStyleSheet = null;
        }
        this.scratchCanvas.width = this.scratchCanvas.height = 0;
        this.scratchCanvas = null;
        activeService = null;
        ensureOverlay().then(function () {
            if (overlayManager.active === dialog) {
                overlayManager.close(dialog);
            }
        });
    }
    renderPages() {
        if (this.pdfDocument.isPureXfa) {
            getXfaHtmlForPrinting(this.printContainer, this.pdfDocument);
            return Promise.resolve();
        }
        const pageCount = this.pagesOverview.length;
        const renderNextPage = (resolve, reject) => {
            this.throwIfInactive();
            if (++this.currentPage >= pageCount) {
                renderProgress(pageCount, pageCount, this.l10n);
                resolve();
                return;
            }
            const index = this.currentPage;
            renderProgress(index, pageCount, this.l10n);
            renderPage(this, this.pdfDocument, 
            /* pageNumber = */ index + 1, this.pagesOverview[index], this._printResolution, this._optionalContentConfigPromise, this._printAnnotationStoragePromise)
                .then(this.useRenderedPage.bind(this))
                .then(function () {
                renderNextPage(resolve, reject);
            }, reject);
        };
        return new Promise(renderNextPage);
    }
    useRenderedPage() {
        this.throwIfInactive();
        const img = document.createElement("img");
        const scratchCanvas = this.scratchCanvas;
        if ("toBlob" in scratchCanvas) {
            scratchCanvas.toBlob(function (blob) {
                img.src = URL.createObjectURL(blob);
            });
        }
        else {
            img.src = scratchCanvas.toDataURL();
        }
        const wrapper = document.createElement("div");
        wrapper.className = "printedPage";
        wrapper.append(img);
        this.printContainer.append(wrapper);
        return new Promise(function (resolve, reject) {
            img.onload = resolve;
            img.onerror = reject;
        });
    }
    performPrint() {
        this.throwIfInactive();
        return new Promise((resolve) => {
            // Push window.print in the macrotask queue to avoid being affected by
            // the deprecation of running print() code in a microtask, see
            // https://github.com/mozilla/pdf.js/issues/7547.
            setTimeout(() => {
                if (!this.active) {
                    resolve();
                    return;
                }
                print.call(window);
                // Delay promise resolution in case print() was not synchronous.
                setTimeout(resolve, 20); // Tidy-up.
            }, 0);
        });
    }
    get active() {
        return this === activeService;
    }
    throwIfInactive() {
        if (!this.active) {
            throw new Error("This print request was cancelled or completed.");
        }
    }
}
const print = window.print;
window.print = function () {
    if (activeService) {
        console.warn("Ignored window.print() because of a pending print job.");
        return;
    }
    ensureOverlay().then(function () {
        if (activeService) {
            overlayManager.open(dialog);
        }
    });
    try {
        dispatchEvent("beforeprint");
    }
    finally {
        if (!activeService) {
            console.error("Expected print service to be initialized.");
            ensureOverlay().then(function () {
                if (overlayManager.active === dialog) {
                    overlayManager.close(dialog);
                }
            });
            return; // eslint-disable-line no-unsafe-finally
        }
        const activeServiceOnEntry = activeService;
        activeService
            .renderPages()
            .then(function () {
            return activeServiceOnEntry.performPrint();
        })
            .catch(function () {
            // Ignore any error messages.
        })
            .then(function () {
            // aborts acts on the "active" print request, so we need to check
            // whether the print request (activeServiceOnEntry) is still active.
            // Without the check, an unrelated print request (created after aborting
            // this print request while the pages were being generated) would be
            // aborted.
            if (activeServiceOnEntry.active) {
                abort();
            }
        });
    }
};
function dispatchEvent(eventType) {
    const event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventType, false, false, "custom");
    window.dispatchEvent(event);
}
function abort() {
    if (activeService) {
        activeService.destroy();
        dispatchEvent("afterprint");
    }
}
function renderProgress(index, total, l10n) {
    dialog || (dialog = document.getElementById("printServiceDialog"));
    const progress = Math.round((100 * index) / total);
    const progressBar = dialog.querySelector("progress");
    const progressPerc = dialog.querySelector(".relative-progress");
    progressBar.value = progress;
    l10n.get("print_progress_percent", { progress }).then((msg) => {
        progressPerc.textContent = msg;
    });
}
window.addEventListener("keydown", function (event) {
    // Intercept Cmd/Ctrl + P in all browsers.
    // Also intercept Cmd/Ctrl + Shift + P in Chrome and Opera
    if (event.keyCode === /* P= */ 80 &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        !event.shiftKey // (!event.shiftKey || window.chrome || window.opera)
    ) {
        window.print();
        event.preventDefault();
        event.stopImmediatePropagation();
    }
}, true);
if ("onbeforeprint" in window) {
    // Do not propagate before/afterprint events when they are not triggered
    // from within this polyfill. (FF / Chrome 63+).
    const stopPropagationIfNeeded = function (event) {
        if (event.detail !== "custom") {
            event.stopImmediatePropagation();
        }
    };
    window.addEventListener("beforeprint", stopPropagationIfNeeded);
    window.addEventListener("afterprint", stopPropagationIfNeeded);
}
let overlayPromise;
function ensureOverlay() {
    if (!overlayPromise) {
        if (!overlayManager) {
            throw new Error("The overlay manager has not yet been initialized.");
        }
        dialog || (dialog = document.getElementById("printServiceDialog"));
        overlayPromise = overlayManager.register(dialog, 
        /* canForceClose = */ true);
        document.getElementById("printCancel").onclick = abort;
        dialog.addEventListener("close", abort);
    }
    return overlayPromise;
}
const PDFPrintServiceFactory = {
    instance: {
        supportsPrinting: true,
        createPrintService(pdfDocument, pagesOverview, printContainer, printResolution, optionalContentConfigPromise, printAnnotationStoragePromise, l10n) {
            if (activeService) {
                throw new Error("The print service is created and active.");
            }
            activeService = new PDFPrintService(pdfDocument, pagesOverview, printContainer, printResolution, optionalContentConfigPromise, printAnnotationStoragePromise, l10n);
            return activeService;
        },
    },
};

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _PDFPresentationMode_instances, _PDFPresentationMode_state, _PDFPresentationMode_args, _PDFPresentationMode_mouseWheel, _PDFPresentationMode_notifyStateChange, _PDFPresentationMode_enter, _PDFPresentationMode_exit, _PDFPresentationMode_mouseDown, _PDFPresentationMode_contextMenu, _PDFPresentationMode_showControls, _PDFPresentationMode_hideControls, _PDFPresentationMode_resetMouseScrollState, _PDFPresentationMode_touchSwipe, _PDFPresentationMode_addWindowListeners, _PDFPresentationMode_removeWindowListeners, _PDFPresentationMode_fullscreenChange, _PDFPresentationMode_addFullscreenChangeListeners, _PDFPresentationMode_removeFullscreenChangeListeners;
const DELAY_BEFORE_HIDING_CONTROLS = 3000; // in ms
const ACTIVE_SELECTOR = "pdfPresentationMode";
const CONTROLS_SELECTOR = "pdfPresentationModeControls";
const MOUSE_SCROLL_COOLDOWN_TIME = 50; // in ms
const PAGE_SWITCH_THRESHOLD = 0.1;
// Number of CSS pixels for a movement to count as a swipe.
const SWIPE_MIN_DISTANCE_THRESHOLD = 50;
// Swipe angle deviation from the x or y axis before it is not
// considered a swipe in that direction any more.
const SWIPE_ANGLE_THRESHOLD = Math.PI / 6;
/**
 * @typedef {Object} PDFPresentationModeOptions
 * @property {HTMLDivElement} container - The container for the viewer element.
 * @property {PDFViewer} pdfViewer - The document viewer.
 * @property {EventBus} eventBus - The application event bus.
 */
class PDFPresentationMode {
    /**
     * @param {PDFPresentationModeOptions} options
     */
    constructor({ container, pdfViewer, eventBus, }) {
        _PDFPresentationMode_instances.add(this);
        _PDFPresentationMode_state.set(this, PresentationModeState.UNKNOWN);
        _PDFPresentationMode_args.set(this, null);
        this.container = container;
        this.pdfViewer = pdfViewer;
        this.eventBus = eventBus;
        this.contextMenuOpen = false;
        this.mouseScrollTimeStamp = 0;
        this.mouseScrollDelta = 0;
        this.touchSwipeState = null;
    }
    /**
     * Request the browser to enter fullscreen mode.
     * @returns {Promise<boolean>} Indicating if the request was successful.
     */
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { container, pdfViewer } = this;
            if (this.active || !pdfViewer.pagesCount || !container.requestFullscreen) {
                return false;
            }
            __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_addFullscreenChangeListeners).call(this);
            __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_notifyStateChange).call(this, PresentationModeState.CHANGING);
            const promise = container.requestFullscreen();
            __classPrivateFieldSet(this, _PDFPresentationMode_args, {
                pageNumber: pdfViewer.currentPageNumber,
                scaleValue: pdfViewer.currentScaleValue,
                scrollMode: pdfViewer.scrollMode,
                spreadMode: null,
                annotationEditorMode: null,
            }, "f");
            if (pdfViewer.spreadMode !== SpreadMode.NONE &&
                !(pdfViewer.pageViewsReady && pdfViewer.hasEqualPageSizes)) {
                console.warn("Ignoring Spread modes when entering PresentationMode, " +
                    "since the document may contain varying page sizes.");
                __classPrivateFieldGet(this, _PDFPresentationMode_args, "f").spreadMode = pdfViewer.spreadMode;
            }
            if (pdfViewer.annotationEditorMode !== AnnotationEditorType.DISABLE) {
                __classPrivateFieldGet(this, _PDFPresentationMode_args, "f").annotationEditorMode = pdfViewer.annotationEditorMode;
            }
            try {
                yield promise;
                pdfViewer.focus(); // Fixes bug 1787456.
                return true;
            }
            catch (reason) {
                __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_removeFullscreenChangeListeners).call(this);
                __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_notifyStateChange).call(this, PresentationModeState.NORMAL);
            }
            return false;
        });
    }
    get active() {
        return (__classPrivateFieldGet(this, _PDFPresentationMode_state, "f") === PresentationModeState.CHANGING ||
            __classPrivateFieldGet(this, _PDFPresentationMode_state, "f") === PresentationModeState.FULLSCREEN);
    }
}
_PDFPresentationMode_state = new WeakMap(), _PDFPresentationMode_args = new WeakMap(), _PDFPresentationMode_instances = new WeakSet(), _PDFPresentationMode_mouseWheel = function _PDFPresentationMode_mouseWheel(evt) {
    if (!this.active) {
        return;
    }
    evt.preventDefault();
    const delta = normalizeWheelEventDelta(evt);
    const currentTime = Date.now();
    const storedTime = this.mouseScrollTimeStamp;
    // If we've already switched page, avoid accidentally switching again.
    if (currentTime > storedTime &&
        currentTime - storedTime < MOUSE_SCROLL_COOLDOWN_TIME) {
        return;
    }
    // If the scroll direction changed, reset the accumulated scroll delta.
    if ((this.mouseScrollDelta > 0 && delta < 0) ||
        (this.mouseScrollDelta < 0 && delta > 0)) {
        __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_resetMouseScrollState).call(this);
    }
    this.mouseScrollDelta += delta;
    if (Math.abs(this.mouseScrollDelta) >= PAGE_SWITCH_THRESHOLD) {
        const totalDelta = this.mouseScrollDelta;
        __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_resetMouseScrollState).call(this);
        const success = totalDelta > 0
            ? this.pdfViewer.previousPage()
            : this.pdfViewer.nextPage();
        if (success) {
            this.mouseScrollTimeStamp = currentTime;
        }
    }
}, _PDFPresentationMode_notifyStateChange = function _PDFPresentationMode_notifyStateChange(state) {
    __classPrivateFieldSet(this, _PDFPresentationMode_state, state, "f");
    this.eventBus.dispatch("presentationmodechanged", { source: this, state });
}, _PDFPresentationMode_enter = function _PDFPresentationMode_enter() {
    var _a;
    __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_notifyStateChange).call(this, PresentationModeState.FULLSCREEN);
    this.container.classList.add(ACTIVE_SELECTOR);
    // Ensure that the correct page is scrolled into view when entering
    // Presentation Mode, by waiting until fullscreen mode in enabled.
    setTimeout(() => {
        this.pdfViewer.scrollMode = ScrollMode.PAGE;
        if (__classPrivateFieldGet(this, _PDFPresentationMode_args, "f").spreadMode !== null) {
            this.pdfViewer.spreadMode = SpreadMode.NONE;
        }
        this.pdfViewer.currentPageNumber = __classPrivateFieldGet(this, _PDFPresentationMode_args, "f").pageNumber;
        this.pdfViewer.currentScaleValue = "page-fit";
        if (__classPrivateFieldGet(this, _PDFPresentationMode_args, "f").annotationEditorMode !== null) {
            this.pdfViewer.annotationEditorMode = AnnotationEditorType.NONE;
        }
    }, 0);
    __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_addWindowListeners).call(this);
    __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_showControls).call(this);
    this.contextMenuOpen = false;
    // Text selection is disabled in Presentation Mode, thus it's not possible
    // for the user to deselect text that is selected (e.g. with "Select all")
    // when entering Presentation Mode, hence we remove any active selection.
    (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
}, _PDFPresentationMode_exit = function _PDFPresentationMode_exit() {
    const pageNumber = this.pdfViewer.currentPageNumber;
    this.container.classList.remove(ACTIVE_SELECTOR);
    // Ensure that the correct page is scrolled into view when exiting
    // Presentation Mode, by waiting until fullscreen mode is disabled.
    setTimeout(() => {
        var _a;
        __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_removeFullscreenChangeListeners).call(this);
        __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_notifyStateChange).call(this, PresentationModeState.NORMAL);
        this.pdfViewer.scrollMode = __classPrivateFieldGet(this, _PDFPresentationMode_args, "f").scrollMode;
        if (((_a = __classPrivateFieldGet(this, _PDFPresentationMode_args, "f")) === null || _a === void 0 ? void 0 : _a.spreadMode) !== null) {
            this.pdfViewer.spreadMode = __classPrivateFieldGet(this, _PDFPresentationMode_args, "f").spreadMode;
        }
        this.pdfViewer.currentScaleValue = __classPrivateFieldGet(this, _PDFPresentationMode_args, "f").scaleValue;
        this.pdfViewer.currentPageNumber = pageNumber;
        if (__classPrivateFieldGet(this, _PDFPresentationMode_args, "f").annotationEditorMode !== null) {
            this.pdfViewer.annotationEditorMode = __classPrivateFieldGet(this, _PDFPresentationMode_args, "f").annotationEditorMode;
        }
        __classPrivateFieldSet(this, _PDFPresentationMode_args, null, "f");
    }, 0);
    __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_removeWindowListeners).call(this);
    __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_hideControls).call(this);
    __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_resetMouseScrollState).call(this);
    this.contextMenuOpen = false;
}, _PDFPresentationMode_mouseDown = function _PDFPresentationMode_mouseDown(evt) {
    var _a;
    if (this.contextMenuOpen) {
        this.contextMenuOpen = false;
        evt.preventDefault();
        return;
    }
    if (evt.button !== 0) {
        return;
    }
    // Enable clicking of links in presentation mode. Note: only links
    // pointing to destinations in the current PDF document work.
    if (evt.target.href &&
        ((_a = evt.target.parentNode) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-internal-link"))) {
        return;
    }
    // Unless an internal link was clicked, advance one page.
    evt.preventDefault();
    if (evt.shiftKey) {
        this.pdfViewer.previousPage();
    }
    else {
        this.pdfViewer.nextPage();
    }
}, _PDFPresentationMode_contextMenu = function _PDFPresentationMode_contextMenu() {
    this.contextMenuOpen = true;
}, _PDFPresentationMode_showControls = function _PDFPresentationMode_showControls() {
    if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout);
    }
    else {
        this.container.classList.add(CONTROLS_SELECTOR);
    }
    this.controlsTimeout = setTimeout(() => {
        this.container.classList.remove(CONTROLS_SELECTOR);
        delete this.controlsTimeout;
    }, DELAY_BEFORE_HIDING_CONTROLS);
}, _PDFPresentationMode_hideControls = function _PDFPresentationMode_hideControls() {
    if (!this.controlsTimeout) {
        return;
    }
    clearTimeout(this.controlsTimeout);
    this.container.classList.remove(CONTROLS_SELECTOR);
    delete this.controlsTimeout;
}, _PDFPresentationMode_resetMouseScrollState = function _PDFPresentationMode_resetMouseScrollState() {
    this.mouseScrollTimeStamp = 0;
    this.mouseScrollDelta = 0;
}, _PDFPresentationMode_touchSwipe = function _PDFPresentationMode_touchSwipe(evt) {
    if (!this.active) {
        return;
    }
    if (evt.touches.length > 1) {
        // Multiple touch points detected; cancel the swipe.
        this.touchSwipeState = null;
        return;
    }
    switch (evt.type) {
        case "touchstart":
            this.touchSwipeState = {
                startX: evt.touches[0].pageX,
                startY: evt.touches[0].pageY,
                endX: evt.touches[0].pageX,
                endY: evt.touches[0].pageY,
            };
            break;
        case "touchmove":
            if (this.touchSwipeState === null) {
                return;
            }
            this.touchSwipeState.endX = evt.touches[0].pageX;
            this.touchSwipeState.endY = evt.touches[0].pageY;
            // Avoid the swipe from triggering browser gestures (Chrome in
            // particular has some sort of swipe gesture in fullscreen mode).
            evt.preventDefault();
            break;
        case "touchend":
            if (this.touchSwipeState === null) {
                return;
            }
            let delta = 0;
            const dx = this.touchSwipeState.endX - this.touchSwipeState.startX;
            const dy = this.touchSwipeState.endY - this.touchSwipeState.startY;
            const absAngle = Math.abs(Math.atan2(dy, dx));
            if (Math.abs(dx) > SWIPE_MIN_DISTANCE_THRESHOLD &&
                (absAngle <= SWIPE_ANGLE_THRESHOLD ||
                    absAngle >= Math.PI - SWIPE_ANGLE_THRESHOLD)) {
                // Horizontal swipe.
                delta = dx;
            }
            else if (Math.abs(dy) > SWIPE_MIN_DISTANCE_THRESHOLD &&
                Math.abs(absAngle - Math.PI / 2) <= SWIPE_ANGLE_THRESHOLD) {
                // Vertical swipe.
                delta = dy;
            }
            if (delta > 0) {
                this.pdfViewer.previousPage();
            }
            else if (delta < 0) {
                this.pdfViewer.nextPage();
            }
            break;
    }
}, _PDFPresentationMode_addWindowListeners = function _PDFPresentationMode_addWindowListeners() {
    this.showControlsBind = __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_showControls).bind(this);
    this.mouseDownBind = __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_mouseDown).bind(this);
    this.mouseWheelBind = __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_mouseWheel).bind(this);
    this.resetMouseScrollStateBind = __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_resetMouseScrollState).bind(this);
    this.contextMenuBind = __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_contextMenu).bind(this);
    this.touchSwipeBind = __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_touchSwipe).bind(this);
    window.addEventListener("mousemove", this.showControlsBind);
    window.addEventListener("mousedown", this.mouseDownBind);
    window.addEventListener("wheel", this.mouseWheelBind, { passive: false });
    window.addEventListener("keydown", this.resetMouseScrollStateBind);
    window.addEventListener("contextmenu", this.contextMenuBind);
    window.addEventListener("touchstart", this.touchSwipeBind);
    window.addEventListener("touchmove", this.touchSwipeBind);
    window.addEventListener("touchend", this.touchSwipeBind);
}, _PDFPresentationMode_removeWindowListeners = function _PDFPresentationMode_removeWindowListeners() {
    window.removeEventListener("mousemove", this.showControlsBind);
    window.removeEventListener("mousedown", this.mouseDownBind);
    window.removeEventListener("wheel", this.mouseWheelBind, {
        // @ts-ignore
        passive: false,
    });
    window.removeEventListener("keydown", this.resetMouseScrollStateBind);
    window.removeEventListener("contextmenu", this.contextMenuBind);
    window.removeEventListener("touchstart", this.touchSwipeBind);
    window.removeEventListener("touchmove", this.touchSwipeBind);
    window.removeEventListener("touchend", this.touchSwipeBind);
    delete this.showControlsBind;
    delete this.mouseDownBind;
    delete this.mouseWheelBind;
    delete this.resetMouseScrollStateBind;
    delete this.contextMenuBind;
    delete this.touchSwipeBind;
}, _PDFPresentationMode_fullscreenChange = function _PDFPresentationMode_fullscreenChange() {
    if ( /* isFullscreen = */document.fullscreenElement) {
        __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_enter).call(this);
    }
    else {
        __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_exit).call(this);
    }
}, _PDFPresentationMode_addFullscreenChangeListeners = function _PDFPresentationMode_addFullscreenChangeListeners() {
    this.fullscreenChangeBind = __classPrivateFieldGet(this, _PDFPresentationMode_instances, "m", _PDFPresentationMode_fullscreenChange).bind(this);
    window.addEventListener("fullscreenchange", this.fullscreenChangeBind);
}, _PDFPresentationMode_removeFullscreenChangeListeners = function _PDFPresentationMode_removeFullscreenChangeListeners() {
    window.removeEventListener("fullscreenchange", this.fullscreenChangeBind);
    delete this.fullscreenChangeBind;
};

const initialState = {
    isDocumentLoaded: false,
    pagesReady: false,
    url: null,
    numPages: 0,
    pageNumber: 0,
    scale: 0,
    scaleValue: "auto",
    pagesRotation: 0,
    spreadMode: SpreadMode.UNKNOWN,
    scrollMode: ScrollMode.UNKNOWN,
    documentOutline: null,
    attachments: new Map(),
    thumbnails: new Map(),
    thumbnailViews: new Map(),
    annotationEditorMode: AnnotationEditorType.NONE,
    pdfSlick: null,
};
const create = () => createStore((set, get) => (Object.assign(Object.assign({}, initialState), { _setThumbnailView: (pageNumber, view) => {
        const thumbnails = new Map(get().thumbnails);
        const thumbnailViews = new Map(get().thumbnailViews);
        const { canvasWidth: width, canvasHeight: height, scale, rotation, loaded, pageLabel, src = null, } = view;
        thumbnailViews.set(pageNumber, view);
        thumbnails.set(pageNumber, {
            pageNumber,
            width,
            height,
            scale,
            rotation,
            loaded,
            pageLabel,
            src,
        });
        set({ thumbnailViews, thumbnails });
    }, _setThumbnailsViews: (views) => {
        const thumbnailViews = new Map(views.map((view) => [view.id, view]));
        const thumbnails = new Map(views.map((view) => {
            const { canvasWidth: width, canvasHeight: height, scale, rotation, loaded, pageLabel, src = null, } = view;
            return [
                view.id,
                {
                    pageNumber: view.id,
                    width,
                    height,
                    scale,
                    rotation,
                    loaded,
                    pageLabel,
                    src,
                },
            ];
        }));
        set({ thumbnailViews, thumbnails });
    } })));

var _PDFSlick_instances, _PDFSlick_renderingQueue, _PDFSlick_container, _PDFSlick_viewerContainer, _PDFSlick_thumbsContainer, _PDFSlick_annotationMode, _PDFSlick_annotationEditorMode, _PDFSlick_initializePageLabels, _PDFSlick_parseDocumentInfo, _PDFSlick_parsePageSize, _PDFSlick_initInternalEventListeners, _PDFSlick_onDocumentReady, _PDFSlick_onRotationChanging, _PDFSlick_onSwitchSpreadMode, _PDFSlick_onSwitchScrollMode, _PDFSlick_onScaleChanging, _PDFSlick_onPageChanging, _PDFSlick_onPageRendered;
GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;
const US_PAGE_NAMES = {
    "8.5x11": "Letter",
    "8.5x14": "Legal",
};
const METRIC_PAGE_NAMES = {
    "297x420": "A3",
    "210x297": "A4",
};
function getPageName(size, isPortrait, pageNames) {
    const width = isPortrait ? size.width : size.height;
    const height = isPortrait ? size.height : size.width;
    return pageNames[`${width}x${height}`];
}
class PDFSlick {
    constructor({ container, viewer, thumbs, store = create(), options, }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        _PDFSlick_instances.add(this);
        _PDFSlick_renderingQueue.set(this, void 0);
        _PDFSlick_container.set(this, void 0);
        _PDFSlick_viewerContainer.set(this, void 0);
        _PDFSlick_thumbsContainer.set(this, void 0);
        this.downloadManager = null;
        this.findController = null;
        this.pdfPresentationMode = null;
        this.document = null;
        // options
        _PDFSlick_annotationMode.set(this, void 0);
        _PDFSlick_annotationEditorMode.set(this, void 0);
        __classPrivateFieldSet(this, _PDFSlick_container, container, "f");
        __classPrivateFieldSet(this, _PDFSlick_viewerContainer, viewer, "f");
        __classPrivateFieldSet(this, _PDFSlick_thumbsContainer, thumbs, "f");
        this.l10n = (_a = options === null || options === void 0 ? void 0 : options.l10n) !== null && _a !== void 0 ? _a : NullL10n;
        this.downloadManager = new DownloadManager();
        this.textLayerMode = (_b = options === null || options === void 0 ? void 0 : options.textLayerMode) !== null && _b !== void 0 ? _b : TextLayerMode.ENABLE;
        __classPrivateFieldSet(this, _PDFSlick_annotationMode, (_c = options === null || options === void 0 ? void 0 : options.annotationMode) !== null && _c !== void 0 ? _c : AnnotationMode.ENABLE_FORMS, "f");
        __classPrivateFieldSet(this, _PDFSlick_annotationEditorMode, (_d = options === null || options === void 0 ? void 0 : options.annotationEditorMode) !== null && _d !== void 0 ? _d : AnnotationEditorType.NONE, "f");
        this.removePageBorders = (_e = options === null || options === void 0 ? void 0 : options.removePageBorders) !== null && _e !== void 0 ? _e : false;
        this.singlePageViewer = (_f = options === null || options === void 0 ? void 0 : options.singlePageViewer) !== null && _f !== void 0 ? _f : false;
        this.enablePrintAutoRotate = (_g = options === null || options === void 0 ? void 0 : options.enablePrintAutoRotate) !== null && _g !== void 0 ? _g : false;
        this.useOnlyCssZoom = (_h = options === null || options === void 0 ? void 0 : options.useOnlyCssZoom) !== null && _h !== void 0 ? _h : false;
        this.pageColors = (_j = options === null || options === void 0 ? void 0 : options.pageColors) !== null && _j !== void 0 ? _j : null;
        this.maxCanvasPixels = (_k = options === null || options === void 0 ? void 0 : options.maxCanvasPixels) !== null && _k !== void 0 ? _k : 16777216;
        this.printResolution = (_l = options === null || options === void 0 ? void 0 : options.printResolution) !== null && _l !== void 0 ? _l : 72;
        this.thumbnailWidth = (_m = options === null || options === void 0 ? void 0 : options.thumbnailWidth) !== null && _m !== void 0 ? _m : 125;
        if (this.pageColors &&
            !(CSS.supports("color", this.pageColors.background) &&
                CSS.supports("color", this.pageColors.foreground))) {
            if (this.pageColors.background || this.pageColors.foreground) {
                console.warn("PDFViewer: Ignoring `pageColors`-option, since the browser doesn't support the values used.");
            }
            this.pageColors = null;
        }
        this.l10n = NullL10n;
        this.store = store;
        const renderingQueue = new PDFRenderingQueue();
        renderingQueue.onIdle = this._cleanup.bind(this);
        renderingQueue.isThumbnailViewEnabled = true;
        __classPrivateFieldSet(this, _PDFSlick_renderingQueue, renderingQueue, "f");
        const eventBus = new EventBus();
        const linkService = new PDFLinkService({
            eventBus,
            externalLinkTarget: 2,
            externalLinkRel: "noopener noreferrer nofollow",
            ignoreDestinationZoom: false,
        });
        new PDFHistory({ eventBus, linkService });
        const viewerOptions = Object.assign(Object.assign({ container }, (viewer && { viewer })), { eventBus,
            linkService,
            renderingQueue, defaultRenderingQueue: true, textLayerMode: this.textLayerMode, l10n: this.l10n, annotationMode: __classPrivateFieldGet(this, _PDFSlick_annotationMode, "f"), annotationEditorMode: __classPrivateFieldGet(this, _PDFSlick_annotationEditorMode, "f"), removePageBorders: this.removePageBorders, imageResourcesPath: "/images/", useOnlyCssZoom: this.useOnlyCssZoom });
        const pdfViewer = this.singlePageViewer
            ? new PDFSinglePageViewer(viewerOptions)
            : new PDFViewer(viewerOptions);
        renderingQueue.setViewer(pdfViewer);
        if (thumbs) {
            this.thumbnailViewer = new PDFThumbnailViewer({
                container: thumbs,
                eventBus,
                linkService,
                renderingQueue,
                l10n: this.l10n,
                pageColors: this.pageColors,
                store: store,
                thumbnailWidth: this.thumbnailWidth,
            });
            renderingQueue.setThumbnailViewer(this.thumbnailViewer);
        }
        if (document.fullscreenEnabled) {
            this.pdfPresentationMode = new PDFPresentationMode({
                container,
                pdfViewer: pdfViewer,
                eventBus,
            });
        }
        this.eventBus = eventBus;
        this.linkService = linkService;
        this.viewer = pdfViewer;
        this.linkService.setViewer(pdfViewer);
        const scaleValue = (_o = options === null || options === void 0 ? void 0 : options.scaleValue) !== null && _o !== void 0 ? _o : "auto";
        this.store.setState({ scaleValue });
    }
    loadDocument(url, options) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.url) {
                try {
                    URL.revokeObjectURL(this.url.toString());
                }
                catch (err) { }
            }
            (_a = this.document) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = this.viewer) === null || _b === void 0 ? void 0 : _b.cleanup();
            this.url = url.toString();
            const filename = (_c = options === null || options === void 0 ? void 0 : options.filename) !== null && _c !== void 0 ? _c : getPdfFilenameFromUrl((_d = this.url) === null || _d === void 0 ? void 0 : _d.toString());
            this.filename = filename;
            const pdfDocument = yield getDocument({ url }).promise;
            this.document = pdfDocument;
            this.viewer.setDocument(this.document);
            this.linkService.setDocument(this.document);
            if (this.thumbnailViewer) {
                (_e = this.thumbnailViewer) === null || _e === void 0 ? void 0 : _e.setDocument(pdfDocument);
            }
            __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_initInternalEventListeners).call(this);
            yield __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_initializePageLabels).call(this);
            this.store.setState({
                filename,
                numPages: pdfDocument.numPages,
                pageNumber: 1,
                isDocumentLoaded: true,
                url: url.toString(),
            });
            const rawAttachments = (yield pdfDocument.getAttachments());
            const attachments = new Map(Object.keys(rawAttachments !== null && rawAttachments !== void 0 ? rawAttachments : {})
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .map((key) => [key, rawAttachments[key]]));
            this.store.setState({ attachments });
            yield __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_parseDocumentInfo).call(this);
            this.forceRendering();
        });
    }
    forceRendering(isThumbnailViewEnabled = true) {
        __classPrivateFieldGet(this, _PDFSlick_renderingQueue, "f").printing = !!this.printService;
        __classPrivateFieldGet(this, _PDFSlick_renderingQueue, "f").isThumbnailViewEnabled = isThumbnailViewEnabled;
        // @ts-ignore
        __classPrivateFieldGet(this, _PDFSlick_renderingQueue, "f").renderHighestPriority();
    }
    gotoPage(pageNumber) {
        this.linkService.goToPage(pageNumber);
    }
    openOrDownloadData(element, content, filename) {
        var _a;
        (_a = this.downloadManager) === null || _a === void 0 ? void 0 : _a.openOrDownloadData(element, content, filename);
    }
    download() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.url;
            const { filename } = this;
            try {
                // this._ensureDownloadComplete();
                const data = yield this.document.getData();
                const blob = new Blob([data], { type: "application/pdf" });
                yield ((_a = this.downloadManager) === null || _a === void 0 ? void 0 : _a.download(blob, url, filename, {}));
            }
            catch (reason) {
                // When the PDF document isn't ready, or the PDF file is still
                // downloading, simply download using the URL.
                yield ((_b = this.downloadManager) === null || _b === void 0 ? void 0 : _b.downloadUrl(url, filename, {}));
            }
        });
    }
    save() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // if (this._saveInProgress) return;
            // this._saveInProgress = true;
            // await this.pdfScriptingManager.dispatchWillSave();
            const url = this.url;
            const { filename } = this;
            try {
                // this._ensureDownloadComplete();
                const data = yield this.document.saveDocument();
                const blob = new Blob([data], { type: "application/pdf" });
                yield ((_a = this.downloadManager) === null || _a === void 0 ? void 0 : _a.download(blob, url, filename, {}));
            }
            catch (reason) {
                // When the PDF document isn't ready, or the PDF file is still
                // downloading, simply fallback to a "regular" download.
                console.error(`Error when saving the document: ${reason.message}`);
                yield this.download();
            }
            finally {
                // await this.pdfScriptingManager.dispatchDidSave();
                // this._saveInProgress = false;
            }
        });
    }
    downloadOrSave() {
        var _a;
        const { annotationStorage } = (_a = this.document) !== null && _a !== void 0 ? _a : {};
        if (annotationStorage && annotationStorage.size > 0) {
            this.save();
        }
        else {
            this.download();
        }
    }
    get supportsPrinting() {
        return PDFPrintServiceFactory.instance.supportsPrinting;
    }
    beforePrint() {
        // this._printAnnotationStoragePromise = this.pdfScriptingManager
        //   .dispatchWillPrint()
        //   .catch(() => {
        //     /* Avoid breaking printing; ignoring errors. */
        //   })
        //   .then(() => {
        //     return this.document?.annotationStorage.print;
        //   });
        if (this.printService) {
            // There is no way to suppress beforePrint/afterPrint events,
            // but PDFPrintService may generate double events -- this will ignore
            // the second event that will be coming from native window.print().
            return;
        }
        if (!this.supportsPrinting) {
            // this.l10n.get("printing_not_supported").then(msg => {
            //   this._otherError(msg);
            // });
            return;
        }
        // The beforePrint is a sync method and we need to know layout before
        // returning from this method. Ensure that we can get sizes of the pages.
        if (!this.viewer.pageViewsReady) {
            this.l10n.get("printing_not_ready").then((msg) => {
                // eslint-disable-next-line no-alert
                window.alert(msg);
            });
            return;
        }
        const pagesOverview = this.viewer.getPagesOverview();
        const printContainer = document.getElementById("printContainer");
        const printResolution = this.printResolution;
        const optionalContentConfigPromise = this.viewer.optionalContentConfigPromise;
        const printService = PDFPrintServiceFactory.instance.createPrintService(this.document, pagesOverview, printContainer, printResolution, optionalContentConfigPromise, null, // this._printAnnotationStoragePromise,
        this.l10n);
        this.printService = printService;
        this.forceRendering();
        // Disable the editor-indicator during printing (fixes bug 1790552).
        // this.setTitle();
        printService.layout();
        // if (this._hasAnnotationEditors) {
        //   this.externalServices.reportTelemetry({
        //     type: "editing",
        //     data: { type: "print" },
        //   });
        // }
    }
    afterPrint() {
        // if (this._printAnnotationStoragePromise) {
        //   this._printAnnotationStoragePromise.then(() => {
        //     this.pdfScriptingManager.dispatchDidPrint();
        //   });
        //   this._printAnnotationStoragePromise = null;
        // }
        var _a;
        if (this.printService) {
            this.printService.destroy();
            this.printService = null;
            (_a = this.document) === null || _a === void 0 ? void 0 : _a.annotationStorage.resetModified();
        }
        this.forceRendering();
        // Re-enable the editor-indicator after printing (fixes bug 1790552).
        // this.setTitle();
    }
    requestPresentationMode() {
        var _a;
        (_a = this.pdfPresentationMode) === null || _a === void 0 ? void 0 : _a.request();
    }
    triggerPrinting() {
        if (!this.supportsPrinting) {
            return;
        }
        window.print();
    }
    _cleanup() {
        var _a;
        if (!this.document) {
            return; // run cleanup when document is loaded
        }
        try {
            this.viewer.cleanup();
            (_a = this.thumbnailViewer) === null || _a === void 0 ? void 0 : _a.cleanup();
            this.document.cleanup();
        }
        catch (reason) {
            console.error("Unable to perform cleanup", reason);
        }
    }
    setAnnotationEditorMode(annotationEditorMode) {
        // @ts-ignore: agr updated to { mode: number, editId: null } see: https://github.com/mozilla/pdf.js/commit/5c5f9af803187d616703c19987eca5d7d39d9420
        this.viewer.annotationEditorMode = { mode: annotationEditorMode };
        this.store.setState({ annotationEditorMode });
    }
    setAnnotationEditorParams(annotationEditorParams) {
        const pairs = Array.isArray(annotationEditorParams)
            ? annotationEditorParams
            : [annotationEditorParams];
        for (const params of pairs) {
            this.viewer.annotationEditorParams = params;
        }
    }
    setSpreadMode(spread) {
        if (isValidSpreadMode(spread)) {
            this.viewer.spreadMode = spread;
            this.dispatch("switchspreadmode", { mode: spread });
        }
    }
    setScrollMode(scroll) {
        if (isValidScrollMode(scroll)) {
            this.viewer.scrollMode = scroll;
            this.dispatch("switchscrollmode", { mode: scroll });
        }
    }
    setRotation(rotation) {
        if (isValidRotation(rotation)) {
            this.viewer.pagesRotation = rotation;
        }
    }
    getPagesOverview() {
        var _a, _b;
        try {
            const pagesOverview = (_b = (_a = this.viewer) === null || _a === void 0 ? void 0 : _a.getPagesOverview()) !== null && _b !== void 0 ? _b : [];
            return pagesOverview;
        }
        catch (reason) {
            return [];
        }
    }
    /**
     * Zoom In
     */
    increaseScale() {
        this.viewer.increaseScale();
    }
    /**
     * Zoom out
     */
    decreaseScale() {
        this.viewer.decreaseScale();
    }
    /**
     * Set preset value ("auto", "page-width" wtc)
     */
    set currentScaleValue(val) {
        this.viewer.currentScaleValue = val;
    }
    /**
     * Set viewer's scale to a number value
     */
    set currentScale(val) {
        this.viewer.currentScale = val;
    }
    getPageView(ix) {
        return this.viewer.getPageView(ix);
    }
    /**
     * Add event listener on the pdfViewer eventBus
     * @param eventName TEventBusName
     * @param listener TEventBusListener
     * @param options TEventBusOptions
     */
    on(eventName, listener, options) {
        this.eventBus.on(eventName, listener, options);
    }
    /**
     * Remove event listener from the pdfViewer eventBus
     * @param eventName TEventBusName
     * @param listener TEventBusListener
     * @param options TEventBusOptions
     */
    off(eventName, listener, options) {
        this.eventBus.off(eventName, listener, options);
    }
    /**
     * Dispatch event on teh eventBus
     * @param eventName TEventBusName
     * @param data Object
     */
    dispatch(eventName, data) {
        this.eventBus.dispatch(eventName, data);
    }
}
_PDFSlick_renderingQueue = new WeakMap(), _PDFSlick_container = new WeakMap(), _PDFSlick_viewerContainer = new WeakMap(), _PDFSlick_thumbsContainer = new WeakMap(), _PDFSlick_annotationMode = new WeakMap(), _PDFSlick_annotationEditorMode = new WeakMap(), _PDFSlick_instances = new WeakSet(), _PDFSlick_initializePageLabels = function _PDFSlick_initializePageLabels() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const pdfDocument = this.document;
        const labels = (_a = (yield pdfDocument.getPageLabels())) !== null && _a !== void 0 ? _a : [];
        const numLabels = labels.length;
        // Ignore page labels that correspond to standard page numbering,
        // or page labels that are all empty.
        let standardLabels = 0, emptyLabels = 0;
        for (let i = 0; i < numLabels; i++) {
            const label = labels[i];
            if (label === (i + 1).toString()) {
                standardLabels++;
            }
            else if (label === "") {
                emptyLabels++;
            }
            else {
                break;
            }
        }
        if (standardLabels >= numLabels || emptyLabels >= numLabels) {
            return;
        }
        const { viewer: pdfViewer, thumbnailViewer: pdfThumbnailViewer } = this;
        pdfViewer.setPageLabels(labels);
        pdfThumbnailViewer === null || pdfThumbnailViewer === void 0 ? void 0 : pdfThumbnailViewer.setPageLabels(labels);
    });
}, _PDFSlick_parseDocumentInfo = function _PDFSlick_parseDocumentInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const { info, contentLength } = (yield this.document.getMetadata());
        const pageSize = yield this.document.getPage(this.store.getState().pageNumber).then((pdfPage) => {
            return __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_parsePageSize).call(this, getPageSizeInches(pdfPage), 0);
        });
        this.store.setState({
            filesize: contentLength,
            title: info.Title,
            author: info.Author,
            subject: info.Subject,
            keywords: info.Keywords,
            creator: info.Creator,
            producer: info.Producer,
            version: info.PDFFormatVersion,
            creationDate: PDFDateString.toDateObject(info.CreationDate),
            modificationDate: PDFDateString.toDateObject(info.ModDate),
            isLinearized: info.IsLinearized,
            pageSize,
        });
    });
}, _PDFSlick_parsePageSize = function _PDFSlick_parsePageSize(pageSizeInches, pagesRotation) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pageSizeInches) {
            return undefined;
        }
        // Take the viewer rotation into account as well; compare with Adobe Reader.
        if (pagesRotation % 180 !== 0) {
            pageSizeInches = {
                width: pageSizeInches.height,
                height: pageSizeInches.width,
            };
        }
        const isPortrait = isPortraitOrientation(pageSizeInches);
        let sizeInches = {
            width: Math.round(pageSizeInches.width * 100) / 100,
            height: Math.round(pageSizeInches.height * 100) / 100,
        };
        // 1in == 25.4mm; no need to round to 2 decimals for millimeters.
        let sizeMillimeters = {
            width: Math.round(pageSizeInches.width * 25.4 * 10) / 10,
            height: Math.round(pageSizeInches.height * 25.4 * 10) / 10,
        };
        let rawName = getPageName(sizeInches, isPortrait, US_PAGE_NAMES) ||
            getPageName(sizeMillimeters, isPortrait, METRIC_PAGE_NAMES);
        if (!rawName &&
            !(Number.isInteger(sizeMillimeters.width) &&
                Number.isInteger(sizeMillimeters.height))) {
            // Attempt to improve the page name detection by falling back to fuzzy
            // matching of the metric dimensions, to account for e.g. rounding errors
            // and/or PDF files that define the page sizes in an imprecise manner.
            const exactMillimeters = {
                width: pageSizeInches.width * 25.4,
                height: pageSizeInches.height * 25.4,
            };
            const intMillimeters = {
                width: Math.round(sizeMillimeters.width),
                height: Math.round(sizeMillimeters.height),
            };
            // Try to avoid false positives, by only considering "small" differences.
            if (Math.abs(exactMillimeters.width - intMillimeters.width) < 0.1 &&
                Math.abs(exactMillimeters.height - intMillimeters.height) < 0.1) {
                rawName = getPageName(intMillimeters, isPortrait, METRIC_PAGE_NAMES);
                if (rawName) {
                    // Update *both* sizes, computed above, to ensure that the displayed
                    // dimensions always correspond to the detected page name.
                    sizeInches = {
                        width: Math.round((intMillimeters.width / 25.4) * 100) / 100,
                        height: Math.round((intMillimeters.height / 25.4) * 100) / 100,
                    };
                    sizeMillimeters = intMillimeters;
                }
            }
        }
        const [{ width, height }, unit, name, orientation] = yield Promise.all([
            sizeInches ,
            this.l10n.get(`document_properties_page_size_unit_${"inches" }`),
            rawName &&
                this.l10n.get(`document_properties_page_size_name_${rawName.toLowerCase()}`),
            this.l10n.get(`document_properties_page_size_orientation_${isPortrait ? "portrait" : "landscape"}`),
        ]);
        return {
            width: width.toLocaleString(),
            height: height.toLocaleString(),
            unit,
            name,
            orientation,
        };
    });
}, _PDFSlick_initInternalEventListeners = function _PDFSlick_initInternalEventListeners() {
    this.eventBus._on("pagesinit", __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_onDocumentReady).bind(this));
    this.eventBus._on("scalechanging", __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_onScaleChanging).bind(this));
    this.eventBus._on("pagechanging", __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_onPageChanging).bind(this));
    this.eventBus._on("pagerendered", __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_onPageRendered).bind(this));
    this.eventBus._on("rotationchanging", __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_onRotationChanging).bind(this));
    this.eventBus._on("switchspreadmode", __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_onSwitchSpreadMode).bind(this));
    this.eventBus._on("switchscrollmode", __classPrivateFieldGet(this, _PDFSlick_instances, "m", _PDFSlick_onSwitchScrollMode).bind(this));
    this.eventBus._on("beforeprint", this.beforePrint.bind(this));
    this.eventBus._on("afterprint", this.afterPrint.bind(this));
    window.onbeforeprint = (e) => {
        this.eventBus.dispatch("beforeprint", { source: window });
    };
    window.onafterprint = (e) => {
        this.eventBus.dispatch("afterprint", { source: window });
    };
}, _PDFSlick_onDocumentReady = function _PDFSlick_onDocumentReady({ source }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const documentOutline = (yield ((_a = this.document) === null || _a === void 0 ? void 0 : _a.getOutline()));
        const scaleValue = this.store.getState().scaleValue;
        // source._setScale(scaleValue, {}); // page-fit, page-actual, auto, page-width
        source.currentScale = 1;
        source.currentScaleValue = "auto";
        this.store.setState({
            documentOutline,
            pageNumber: 1,
            scaleValue,
            pagesReady: true,
        });
    });
}, _PDFSlick_onRotationChanging = function _PDFSlick_onRotationChanging({ pagesRotation, pageNumber }) {
    this.store.setState({ pagesRotation });
    if (this.thumbnailViewer) {
        this.thumbnailViewer.pagesRotation = pagesRotation;
    }
    this.forceRendering();
    // Ensure that the active page doesn't change during rotation.
    this.viewer.currentPageNumber = pageNumber;
}, _PDFSlick_onSwitchSpreadMode = function _PDFSlick_onSwitchSpreadMode({ mode: spreadMode }) {
    this.store.setState({ spreadMode });
}, _PDFSlick_onSwitchScrollMode = function _PDFSlick_onSwitchScrollMode({ mode: scrollMode }) {
    this.store.setState({ scrollMode });
}, _PDFSlick_onScaleChanging = function _PDFSlick_onScaleChanging({ scale, presetValue: scaleValue }) {
    this.store.setState({ scale, scaleValue });
    this.viewer.update();
}, _PDFSlick_onPageChanging = function _PDFSlick_onPageChanging({ pageNumber }) {
    var _a;
    (_a = this.thumbnailViewer) === null || _a === void 0 ? void 0 : _a.scrollThumbnailIntoView(pageNumber);
    this.store.setState({ pageNumber });
}, _PDFSlick_onPageRendered = function _PDFSlick_onPageRendered({ pageNumber, error }) {
    var _a;
    // Use the rendered page to set the corresponding thumbnail image.
    if (__classPrivateFieldGet(this, _PDFSlick_thumbsContainer, "f")) {
        const pageView = this.viewer.getPageView(pageNumber - 1);
        const thumbnailView = (_a = this.thumbnailViewer) === null || _a === void 0 ? void 0 : _a.getThumbnail(pageNumber - 1);
        if (pageView && thumbnailView) {
            thumbnailView.setImage(pageView);
        }
    }
};

export { AutoPrintRegExp, CursorTool, DEFAULT_SCALE, DEFAULT_SCALE_DELTA, DEFAULT_SCALE_VALUE, MAX_AUTO_SCALE, MAX_SCALE, MIN_SCALE, OutputScale, PDFSlick, PresentationModeState, ProgressBar, RendererType, RenderingStates, SCROLLBAR_PADDING, ScrollMode, SidebarView, SpreadMode, TextLayerMode, UNKNOWN_SCALE, VERTICAL_PADDING, animationStarted, apiPageLayoutToViewerModes, apiPageModeToSidebarView, approximateFraction, backtrackBeforeAllVisibleElements, binarySearchFirstItem, create, docStyle, getActiveOrFocusedElement, getPageSizeInches, getVisibleElements, initialState, isPortraitOrientation, isValidRotation, isValidScrollMode, isValidSpreadMode, noContextMenuHandler, normalizeWheelEventDelta, normalizeWheelEventDirection, parseQueryString, removeNullCharacters, roundToDivide, scrollIntoView, watchScroll };
