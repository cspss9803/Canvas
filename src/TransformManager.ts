import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'
import type { Vector2 } from './types'

export class TransformManager {

    canvasManager: CanvasManager
    constructor (canvasManager: CanvasManager){this.canvasManager = canvasManager}

    moveSelectedObjects( screenMousePosition: Vector2 ){
        const worldMousePosition: Vector2 = { x: 0, y: 0 }
        worldMousePosition.x = screenMousePosition.x - this.canvasManager.viewportPosition.x;
        worldMousePosition.y = screenMousePosition.y - this.canvasManager.viewportPosition.y;
        if( this.canvasManager.currentInteractionMode !== InteractionMode.Selecting ) return;
        if( !this.canvasManager.selectionStartPoint ) {
            for ( const object of this.canvasManager.selectedUIObjects ) {
                const offsetForShape = this.canvasManager.dragOffsets.get(object);
                if ( offsetForShape ) {
                    object.position.x = worldMousePosition.x - offsetForShape.x;
                    object.position.y = worldMousePosition.y - offsetForShape.y;
                }
            }
        }
    }
}