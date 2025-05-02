import { CanvasManager } from './CanvasManager.js'
import type { Vector2 } from './types.js'

export class CoordinateTransformer {
    constructor(private canvasManager: CanvasManager) {}

    // 螢幕座標 ➜ 世界座標（用於滑鼠點擊）
    screenToWorld(screen: Vector2): Vector2 {
        return {
            x: screen.x - this.canvasManager.viewportPosition.x,
            y: screen.y - this.canvasManager.viewportPosition.y,
        }
    }

    // 世界座標 ➜ 螢幕座標（用於繪製）
    worldToScreen(world: Vector2): Vector2 {
        return {
            x: (world.x - this.canvasManager.viewportPosition.x) * this.canvasManager.zoom,
            y: (world.y - this.canvasManager.viewportPosition.y) * this.canvasManager.zoom,
        }
    }
}