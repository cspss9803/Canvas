import { InteractionMode } from './types.js';
export class ViewportManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }
    moveViewport(clientX, clientY) {
        if (this.canvasManager.interactionMode !== InteractionMode.Moving)
            return;
        this.canvasManager.viewPostiion.x = clientX - this.canvasManager.startPosition.x;
        this.canvasManager.viewPostiion.y = clientY - this.canvasManager.startPosition.y;
    }
}
