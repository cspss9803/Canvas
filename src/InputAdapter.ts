import { CanvasManager } from './CanvasManager.js'
import type { Vector2 } from './types'

export class InputAdapter {
    constructor(private canvasManager: CanvasManager) {}
  
    getWorldMousePosition(event: MouseEvent): Vector2 {
        return {
            x: event.clientX - this.canvasManager.viewportPosition.x,
            y: event.clientY - this.canvasManager.viewportPosition.y
        };
    }
  
    getScreenMousePosition(event: MouseEvent): Vector2 {
        return {
            x: event.clientX,
            y: event.clientY
        };
    }
}