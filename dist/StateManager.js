export class StateManager {
    constructor() {
        this.isDragging = false;
        this.isClickOnObject = false;
        this.selectionStart = null;
        this.selectionEnd = null;
    }
    resetInteractionState() {
        this.isDragging = false;
        this.isClickOnObject = false;
        this.selectionStart = null;
        this.selectionEnd = null;
    }
}
