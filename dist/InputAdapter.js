export class InputAdapter {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }
    getWorldMousePosition(event) {
        return {
            x: event.clientX - this.canvasManager.viewportPosition.x,
            y: event.clientY - this.canvasManager.viewportPosition.y
        };
    }
}
