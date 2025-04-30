import { InteractionMode } from './types.js';
export class TransformManager {
    constructor(canvasManager) { this.canvasManager = canvasManager; }
    moveSelectedObjects(clientX, clientY) {
        const viewPostiion = this.canvasManager.viewPostiion;
        const interactionMode = this.canvasManager.interactionMode;
        const selectedObjects = this.canvasManager.selectedObjects;
        const dragOffsets = this.canvasManager.dragOffsets;
        const isNotSelecting = !this.canvasManager.selectionStart || !this.canvasManager.selectionEnd;
        const mouseX = clientX - viewPostiion.x;
        const mouseY = clientY - viewPostiion.y;
        if (interactionMode !== InteractionMode.Selecting)
            return;
        // 如果沒有在進行框選的話
        if (isNotSelecting) {
            // 移動所有被選取的物件
            for (const object of selectedObjects) {
                const offsetForShape = dragOffsets.get(object);
                const position = object.position;
                if (offsetForShape) {
                    position.x = mouseX - offsetForShape.x;
                    position.y = mouseY - offsetForShape.y;
                }
            }
        }
    }
}
