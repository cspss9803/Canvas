export class CoordinateTransformer {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }
    // 螢幕座標 ➜ 世界座標（用於滑鼠點擊）
    screenToWorld(screen) {
        return {
            x: (screen.x - this.canvasManager.viewportPosition.x) / this.canvasManager.zoom,
            y: (screen.y - this.canvasManager.viewportPosition.y) / this.canvasManager.zoom,
        };
    }
    // 世界座標 ➜ 螢幕座標（用於繪製）
    worldToScreen(world) {
        return {
            x: (world.x - this.canvasManager.viewportPosition.x) * this.canvasManager.zoom,
            y: (world.y - this.canvasManager.viewportPosition.y) * this.canvasManager.zoom,
        };
    }
}
