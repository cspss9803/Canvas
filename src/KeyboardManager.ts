import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'

export class KeyboardManager {

    canvasManager: CanvasManager;

    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager;
    }

    handleKeyboardInput( code: string ){
        const canvasManager = this.canvasManager;
        const selectedObjes = canvasManager.selectedUIObjects;
        const objects = canvasManager.uiObjects;
        const drawManager = this.canvasManager.drawManager;

        if ( code === 'KeyV' ) {
            canvasManager.currentInteractionMode = InteractionMode.Selecting;
            canvasManager.updateCursor();
        }
    
        if ( code === 'KeyH' ) {
            canvasManager.currentInteractionMode = InteractionMode.Moving;
            canvasManager.updateCursor();
        }
    
        if ( code === 'Delete' ) {
            if ( selectedObjes.length > 0 ) {
                for ( const object of selectedObjes ) {
                    const index = objects.indexOf( object );
                    if ( index !== -1 ) {
                        objects.splice( index, 1 );
                    }
                }
                selectedObjes.length = 0;
            }
            drawManager.draw();
        }
    }
}