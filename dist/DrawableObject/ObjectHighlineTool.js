export function drawBoundingBox(ctx, objects, offset) {
    // 如果沒有選取任何物件，則不繪製
    if (objects.length === 0)
        return;
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
        // 繪製單個物件的外框
        drawRoundedBox(ctx, box, offset, { thickness: 3, radius: 3, color: 'rgb(0, 183, 255)' });
    }
    // 彙整出來的最終 Bounding Box
    const totalBox = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
    drawRoundedBox(ctx, totalBox, offset, { thickness: 3, radius: 3, color: 'rgb(0, 85, 255)' });
}
function drawRoundedBox(ctx, box, offset, style) {
    const thickness = style.thickness;
    const radius = style.radius;
    const color = style.color;
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    const x = box.x - thickness / 2;
    const y = box.y - thickness / 2;
    const width = box.width + thickness;
    const height = box.height + thickness;
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
