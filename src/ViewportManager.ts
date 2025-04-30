import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'

export class ViewportManager {

    canvasManager: CanvasManager

    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager 
    }

    moveViewport(clientX: number, clientY: number) {

        if ( this.canvasManager.interactionMode !== InteractionMode.Moving ) return;
        this.canvasManager.viewPostiion.x = clientX - this.canvasManager.startPosition.x;
        this.canvasManager.viewPostiion.y = clientY - this.canvasManager.startPosition.y;
    }
}