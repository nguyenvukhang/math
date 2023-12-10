declare class OverlayManager {
    #private;
    get active(): HTMLDialogElement | null;
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @param {boolean} [canForceClose] - Indicates if opening the overlay closes
     *                  an active overlay. The default is `false`.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    registered.
     */
    register(dialog: HTMLDialogElement, canForceClose?: boolean): Promise<void>;
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    unregistered.
     */
    unregister(dialog: HTMLDialogElement): Promise<void>;
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    opened.
     */
    open(dialog: HTMLDialogElement): Promise<void>;
    /**
     * @param {HTMLDialogElement} dialog - The overlay's DOM element.
     * @returns {Promise} A promise that is resolved when the overlay has been
     *                    closed.
     */
    close(dialog?: HTMLDialogElement | null): Promise<void>;
}
export { OverlayManager };
//# sourceMappingURL=overlay_manager.d.ts.map