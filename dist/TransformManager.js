import { InteractionMode } from './types.js';
export class TransformManager {
    constructor(canvasManager) { this.canvasManager = canvasManager; }
    moveSelectedObjects(worldMousePosition) {
        if (this.canvasManager.currentInteractionMode !== InteractionMode.Selecting)
            return;
        if (!this.canvasManager.selectionStartPoint) {
            for (const object of this.canvasManager.selectedUIObjects) {
                const offsetForShape = this.canvasManager.dragOffsets.get(object);
                if (offsetForShape) {
                    object.position.x = worldMousePosition.x - offsetForShape.x;
                    object.position.y = worldMousePosition.y - offsetForShape.y;
                }
            }
        }
    }
}
