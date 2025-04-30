export class InputAdapter {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }
    getWorldMousePosition(event) {
        return {
            x: event.clientX - this.canvasManager.viewPosition.x,
            y: event.clientY - this.canvasManager.viewPosition.y
        };
    }
    getScreenMousePosition(event) {
        return {
            x: event.clientX,
            y: event.clientY
        };
    }
}
