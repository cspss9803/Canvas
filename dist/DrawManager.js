import drawGrid from './DrawGrid.js';
import { drawBoundingBox } from './DrawableObject/ObjectHighlineTool.js';
export function draw(canvasManager) {
    const ctx = canvasManager.ctx;
    const canvas = canvasManager.canvas;
    const offset = canvasManager.offset;
    const objects = canvasManager.objects;
    const selectedObjects = canvasManager.selectedObjects;
    const selectionStart = canvasManager.selectionStart;
    const selectionEnd = canvasManager.selectionEnd;
    // 清除畫布，準備重新繪製新一幀的畫面
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 先繪製底部的格線
    drawGrid(ctx, offset);
    // 再繪製所有物件
    for (const object of objects) {
        object.draw(ctx, offset);
    }
    // 繪製被選取物件們的選取框
    drawBoundingBox(ctx, selectedObjects, offset);
    // 如果有選取框，則繪製選取框
    if (selectionStart && selectionEnd) {
        ctx.save();
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
