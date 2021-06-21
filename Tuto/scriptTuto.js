var isFirstTimeTuto = false;
var textFirstPopup = 'Hey ! This is how to start a discussion with someone ! You can be 4 max in a bubble.';
var textSecondPopup = 'You can also use the chat to communicate ! ';
var targetObjectTutoBubble = 'Tutobubble';
var targetObjectTutoChat = 'tutoChat';
var targetObjectTutoExplanation = 'tutoExplanation';
var popUpExplanation = undefined;
function launchTuto() {
    WA.ui.openPopup(targetObjectTutoBubble, textFirstPopup, [
        {
            label: "Next",
            className: "popUpElement",
            callback: (popup) => {
                popup.close();

                WA.ui.openPopup(targetObjectTutoChat, textSecondPopup, [
                    {
                        label: "Open Chat",
                        className: "popUpElement",
                        callback: (popup1) => {
                            WA.chat.sendChatMessage("Hey you can talk here too!", 'WA Guide');
                            popup1.close();
                            WA.ui.openPopup("TutoFinal", "You are good to go! Go through the gate to meet the dev team and discover the features !", [
                                {
                                    label: "Got it!",
                                    className: "success", callback: (popup2 => {
                                        popup2.close();
                                        WA.restorePlayerControls();
                                    })
                                }
                            ])
                        }
                    }

                ])
            }
        }
    ]);
    WA.disablePlayerControls();

}


WA.room.onEnterZone('popupZone', () => {
    WA.displayBubble();
    if(!isFirstTimeTuto) {
        isFirstTimeTuto = true;
        launchTuto();
    }
    else {
        popUpExplanation = WA.ui.openPopup(targetObjectTutoExplanation, 'Do you want to review the explanation?', [
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

WA.room.onLeaveZone('popupZone', () => {
    if(popUpExplanation !== undefined) popUpExplanation.close();
    WA.ui.removeBubble();
})
