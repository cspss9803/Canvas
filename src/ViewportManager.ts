import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'
import type { Vector2 } from './types'
import { updateOffset } from './Debug.js'

export class ViewportManager {

    canvasManager: CanvasManager
    constructor ( canvasManager: CanvasManager ) { this.canvasManager = canvasManager; }

    moveViewport( worldMousePosition: Vector2 ) {
        const currentInteractionMode = this.canvasManager.currentInteractionMode;
        const offset = this.canvasManager.offset;
        const pointerDownPosition = this.canvasManager.pointerDownPosition;

        if ( currentInteractionMode !== InteractionMode.Moving ) return;
        offset.x += worldMousePosition.x - pointerDownPosition.x;
        offset.y += worldMousePosition.y - pointerDownPosition.y;
        updateOffset(offset);
    }
}