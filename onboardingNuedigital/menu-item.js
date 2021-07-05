/// <reference path="../../workadventure/front/src/iframe_api.ts" />

const skipTutorial = "/@/ucs/ucs/ndf_festival_zentral"

WA.registerMenuCommand("Skip Tutorial", () => {
   WA.nav.goToRoom(skipTutorial)
})
module.exports = {
    skipTutorial
}