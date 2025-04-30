import { InteractionMode } from './types.js';
export class KeyboardManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }
    handleKeyboardInput(code) {
        if (code === 'KeyV') {
            this.canvasManager.interactionMode = InteractionMode.Selecting;
            this.canvasManager.updateCursor();
        }
        if (code === 'KeyH') {
            this.canvasManager.interactionMode = InteractionMode.Moving;
            this.canvasManager.updateCursor();
        }
        if (code === 'Delete') {
            if (this.canvasManager.selectedObjects.length > 0) {
                for (const object of this.canvasManager.selectedObjects) {
                    const index = this.canvasManager.canvasObjects.indexOf(object);
                    if (index !== -1) {
                        this.canvasManager.canvasObjects.splice(index, 1);
                    }
                }
                this.canvasManager.selectedObjects = [];
            }
            this.canvasManager.drawManager.draw();
        }
    }
}
