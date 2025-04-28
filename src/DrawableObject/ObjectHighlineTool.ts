import type { DrawableObject } from './DrawableObject.js';
import type { Vector2, BoundingBox } from '../types.js';

export function drawHighlight(
    ctx: CanvasRenderingContext2D, 
    objects: DrawableObject[], 
    offset: Vector2
) {
    // 如果沒有選取任何物件，則不繪製
    if (objects.length === 0) return

    // 計算所有物件的總 Bounding Box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const object of objects) {
        const box = object.getBoundingBox(offset);
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
    }

    // 彙整出來的最終 Bounding Box
    const totalBox: BoundingBox = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };

    const lineWidth = 3;
    const radius = 3;

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.strokeStyle = 'rgb(0, 106, 255)';
    ctx.lineWidth = lineWidth;

    const x = totalBox.x - lineWidth / 2;
    const y = totalBox.y - lineWidth / 2;
    const width = totalBox.width + lineWidth;
    const height = totalBox.height + lineWidth;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}