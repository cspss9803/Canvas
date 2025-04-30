import { InteractionMode } from './types.js';
export class ViewportManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }
    moveViewport(screenMousePosition) {
        const interactionMode = this.canvasManager.interactionMode;
        const viewPosition = this.canvasManager.viewPosition;
        const startPosition = this.canvasManager.startPosition;
        if (interactionMode !== InteractionMode.Moving)
            return;
        viewPosition.x = screenMousePosition.x - startPosition.x;
        viewPosition.y = screenMousePosition.y - startPosition.y;
    }
}
