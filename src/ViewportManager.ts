import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'
import type { Vector2 } from './types'
import { updateOffset } from './Debug.js'

export class ViewportManager {

    canvasManager: CanvasManager
    constructor ( canvasManager: CanvasManager ) { this.canvasManager = canvasManager; }

    moveViewport( worldMousePosition: Vector2 ) {
        if ( this.canvasManager.currentInteractionMode !== InteractionMode.Moving ) return;

        const offset = this.canvasManager.offset;
        const pointerDownPosition = this.canvasManager.pointerDownPosition;

        offset.x += worldMousePosition.x - pointerDownPosition.x;
        offset.y += worldMousePosition.y - pointerDownPosition.y;
        updateOffset(offset); // 把目前的 offset 值顯示在網頁上
    }
}