
const imports = Promise.all([require("./popup-zone")])

/**
 * @typedef {{
 *    zone:string,withCircle?:boolean,blocking?:boolean,data:Array<{text:string,option:string,onclick?:()=>void}>
 * }} SingleConversationOptions
 */

/**
 * 
 * @typedef {{
 *          buttonText:string,
 *          continuation?:ConversationButton
 *           _hasClicked?:boolean 
 *          onclick?:()=>void,
 *          _index?:number
 *      }} ButtonElement
 * 
 * @typedef {{
 *      message:string,
 *      onDisplay?:()=>void,
 *      resumeMainIndex?:boolean
 *      exhaustOptionsBeforeContinue?:boolean
 *      buttons:Array<ButtonElement|string>|string
 * }} ConversationButton _hasClicked=true wont show up
 */

/**
 * @typedef {{
 *    zone:string,
 *    withCircle?:boolean,
 *    blocking?:boolean,
 *    data:Array<ConversationButton>
 *    onfinish?:(options:MultiConversationOptions)=>void
 *    _conversationIndex?:Array<number|{exhaustedIndices:Array<number>}>
 * }} MultiConversationOptions
 */

/**
 * @param {SingleConversationOptions} options 
 */
async function singleStrandedPopupConversation(options) {
    const [{ popupInZone }] = await imports
    let conversationIndex = 0

    function createPopup(index) {
        conversationIndex = Math.max(index, conversationIndex);

        const currentIndexData = options.data[index];
        const popupOptions = [{
            label: currentIndexData.option,
            callback: () => {
                if(currentIndexData.onclick) {
                    currentIndexData.onclick();
                }
                if(options.data[index + 1]) {
                    createPopup(index + 1);
                }
            }
        }];
        popupInZone({
            zone: options.zone,
            blocking: options.blocking,
            withCircle: options.withCircle,
            popupText: currentIndexData.text,
            initiallyOpened: index != 0,
            openCondition: () => conversationIndex == index,
            popupOptions: popupOptions
        });
    }
    createPopup(0);
}

/**
 * @param {MultiConversationOptions} options 
 */
async function multiStrandedPopupConversation(options) {
    const [{ popupInZone }] = await imports
    options._conversationIndex = [0]

    /**
     * 
     * @param {Array<number>} indexArray 
     */
    function getForIndexArray(indexArray) {
        const indices = [...indexArray]

        let option = options.data[indices.shift()]

        for(let indexParam of indices) {
            let subButtons = option.buttons
            if(typeof subButtons == "string") {
                throw new Error("cannot get index of string")
            } else {
                const subButton = subButtons[indexParam]
                if(typeof subButton == "string") {
                    throw new Error("cannot get index of string")
                } else {
                    option = subButton.continuation
                }
            }

        }
        return option
    }

    /**
     * 
     * @param {Array<number|{exhaustedIndices:Array<number>}>} conversationPos 
     * @param {ConversationButton} [currentIndexData] 
     */
    function createPopup(conversationPos, currentIndexData) {
        const indexPos = options._conversationIndex.length - 1
        options._conversationIndex = conversationPos.map((val, index) => {
            const conversationPosObj = conversationPos[index]
            if(typeof conversationPosObj == "object" || typeof val == "object") {
                return conversationPosObj
            } else {
                return Math.max(conversationPosObj, val)
            }
        })
        /**
         * @type {Array<number>}
         */
        const conversationIndices = conversationPos.map(c => {
            if(typeof c == "number") {
                return c;
            }
            return undefined
        })
            .filter(c => c !== undefined)
        currentIndexData = currentIndexData || getForIndexArray(conversationIndices);

        if(currentIndexData == undefined) {
            if(options.onfinish) {
                options.onfinish(options)
            }
            return
        }
        const popupOptions = [];


        if(typeof currentIndexData.buttons == "string") {
            currentIndexData.buttons = [currentIndexData.buttons]
        }


        /**
        * @type {Array<ButtonElement>}
        */
        let buttons = currentIndexData.buttons = currentIndexData.buttons.map((alternative, index) => {
            if(typeof alternative == "string") {
                /**
                 * @type {ButtonElement}
                 */
                const newAlternative = {
                    buttonText: alternative,
                    _index: index
                }
                return newAlternative
            } else {
                alternative._index = index
                return alternative
            }
        })
        buttons
            .filter(alternative => {
                if(!currentIndexData.exhaustOptionsBeforeContinue) {
                    return true
                }
                return !alternative._hasClicked
            })
            .map(alternative => ({
                label: alternative.buttonText,
                callback: () => {
                    alternative._hasClicked = true
                    if(alternative.onclick) {
                        alternative.onclick();
                    }
                    if(!currentIndexData.exhaustOptionsBeforeContinue || popupOptions.length == 1) {
                        let continuation = undefined
                        if(alternative.continuation) {
                            continuation = alternative.continuation
                        }
                        let newIndex = [...conversationPos];
                        if(continuation) {
                            options._conversationIndex.push(0)
                            newIndex.push(0)
                        } else {
                            if(typeof newIndex[newIndex.length - 1] == "object") {
                                newIndex.pop()
                            }
                            if(newIndex.length > 1) {
                                if(!currentIndexData.resumeMainIndex) {
                                    if(options.onfinish) {
                                        options.onfinish(options)
                                    }
                                    return
                                }
                                newIndex.length = 1
                            }
                            const lastIndex = newIndex[newIndex.length - 1]
                            if(typeof lastIndex == "object") {
                                throw "invalid obj"
                            } else {
                                newIndex[newIndex.length - 1] = lastIndex + 1
                            }
                        }
                        createPopup(newIndex, continuation)
                    } else {
                        const newConversationPoition = [...conversationPos];
                        if(typeof newConversationPoition[newConversationPoition.length - 1] != "object") {
                            newConversationPoition.push({
                                exhaustedIndices: [alternative._index]
                            })
                        }
                        createPopup(newConversationPoition)
                    }

                }
            }))
            .forEach((option) => {
                popupOptions.push(option)
            })

        popupInZone({
            zone: options.zone,
            blocking: options.blocking,
            withCircle: options.withCircle,
            popupText: currentIndexData.message,
            initiallyOpened: conversationPos.length > 1 || conversationPos[0] > 0,
            openCondition: () => {
                const shouldOpen = JSON.stringify(options._conversationIndex) == JSON.stringify(conversationPos);
                if(shouldOpen && currentIndexData.onDisplay) {
                    currentIndexData.onDisplay()
                }
                return shouldOpen;
            },
            popupOptions: popupOptions
        });
    }
    createPopup([0]);
}
module.exports = {
    singleStrandedPopupConversation,
    multiStrandedPopupConversation
}

/**
 *
 * example usage (main flow is down then towards bottom-right where necessary)
 *
 *    multiStrandedPopupConversation({
        zone: "convtest",
        onfinish: (opts) => {
            opts._conversationIndex = [0]
        },
        data: [{
            message: "test2.2",
            buttons: ["abc", "bef"]
        }, {
            message: "test2.5",
            buttons: [{
                buttonText: "b1",
                continuation: {
                    message: "b1message",
                    resumeMainIndex: true,
                    buttons: [{
                        buttonText: "b1response",
                        continuation: {
                            message: "b1respmess",
                            exhaustOptionsBeforeContinue: true,
                            resumeMainIndex: true,
                            buttons: ["exhaust1", "exhaust2"]
                        }
                    }, "b1responsee2"]
                }
            }, "b2a"]
        }, {
            message: "test3",
            buttons: "finish"
        }
        ]
    })
 *
 *
 *
 *
 */
