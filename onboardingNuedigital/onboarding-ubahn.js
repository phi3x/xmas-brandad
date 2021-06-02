const popupExplanationText = "Hi! Willkommen auf der Center Stage – wir setzen für die Events unterschiedliche Video-Konferenz-Techniken ein. Soll ich sie dir kurz erklären?";


const popupZone = "npc-05";

let clickedZoom = false;
let clickedJitsi = false;

let popupConditionCounter = 0

function createNpc5Popup(conversationcounter) {
    const popupButtons = [];
    if(!clickedZoom) {
        popupButtons.push({
            label: "Zoom",
            callback: (popup) => {
                popupConditionCounter = 1;
                clickedZoom = true;
                createNpc5Popup(1)
            }
        })
    }
    if(!clickedJitsi) {
        popupButtons.push({
            label: "Jitsi",
            callback: (popup) => {
                popupConditionCounter = 1;
                clickedJitsi = true;
                createNpc5Popup(1)
            }
        })
    }

    if(popupButtons.length) {
        popupInZone({
            zone: popupZone,
            popupText: popupExplanationText,
            blocking: true, initiallyOpened: conversationcounter > 0,
            openCondition: () => popupConditionCounter == conversationcounter,
            withCircle: true,
            popupOptions: popupButtons

        })
    } else {
        popupInZone({
            zone: popupZone,
            popupText: "Dann wünsche ich dir viel Spaß – solltest du noch weitere Fragen haben, links unten in diesem Raum ist ein Helpdesk!",
            blocking: true,
            openCondition: () => popupConditionCounter == conversationcounter,
            withCircle: true,
            popupOptions: [{
                label: "Danke !",
                callback: () => {

                }
            }]

        })
    }
}
createNpc5Popup(0)



/**
 * @param {{
 *    zone:string
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
            WA.disablePlayerControl();
        }
        if(options.withCircle) {
            WA.displayBubble();
        }
        lastOpened = Date.now();

        popup = WA.openPopup(options.objectLayerName, options.popupText, options.popupOptions.map(option => {
            const callback = option.callback;
            const popupOptions = {
                ...option,
                className: option.className || 'normal',
                callback: () => {
                    if(options.blocking) {
                        WA.restorePlayerControl();
                    }
                    if(options.withCircle) {
                        WA.removeBubble();
                    }
                    if(callback) {
                        callback(popup);
                    }
                    popup.close();
                    popup = undefined;
                }
            };

            return popupOptions;
        }));
    }



    WA.onEnterZone(options.zone, zoneEnter);
    WA.onLeaveZone(options.zone, () => {
        if(popup) {
            popup.close();
            popup = undefined;
        }
        if(options.withCircle) {
            WA.removeBubble()
        }
    });

    if(options.initiallyOpened) {
        zoneEnter();
    }
}