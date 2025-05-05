import { drawGrid } from './DrawGrid.js';
import { drawBoundingBox } from './UIObject/ObjectHighlineTool.js';
import { CanvasManager } from './CanvasManager.js';

export class DrawManager {

    canvasManager: CanvasManager
    isDrawedInThisFrame = false
    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager;
    }

    draw() {
        if ( this.isDrawedInThisFrame ) return;
        this.isDrawedInThisFrame = true;
        requestAnimationFrame( () => {
            const ctx = this.canvasManager.ctx;
            const offset = this.canvasManager.viewPortManager.offset;
            const selectedObjs = this.canvasManager.selectedUIObjects;
            const zoom = this.canvasManager.viewPortManager.zoom;
            this.clearCanvas();
            drawGrid( ctx, offset, zoom );
            this.drawObjects();
            drawBoundingBox( ctx, selectedObjs, offset, zoom );
            this.drawSelectionArea();
            this.isDrawedInThisFrame = false;
        });
    }

    clearCanvas(){
        const ctx = this.canvasManager.ctx;
        const canvas = this.canvasManager.canvas;
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
    }

    drawObjects(){
        const ctx = this.canvasManager.ctx;
        const offset = this.canvasManager.viewPortManager.offset;
        const objects = this.canvasManager.uiObjects;
        const zoom = this.canvasManager.viewPortManager.zoom;
        for ( const object of objects ) { 
            object.draw( ctx, offset, zoom );
        }
    }

    drawSelectionArea(){
        const ctx = this.canvasManager.ctx;
        const start = this.canvasManager.selectionStartPoint;
        const end = this.canvasManager.selectionEndPoint;
        const offset = this.canvasManager.viewPortManager.offset;
        const zoom = this.canvasManager.viewPortManager.zoom;
        if ( start && end ) {
            ctx.save();
            ctx.translate( offset.x, offset.y );
            ctx.scale( zoom, zoom );
            ctx.strokeStyle = 'rgb(0, 119, 255)';
            ctx.lineWidth = 1.5;
            ctx.fillStyle = 'rgba(0, 119, 255, 0.25)';
            const x = Math.min( start.x,  end.x );
            const y = Math.min( start.y,  end.y );
            const w = Math.abs( start.x - end.x );
            const h = Math.abs( start.y - end.y );
            ctx.fillRect( x, y, w, h );
            ctx.strokeRect( x, y, w, h );
            ctx.restore();
        }
    }
}