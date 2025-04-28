export var InteractionMode;
(function (InteractionMode) {
    InteractionMode[InteractionMode["Selecting"] = 0] = "Selecting";
    InteractionMode[InteractionMode["Moving"] = 1] = "Moving";
})(InteractionMode || (InteractionMode = {}));
export var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
    MouseButton[MouseButton["Back"] = 3] = "Back";
    MouseButton[MouseButton["Forward"] = 4] = "Forward";
})(MouseButton || (MouseButton = {}));
/**
 * 框選物件時
 * Inside: 需要完全包含進選取框裡面才選取
 * Intersect: 只要有重疊到選框就選取
 * */
export var SelectionMode;
(function (SelectionMode) {
    /** 需要完全包含進選取框裡面才選取 */
    SelectionMode[SelectionMode["Inside"] = 0] = "Inside";
    /** 只要有重疊到選框就選取 */
    SelectionMode[SelectionMode["Intersect"] = 1] = "Intersect";
})(SelectionMode || (SelectionMode = {}));
