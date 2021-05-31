///<reference path="../../workadventure/front/src/iframe_api.ts" />

var isFirstTimeTuto = false;

var targetObjectTutoEinfuehrung = 'tutoEinfuehrung';
var targetObjectTutoKreise = 'tutoKreise';
var targetObjectTutoExplanation = 'tutoExplanation';
var popUpExplanation = undefined;

/**
 * @param {{
 *    zone:string
 *    objectLayerName?:string,
 *    popupText:string,
 *    delay?:number
 blocking?:boolean,
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

/**
 * 
 * @param {{zone:string,withCircle?:boolean,blocking?:boolean,data:Array<{text:string,option:string,onclick?:()=>void}>}} options 
 */
function singleStrandPopupConversation(options) {
    let conversationIndex = 0

    function createPopup(index) {
        conversationIndex = Math.max(index, conversationIndex);
        popupInZone({
            zone: options.zone,
            blocking: options.blocking,
            withCircle: options.withCircle,
            popupText: options.data[index].text,
            initiallyOpened: index != 0,
            openCondition: () => conversationIndex == index,
            popupOptions: [{
                label: options.data[index].option,
                callback: () => {
                    if(options.data[index].onclick) {
                        options.data[index].onclick();
                    }
                    if(options.data[index + 1]) {
                        createPopup(index + 1);
                    }
                }
            }]
        });
    }
    createPopup(0);
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////                                1                                   //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const textFirstPopup = 'Hey, das ist ja gar nicht das Nürnberg Digital Festival! Da hat mich der Taxifahrer wohl am falschen Ort abgesetzt';


popupInZone({
    popupText: textFirstPopup,
    initiallyOpened: true,
    blocking: true,
    onlyOnce: true,
    zone: "start",
    popupOptions: [{
        label: "Hmpf."
    }]
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////                                2                                   //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let popupText = 0

popupInZone({
    zone: "call-player",
    openCondition: () => popupText == 0,
    popupText: 'Hallo, hier drüben! Komm doch mal kurz in meinen Kreis, damit ich mit dir sprechen kann!',
    initiallyOpened: true,
    popupOptions: []
});


singleStrandPopupConversation({
    zone: "chat",
    blocking: true,
    withCircle: true,
    data: [{
        text: "Sehr gut, du hast das mit den Kreisen verstanden – so kommunizierst du hier im Workadventure mit anderen Menschen.",
        option: "Klar, bin ja nicht von gestern."
    }, {
        text: "In einem solchen Kreis können vier Leute miteinander videochatten.",
        option: 'Erzähl mir mehr!'
    }, {
        text: "Rechts unten auf deinem Bildschirm findest du dazu die Kamera- und Mikrofon-Einstellungen sowie die Bildschirm-Teilen-Funktion.",
        option: "Kapiert."
    }, {
        text: "Jetzt aber erstmal ein herzliches Willkommen auf der Nürnberger Burg – DEM Wahrzeichen der Stadt. Schau dich um und genieß die Aussicht!",
        option: "Mach ich."
    }]
})

singleStrandPopupConversation({
    zone: "chat-expl",
    data: [{
        text: "先海空去場劇國；是賽可，通產業笑生十間故代乎放受，演問步麼五至做德們去簡集類境中辦小前地有國大教石留利國和想半",
        option: "Wie bitte?",
        onclick: () => {
            WA.sendChatMessage("先海空去場劇國", "Tourist #1")
            setTimeout(() => {
                WA.sendChatMessage("What a nice view! ", "Tourist #2")
            }, 3000)
        }

    }, {
        text: "(Ich glaube, die verstehen mich nicht.)",
        option: "Ich geh lieber weiter."
    }]
})

singleStrandPopupConversation({
    zone: "portal",
    blocking: true,
    data: [{
        text: "Ich weiß gar nicht, wie ich hierher gekommen bin. Da war auf einmal dieses Portal …",
        option: "in Portal?",
    }, {
        text: "... und ehe ich mich versah, stand ich schon hier. Mit meiner Badehose komme ich mir hier dann doch aber merkwürdig vor.",
        option: "Kein Shirt dabei?"
    }, {
        text: "Jetzt, wo du es sagst, fällt mir ein: Man kann hier einfach links oben auf das Menü klicken und unter ‚Edit Skin‘ das Aussehen verändern!",
        option: "Cool. Ich muss dann mal …"
    }]
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////                                3                                   //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////