/// <reference path="../../workadventure/front/src/iframe_api.ts" />

const skipTutorial = "/_/global/brandad-systems.github.io/workadventure-maps/openbas.json"

WA.registerMenuCommand("Skip Tutorial", () => {
    WA.goToRoom(skipTutorial)
})
module.exports = {
    skipTutorial
}