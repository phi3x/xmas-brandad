/// <reference path="../script/script-loader.js" />

scriptNesting(
    require("../script/conversation"),
    async (imps) => {
        const { multiStrandedPopupConversation } = await imps

        multiStrandedPopupConversation({
            zone: "npc-05",
            blocking: true,
            withCircle: true,
            data: [{
                message: "Hi! Willkommen auf der Center Stage – wir setzen für die Events unterschiedliche Video-Konferenz-Techniken ein. Soll ich sie dir kurz erklären?",
                exhaustOptionsBeforeContinue: true,
                buttons: [{
                    buttonText: "Zoom",
                    onclick: () => {

                    }
                }, {
                    buttonText: "Jitsi",
                    onclick: () => { }
                }]
            }, {
                message: "Dann wünsche ich dir viel Spaß – solltest du noch weitere Fragen haben, links unten in diesem Raum ist ein Helpdesk!",
                buttons: "Danke !"
            }]
        })
    });
