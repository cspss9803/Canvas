export class TransformManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }
    moveSelectedObjects(worldMousePosition) {
        if (!this.canvasManager.isSelectMode()
            || this.canvasManager.selectionStartPoint)
            return;
        for (const object of this.canvasManager.selectedUIObjects) {
            const offsetForShape = this.canvasManager.dragOffsets.get(object);
            if (offsetForShape) {
                object.position.x = worldMousePosition.x - offsetForShape.x;
                object.position.y = worldMousePosition.y - offsetForShape.y;
            }
        }
    }
}
