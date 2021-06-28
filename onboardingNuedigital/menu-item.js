/// <reference path="../../workadventure/front/src/iframe_api.ts" />

const skipTutorial = "/_/global/andreasucs.github.io/ndf_festivalmap/map.json"

WA.registerMenuCommand("Skip Tutorial", () => {
   WA.nav.goToRoom(skipTutorial)
})
module.exports = {
    skipTutorial
}