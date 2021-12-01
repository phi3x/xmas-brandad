import { bootstrapExtra } from "@workadventure/scripting-api-extra";
// Calling bootstrapExtra will initiliaze all the "custom properties"
bootstrapExtra();
let helloWorldPopup;

// Open the popup when we enter a given zone
helloWorldPopup = WA.room.onEnterLayer("hints").subscribe(() => {
    WA.ui.openPopup("hintRoom1", 'Hello world!', [{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("hints").subscribe(() => {
    helloWorldPopup.close();
});