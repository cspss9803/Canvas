import { drawGrid } from './DrawGrid.js';
import { drawBoundingBox } from './UIObject/ObjectHighlineTool.js';
export class DrawManager {
    constructor(canvasManager) {
        this.isDrawedInThisFrame = false;
        this.canvasManager = canvasManager;
    }
    draw() {
        if (this.isDrawedInThisFrame)
            return;
        this.isDrawedInThisFrame = true;
        requestAnimationFrame(() => {
            const ctx = this.canvasManager.ctx;
            const offset = this.canvasManager.viewPortManager.offset;
            const selectedObjects = this.canvasManager.selectedUIObjects;
            const zoom = this.canvasManager.viewPortManager.zoom;
            this.clearCanvas();
            drawGrid(ctx, offset, zoom);
            this.drawObjects();
            drawBoundingBox(ctx, selectedObjects, offset, zoom);
            this.drawSelectionArea();
            this.isDrawedInThisFrame = false;
        });
    }
    clearCanvas() {
        const ctx = this.canvasManager.ctx;
        const canvas = this.canvasManager.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawObjects() {
        const ctx = this.canvasManager.ctx;
        const offset = this.canvasManager.viewPortManager.offset;
        const uiObjects = this.canvasManager.uiObjects;
        const zoom = this.canvasManager.viewPortManager.zoom;
        for (const object of uiObjects) {
            object.draw(ctx, offset, zoom);
        }
    }
    drawSelectionArea() {
        const ctx = this.canvasManager.ctx;
        const selectionStart = this.canvasManager.selectionStartPoint;
        const selectionEnd = this.canvasManager.selectionEndPoint;
        const offset = this.canvasManager.viewPortManager.offset;
        const zoom = this.canvasManager.viewPortManager.zoom;
        if (selectionStart && selectionEnd) {
            ctx.save();
            ctx.translate(offset.x, offset.y);
            ctx.scale(zoom, zoom);
            ctx.strokeStyle = 'rgb(0, 119, 255)';
            ctx.lineWidth = 0.5;
            ctx.fillStyle = 'rgba(0, 119, 255, 0.25)';
            const x = Math.min(selectionStart.x, selectionEnd.x);
            const y = Math.min(selectionStart.y, selectionEnd.y);
            const w = Math.abs(selectionStart.x - selectionEnd.x);
            const h = Math.abs(selectionStart.y - selectionEnd.y);
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
            ctx.restore();
        }
    }
}
