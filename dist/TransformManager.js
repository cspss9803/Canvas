import { InteractionMode } from './types.js';
export class TransformManager {
    constructor(canvasManager) { this.canvasManager = canvasManager; }
    moveSelectedObjects(screenMousePosition) {
        const worldMousePosition = { x: 0, y: 0 };
        worldMousePosition.x = screenMousePosition.x - this.canvasManager.viewPosition.x;
        worldMousePosition.y = screenMousePosition.y - this.canvasManager.viewPosition.y;
        if (this.canvasManager.interactionMode !== InteractionMode.Selecting)
            return;
        if (!this.canvasManager.selectionStart) {
            for (const object of this.canvasManager.selectedObjects) {
                const offsetForShape = this.canvasManager.dragOffsets.get(object);
                if (offsetForShape) {
                    object.position.x = worldMousePosition.x - offsetForShape.x;
                    object.position.y = worldMousePosition.y - offsetForShape.y;
                }
            }
        }
    }
}
