var isFirstTimeTuto = false;
var textFirstPopup = 'Hey, das ist ja gar nicht das Nürnberg Digital Festival! Da hat mich der Taxifahrer wohl am falschen Ort abgesetzt';
var textSecondPopup = 'Sehr gut, du hast das mit den Kreisen verstanden – so kommunizierst du hier im Workadventure mit anderen Menschen'
var targetObjectTutoEinfuehrung ='tutoEinfuehrung';
var targetObjectTutoKreise ='tutoKreise';
var targetObjectTutoExplanation ='tutoExplanation';
var popUpExplanation = undefined;

function launchTuto (){
    WA.openPopup(targetObjectTutoEinfuehrungg, textFirstPopup, [
        {
            label: "Hmpf.",
            className: "popUpElement",
            callback: (popup) => {
                popup.close();

        ]);
}

function launchTuto (){
    WA.openPopup(targetObjectTutoKreise, textFirstPopup, [
        {
            label: "Hmpf.",
            className: "popUpElement",
            callback: (popup) => {
                popup.close();

        ]);
    WA.disablePlayerControl();

}

WA.onEnterZone('popupZone', () => {
    WA.displayBubble();
    if (!isFirstTimeTuto) {
        isFirstTimeTuto = true;
        launchTuto();
    }
    else {
        popUpExplanation = WA.openPopup(targetObjectTutoExplanation, 'Do you want to review the explanation?', [
            {
                label: "No",
                className: "error",
                callback: (popup) => {
                    popup.close();
                }
            },
            {
                label: "Yes",
                className: "success",
                callback: (popup) => {
                    popup.close();
                    launchTuto();
                }
            }
        ])
    }
});

WA.onLeaveZone('popupZone', () => {
    if (popUpExplanation !== undefined) popUpExplanation.close();
    WA.removeBubble();
})
