import { InteractionMode } from './types.js';
export class ViewportManager {
    constructor(canvasManager) { this.canvasManager = canvasManager; }
    moveViewport(screenMousePosition) {
        const currentInteractionMode = this.canvasManager.currentInteractionMode;
        const viewportPosition = this.canvasManager.viewportPosition;
        const pointerDownPosition = this.canvasManager.pointerDownPosition;
        if (currentInteractionMode !== InteractionMode.Moving)
            return;
        viewportPosition.x = screenMousePosition.x - pointerDownPosition.x;
        viewportPosition.y = screenMousePosition.y - pointerDownPosition.y;
    }
}
