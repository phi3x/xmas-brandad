var isFirstTimeTuto = false;
var textFirstPopup = 'Hey, das ist ja gar nicht das Nürnberg Digital Festival! Da hat mich der Taxifahrer wohl am falschen Ort abgesetzt';
var textSecondPopup = 'Hallo, hier drüben! Komm doch mal kurz in meinen Kreis, damit ich mit dir sprechen kann!'
var targetObjectTutoEinfuehrung ='tutoEinfuehrung';
var targetObjectTutoKreise ='tutoKreise';
var targetObjectTutoExplanation ='tutoExplanation';
var popUpExplanation = undefined;

WA.openPopup(targetObjectTutoEinfuehrung, textFirstPopup, [
        {
            label: "Hmpf",
            className: "popUpElement",
            callback: (popup) => {
                popup.close();
            }
        }
    ]);


WA.onLeaveZone('popupZone', () => {
    if (popUpExplanation !== undefined) popUpExplanation.close();
    WA.removeBubble();
})
