///<reference path="../../workadventure/front/src/iframe_api.ts" />
/// <reference path="../script/script-loader.js" />


scriptNesting(Promise.all([
    require("../script/popup-zone"),
    require("../script/conversation"),
    require("./menu-item"),
    new Promise(res => setTimeout(res, 1500))
]), async imports => {

    const [{ popupInZone }, { singleStrandedPopupConversation, multiStrandedPopupConversation }] = await imports

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////                                1                                   //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const textFirstPopup = 'Hey, das ist ja gar nicht das Nürnberg Digital Festival! Da hat mich der Taxifahrer wohl am falschen Ort abgesetzt';

    popupInZone({
        popupText: textFirstPopup,
        blocking: true,
        onlyOnce: true,
        zone: "start-popup",
        popupOptions: [{
            label: "Hmpf."
        }]
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////                                2                                   //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let callPlayerPopupIndex = 0

    popupInZone({
        zone: "call-player",
        openCondition: () => callPlayerPopupIndex == 0,
        popupText: 'Hallo, hier drüben! Komm doch mal kurz in meinen Kreis, damit ich mit dir sprechen kann!',
        initiallyOpened: true,
        popupOptions: []
    });


    singleStrandedPopupConversation({
        zone: "chat",
        blocking: true,
        withCircle: true,
        data: [{
            text: "Sehr gut, du hast das mit den Kreisen verstanden – so kommunizierst du hier im Workadventure mit anderen Menschen.",
            option: "Klar, bin ja nicht von gestern."
        }, {
            text: "In einem solchen Kreis können bis zu vier Leute miteinander videochatten.",
            option: 'Erzähl mir mehr!'
        }, {
            text: "Rechts unten auf deinem Bildschirm findest du dazu die Kamera- und Mikrofon-Einstellungen sowie die Bildschirm-Teilen-Funktion.",
            option: "Kapiert."
        }, {
            text: "Jetzt aber erstmal ein herzliches Willkommen auf der Nürnberger Burg – DEM Wahrzeichen der Stadt. Schau dich um und genieß die Aussicht!",
            option: "Mach ich."
        }]
    })

    multiStrandedPopupConversation({
        zone: "chat-expl",
        blocking: true,
        data: [{
            onDisplay: () => {
                WA.sendChatMessage("先海空去場劇國", "Tourist #1")
                setTimeout(() => {
                    WA.sendChatMessage("What a nice view! ", "Tourist #2")
                }, 3000)
            },
            message: "Ich verstehe zwar kein Wort – aber scheinbar gibt es hier auch eine Chatfunktion!",
            buttons: "Cool!",

        }]
    })

    singleStrandedPopupConversation({
        zone: "portal",
        blocking: true,
        data: [{
            text: "Ich weiß gar nicht, wie ich hierher gekommen bin. Da war auf einmal dieses Portal …",
            option: "Ein Portal?",
        }, {
            text: "... und ehe ich mich versah, stand ich schon hier. Mit meiner Badehose komme ich mir hier dann doch aber merkwürdig vor.",
            option: "Kein Shirt dabei?"
        }, {
            text: "Jetzt, wo du es sagst, fällt mir ein: Man kann hier einfach links oben auf das Menü klicken und unter ‚Edit Skin‘ das Aussehen verändern!",
            option: "Cool. Ich muss dann mal ..."
        }]
    })
})
