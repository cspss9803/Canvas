import { InteractionMode } from './types.js';
import { updateOffset } from './Debug.js';
export class ViewportManager {
    constructor(canvasManager) { this.canvasManager = canvasManager; }
    moveViewport(worldMousePosition) {
        const currentInteractionMode = this.canvasManager.currentInteractionMode;
        const offset = this.canvasManager.offset;
        const pointerDownPosition = this.canvasManager.pointerDownPosition;
        if (currentInteractionMode !== InteractionMode.Moving)
            return;
        offset.x += worldMousePosition.x - pointerDownPosition.x;
        offset.y += worldMousePosition.y - pointerDownPosition.y;
        updateOffset(offset);
    }
}
