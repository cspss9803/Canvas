import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'
import type { Vector2 } from './types.js'

export class ViewportManager {

    canvasManager: CanvasManager

    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager 
    }

    moveViewport( screenMousePosition: Vector2 ) {
        const interactionMode = this.canvasManager.interactionMode;
        const viewPosition = this.canvasManager.viewPosition;
        const startPosition = this.canvasManager.startPosition;

        if ( interactionMode !== InteractionMode.Moving ) return;
        viewPosition.x = screenMousePosition.x - startPosition.x;
        viewPosition.y = screenMousePosition.y - startPosition.y;
    }
}