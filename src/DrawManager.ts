import drawGrid from './DrawGrid.js'
import { drawBoundingBox } from './DrawableObject/ObjectHighlineTool.js'
import { CanvasManager } from './CanvasManager.js'

export class DrawManager {

    canvasManager: CanvasManager
    isDrawedInThisFrame = false
    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager 
    }

    draw() {
        if (this.isDrawedInThisFrame) return;
        this.isDrawedInThisFrame = true;
        requestAnimationFrame(() => {
            const ctx = this.canvasManager.ctx;
            const viewPosition = this.canvasManager.viewPosition;
            const selectedObjects = this.canvasManager.selectedObjects;
            this.clearCanvas();
            drawGrid(ctx, viewPosition);
            this.drawObjects();
            drawBoundingBox(ctx, selectedObjects, viewPosition);
            this.drawSelectionArea();
            this.isDrawedInThisFrame = false;
        });
    }

    clearCanvas(){
        const ctx = this.canvasManager.ctx
        const canvas = this.canvasManager.canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    drawObjects(){
        const ctx = this.canvasManager.ctx
        const viewPosition = this.canvasManager.viewPosition
        const canvasObjects = this.canvasManager.canvasObjects
        for ( const object of canvasObjects ) { 
            object.draw(ctx, viewPosition) 
        }
    }

    drawSelectionArea(){
        const ctx = this.canvasManager.ctx
        const selectionStart = this.canvasManager.selectionStart
        const selectionEnd = this.canvasManager.selectionEnd
        if ( selectionStart && selectionEnd ) {
            ctx.save()
            ctx.strokeStyle = 'rgb(0, 119, 255)'
            ctx.lineWidth = 0.5;
            ctx.fillStyle = 'rgba(0, 119, 255, 0.25)'
            const x = Math.min(selectionStart.x, selectionEnd.x)
            const y = Math.min(selectionStart.y, selectionEnd.y)
            const w = Math.abs(selectionStart.x - selectionEnd.x)
            const h = Math.abs(selectionStart.y - selectionEnd.y)
            ctx.fillRect( x, y, w, h )
            ctx.strokeRect( x, y, w, h )
            ctx.restore()
        }
    }
}