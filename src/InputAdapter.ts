import { CanvasManager } from './CanvasManager.js'
import type { Vector2 } from './types'

export class InputAdapter {
    constructor(private canvasManager: CanvasManager) {}
  
    getWorldMousePosition(event: MouseEvent): Vector2 {
        return {
            x: event.clientX - this.canvasManager.viewPosition.x,
            y: event.clientY - this.canvasManager.viewPosition.y
        };
    }
  
    getScreenMousePosition(event: MouseEvent): Vector2 {
        return {
            x: event.clientX,
            y: event.clientY
        };
    }
  }
  