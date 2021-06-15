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


    const textFirstPopup = 'Hey, das ist ja gar nicht das Nürnberg Digital Festival! Da hat mich der Taxifahrer wohl am falschen Ort abgesetzt.\n\n[Tutorial folgen (~10 Minuten) oder überspringen?]';

    multiStrandedPopupConversation({
        zone: "start-popup",
        blocking: true,
        onlyOnce: true,
        data: [{
            message: textFirstPopup,
            buttons: ["Folgen.", {
                        buttonText: "Überspringen",
                        onclick: () => {
                            WA.open("https://zoom.us/download")
                        }
        }]
    })

    // popupInZone({
    //     popupText: textFirstPopup,
    //     blocking: true,
    //     onlyOnce: true,
    //     zone: "start-popup",
    //     popupOptions: [{
    //         label: "Hmpf."
    //     }]
    // })

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////                                2                                   //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let callPlayerPopupIndex = 0

    popupInZone({
        zone: "call-player",
        openCondition: () => callPlayerPopupIndex++ == 0,
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
                WA.sendChatMessage("先海空去場劇國", "Tourist #1"),
                setTimeout(() => {
                    WA.sendChatMessage("Kia bela vido!", "Tourist #2"),
                }, 4000)
                setTimeout(() => {
                    WA.sendChatMessage("Je ne comprends pas un mot !", "Tourist #3")
                }, 8000)
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
            text: "... und ehe ich mich versah, stand ich schon hier. Hast du zufällig eine Badehose für mich?",
            option: "Leider nein."
        }, {
            text: "Okay, dann schaue ich mal, ob ich hier links oben im Menü unter ‚Edit Skin‘ etwas Passendes finde.",
            option: "Viel Glück! Ich muss dann mal ..."
        }]
    })
})
