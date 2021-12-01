// import { bootstrapExtra } from "@workadventure/scripting-api-extra";
// // Calling bootstrapExtra will initiliaze all the "custom properties"
// bootstrapExtra();
// let helloWorldPopup;
// WA.chat.sendChatMessage('Hello world', 'Mr Robot');
//
// // Open the popup when we enter a given zone
// helloWorldPopup = WA.room.onEnterLayer("hints").subscribe(() => {
//     WA.ui.openPopup("hintRoom1", 'Hello world!', [{
//         label: "Close",
//         className: "primary",
//         callback: (popup) => {
//             // Close the popup when the "Close" button is pressed.
//             popup.close();
//         }
//     }]);
// });
//
// // Close the popup when we leave the zone.
// WA.room.onLeaveLayer("hints").subscribe(() => {
//     helloWorldPopup.close();
// });

// import {popupInZone} from "../script/popup-zone";
//
// let options1 = {
//         zone: "hints",
//         popupText: "Test Hint!",
//         objectLayerName: "hintRoom1",
//
//     }
//
// -popupInZone(options1);
scriptNesting(Promise.all([
    require("../script/popup-zone"),
    require("../script/conversation"),
    require("./menu-item"),
    new Promise(res => setTimeout(res, 1500))
]), async imports => {
    popupInZone({
        popupText: "TEST TEST TEST",
        blocking: true,
        onlyOnce: false,
        zone: "hints",
        objectLayerName: "hintRoom1"
    })
})