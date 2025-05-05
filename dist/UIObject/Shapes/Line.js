import { StrokeShape } from './StrokeShape.js';
export class Line extends StrokeShape {
    constructor(position, points, // 相對於 position 的中繼點
    strokeColor, lineWidth, lineDash) {
        super(position, strokeColor, lineWidth, lineDash);
        this.points = points;
    }
    renderStroke(ctx) {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(this.position.x, this.position.y);
        for (const point of this.points) {
            ctx.lineTo(this.position.x + point.x, this.position.y + point.y);
        }
        ctx.stroke();
    }
    isPointNearStroke(x, y) {
        const threshold = this.lineWidth + 4;
        let prev = this.position;
        for (const offset of this.points) {
            const curr = {
                x: this.position.x + offset.x,
                y: this.position.y + offset.y
            };
            if (this.isPointNearSegment(x, y, prev, curr, threshold)) {
                return true;
            }
            prev = curr;
        }
        return false;
    }
    isPointNearSegment(px, py, p1, p2, threshold) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const lengthSquared = dx * dx + dy * dy;
        if (lengthSquared === 0) {
            const dist = Math.hypot(px - p1.x, py - p1.y);
            return dist <= threshold;
        }
        let t = ((px - p1.x) * dx + (py - p1.y) * dy) / lengthSquared;
        t = Math.max(0, Math.min(1, t));
        const projX = p1.x + t * dx;
        const projY = p1.y + t * dy;
        const dist = Math.hypot(px - projX, py - projY);
        return dist <= threshold;
    }
    getBoundingBox() {
        const worldPoints = [
            this.position,
            ...this.points.map(p => ({
                x: this.position.x + p.x,
                y: this.position.y + p.y
            }))
        ];
        const xs = worldPoints.map(p => p.x);
        const ys = worldPoints.map(p => p.y);
        return {
            x: Math.min(...xs),
            y: Math.min(...ys),
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys)
        };
    }
}
