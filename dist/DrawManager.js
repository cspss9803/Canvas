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
            const viewPosition = this.canvasManager.viewportPosition;
            const selectedObjects = this.canvasManager.selectedUIObjects;
            const zoom = this.canvasManager.zoom;
            this.clearCanvas();
            drawGrid(ctx, viewPosition, zoom);
            this.drawObjects();
            drawBoundingBox(ctx, selectedObjects, viewPosition, zoom);
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
        const viewPosition = this.canvasManager.viewportPosition;
        const uiObjects = this.canvasManager.uiObjects;
        const zoom = this.canvasManager.zoom;
        for (const object of uiObjects) {
            object.draw(ctx, viewPosition, zoom);
        }
    }
    drawSelectionArea() {
        const ctx = this.canvasManager.ctx;
        const selectionStart = this.canvasManager.selectionStartPoint;
        const selectionEnd = this.canvasManager.selectionEndPoint;
        const viewportPosition = this.canvasManager.viewportPosition;
        const zoom = this.canvasManager.zoom;
        if (selectionStart && selectionEnd) {
            ctx.save();
            ctx.translate(viewportPosition.x, viewportPosition.y);
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
