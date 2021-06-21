///<reference path="../../workadventure/front/src/iframe_api.ts" />


/**
 * @typedef {{close:()=>void}} Popup
 */
module.exports = {
    popupInZone:
        /**
         * @param {{
         *   zone:string
         *    objectLayerName?:string,
         *    popupText:string,
         *    delay?:number
         *    blocking?:boolean,
         *    onlyOnce?:boolean
         *    openCondition?:()=>boolean
         *    withCircle?:boolean,
         *    initiallyOpened?:boolean
         *    popupOptions?:Array<{
         *      callback?:(popup)=>void,
         *      label:string,
         *      className?:"normal" | "primary" | "success" | "warning" | "error" | "disabled"
         *    }>
         * }} options
         */
        function popupInZone(options) {
            let lastOpened = 0;
            /**
             * @type {Popup}
             */
            let popup;
            if(!options.objectLayerName) {
                options.objectLayerName = options.zone;
            }
            if(!options.popupOptions) {
                options.popupOptions = []
            }

            function zoneEnter() {
                if(popup) {
                    return
                }
                if(options.delay) {
                    if(lastOpened + options.delay > Date.now()) {
                        return;
                    }
                }
                if(options.onlyOnce && lastOpened !== 0) {
                    return
                }
                if(options.openCondition && !options.openCondition()) {
                    return
                }
                if(options.blocking) {
                    WA.disablePlayerControls();
                }
                if(options.withCircle) {
                    WA.ui.displayBubble();
                }
                lastOpened = Date.now();

                popup = WA.ui.openPopup(options.objectLayerName, options.popupText, options.popupOptions.map(option => {
                    const callback = option.callback;
                    const popupOptions = {
                        ...option,
                        className: option.className || 'normal',
                        callback: () => {
                            try {
                                if(options.blocking) {
                                    WA.restorePlayerControls();
                                }
                                if(options.withCircle) {
                                    WA.ui.removeBubble();
                                }
                                if(callback) {
                                    callback(popup);
                                }
                                popup.close();
                                popup = undefined;
                            } catch(e) {
                                console.error(e)

                            }
                        }
                    };

                    return popupOptions;
                }));
            }



            WA.room.onEnterZone(options.zone, zoneEnter);
            WA.room.onLeaveZone(options.zone, () => {
                if(popup) {
                    popup.close();
                    popup = undefined;
                }
                if(options.withCircle) {
                    WA.ui.removeBubble()
                }
            });

            if(options.initiallyOpened) {
                zoneEnter();
            }
        }
};