/// <reference path="../script/script-loader.js" />

scriptNesting(
    Promise.all([
        require("../script/conversation"),
        require("./menu-item")
    ]),
    async (imps) => {
        const [{ multiStrandedPopupConversation }] = await imps

        multiStrandedPopupConversation({
            zone: "lines",
            blocking: true,
            data: [{
                message: "Hmmmm. Diese Linien auf dem Boden haben doch sicher etwas zu bedeuten.",
                buttons: "Ich folge ihnen besser mal."
            }]
        })

        multiStrandedPopupConversation({
            zone: "yellow-line",
            blocking: true,
            data: [{
                message: "Hi! Schön, dass du hier bist. Das Festival beginnt bald, weißt du schon über die verschiedenen Veranstaltungsorte Bescheid?",
                buttons: "Nee, erzähl!"
            }, {
                message: "Es gibt drei Arten von Veranstaltungsorten: Stages, Studios und Rooms – dazu einfach den Linien am Boden folgen.",
                buttons: "Aha."
            }, {
                message: "Je nach Ort finden Veranstaltung entweder als Livestream, als Session mit Bühne oder als Gruppen-Videochat statt. Das siehst du dann schon.",
                buttons: "Okay, danke. Ciao!"
            }]
        })

        multiStrandedPopupConversation({
            zone: "blue-line",
            blocking: true,
            data: [
                {
                    message: "Hi. Du hast das mit den verschiedenen Räumen ja schon gehört – sehr gut!",
                    buttons: "Und?"
                }, {
                    message: "Wichtig dabei: Manchmal nutzen wir in den Räumen Zoom – check doch mal bitte, ob du Zoom installiert hast!",
                    buttons: ["Hab ich!", {
                        buttonText: "Zoom installieren!",
                        onclick: () => {
                            WA.openTab("https://zoom.us/download")
                        }
                    }]
                }, {
                    message: "Alles andere läuft direkt hier im Browser – darunter Jitsi, Sponsoren-Webseiten oder die Programmübersicht. Hier links am Whiteboard kannst du das mal ausprobieren.",
                    buttons: [{
                        buttonText: "Mach ich. Danke.",

                    }]
                }
            ]
        })

        multiStrandedPopupConversation({
            zone: "npc-05",
            blocking: true,
            data: [{
                message: "Hey du! Ja, du!",
                buttons: "Ich?"
            }, {
                message: "Bevor du da rein gehst: In jedem Festival- Bereiche gibt es Stellen, an denen du mit Anderen sprechen kannst – und Stellen, an denen diese Funktion deaktiviert ist.",
                buttons: "Sonst noch was?"
            }, {
                message: "Ich habe noch drei Tipps für dich: 1. Erkunde die Welt, es gibt einiges zu entdecken! 2. Unterhalte dich mit Anderen, das Festival lebt vom Austausch! 3. Hab Spaß!",
                buttons: "Merke ich mir. Ciao!"
            }]
        })
    });
