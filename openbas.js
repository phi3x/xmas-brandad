///<reference path="../workadventure/front/src/iframe_api.ts" />
/**
 * 
 * @param {{
 *    zone:string,
 *    message:string,
 *    onActivate:()=>void
 * }} options 
 */
function activationInZone(options) {
    let messageObj;
    WA.onEnterZone(options.zone, () => {
        messageObj = WA.triggerMessage(options.message, options.onActivate)
    })

    WA.onLeaveZone(options.zone, () => {
        if(messageObj) {
            WA.removeTriggerMessage(messageObj)
            messageObj = undefined
        }
    })
}



activationInZone({
    zone: "timestamp",
    message: "press 'space' to record time",
    onActivate: () => {
        const parts = [["https", 'sapserver-master'].join('://'), 'abnahme', "brandad", "de"]
        WA.nav.openCoWebSite(parts.join("."))
    }
})

WA.registerMenuCommand('miro', () => {
    WA.nav.openCoWebSite('https://jonnytest1.github.io/workadventuremap/scripts/pages/miro.html');
});