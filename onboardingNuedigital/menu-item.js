

const skipTutorial = "/_/global/brandad-systems.github.io/workadventure-maps/openbas.json"

WA.registerMenuCommand("Skip Tutorial", () => {
    WA.exitSceneTo(skipTutorial)
})
module.exports = {
    skipTutorial
}