import { CanvasManager } from './CanvasManager.js'
import { InteractionMode } from './types.js'

export class KeyboardManager {

    canvasManager: CanvasManager

    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager 
    }

    handleKeyboardInput( code: string ){
        if ( code === 'KeyV' ) {
            this.canvasManager.currentInteractionMode = InteractionMode.Selecting
            this.canvasManager.updateCursor()
        }
    
        if ( code === 'KeyH' ) {
            this.canvasManager.currentInteractionMode = InteractionMode.Moving
            this.canvasManager.updateCursor()
        }
    
        if ( code === 'Delete' ) {

            if ( this.canvasManager.selectedUIObjects.length > 0 ) {
                for (const object of this.canvasManager.selectedUIObjects) {
                    const index = this.canvasManager.uiObjects.indexOf( object )
                    if (index !== -1) {
                        this.canvasManager.uiObjects.splice(index, 1)
                    }
                }
                this.canvasManager.selectedUIObjects = []
            }
            this.canvasManager.drawManager.draw()
        }
    }
}