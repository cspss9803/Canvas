import { InteractionMode } from './types.js';
export class ViewportManager {
    constructor(canvasManager) { this.canvasManager = canvasManager; }
    moveViewport(worldMousePosition) {
        const currentInteractionMode = this.canvasManager.currentInteractionMode;
        const viewportPosition = this.canvasManager.viewportPosition;
        const pointerDownPosition = this.canvasManager.pointerDownPosition;
        if (currentInteractionMode !== InteractionMode.Moving)
            return;
        viewportPosition.x += worldMousePosition.x - pointerDownPosition.x;
        viewportPosition.y += worldMousePosition.y - pointerDownPosition.y;
    }
}
