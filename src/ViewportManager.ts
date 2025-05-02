import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'
import type { Vector2 } from './types'
import { updateViewportPosition } from './Debug.js'

export class ViewportManager {

    canvasManager: CanvasManager
    constructor ( canvasManager: CanvasManager ) { this.canvasManager = canvasManager; }

    moveViewport( worldMousePosition: Vector2 ) {
        const currentInteractionMode = this.canvasManager.currentInteractionMode;
        const viewportPosition = this.canvasManager.viewportPosition;
        const pointerDownPosition = this.canvasManager.pointerDownPosition;

        if ( currentInteractionMode !== InteractionMode.Moving ) return;
        viewportPosition.x += worldMousePosition.x - pointerDownPosition.x;
        viewportPosition.y += worldMousePosition.y - pointerDownPosition.y;
        updateViewportPosition(viewportPosition);
    }
}