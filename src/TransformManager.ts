import { CanvasManager } from './CanvasManager.js';
import type { Vector2 } from './types';

export class TransformManager {

    canvasManager: CanvasManager;
    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager;
    }

    moveSelectedObjects( worldMousePosition: Vector2 ){
        
        if( 
            !this.canvasManager.isSelectMode() 
            || this.canvasManager.selectionStartPoint
        ) return;

        for ( const object of this.canvasManager.selectedUIObjects ) {
            const offsetForShape = this.canvasManager.dragOffsets.get( object );
            if ( offsetForShape ) {
                object.position.x = worldMousePosition.x - offsetForShape.x;
                object.position.y = worldMousePosition.y - offsetForShape.y;
            }
        }

    }
}