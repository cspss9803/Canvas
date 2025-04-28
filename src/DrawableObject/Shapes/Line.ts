import type { Vector2, BoundingBox, Color } from '../../types';
import { StrokeShape } from './StrokeShape.js';

export class Line extends StrokeShape {
    constructor(
        position: Vector2,
        public points: Vector2[], // 中繼點，不包含起點，僅中繼到終點
        strokeColor?: Color,
        lineWidth?: number,
        lineDash?: number[]
    ) {
        super(position, strokeColor, lineWidth, lineDash);
    }

    protected renderStroke(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);

        for (const point of this.points) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.stroke();
    }

    protected isPointNearStroke(x: number, y: number): boolean {
        const threshold = this.lineWidth + 4; // 容許點在線附近幾個像素內
        
        let prev = this.position;
        for (const point of this.points) {
            if (this.isPointNearSegment(x, y, prev, point, threshold)) {
                return true;
            }
            prev = point;
        }
        return false;
    }

    private isPointNearSegment(
        px: number, py: number,
        p1: Vector2, p2: Vector2,
        threshold: number
    ): boolean {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const lengthSquared = dx * dx + dy * dy;

        if (lengthSquared === 0) {
            // p1和p2是同一點
            const dist = Math.hypot(px - p1.x, py - p1.y);
            return dist <= threshold;
        }

        // 投影點到線段上
        let t = ((px - p1.x) * dx + (py - p1.y) * dy) / lengthSquared;
        t = Math.max(0, Math.min(1, t));
        const projX = p1.x + t * dx;
        const projY = p1.y + t * dy;

        const dist = Math.hypot(px - projX, py - projY);
        return dist <= threshold;
    }

    getBoundingBox(): BoundingBox {
        const allPoints = [this.position, ...this.points];
        const xs = allPoints.map(p => p.x);
        const ys = allPoints.map(p => p.y);

        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
}