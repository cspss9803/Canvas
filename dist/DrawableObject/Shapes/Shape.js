import { DrawableObject } from '../DrawableObject.js';
export class Shape extends DrawableObject {
    constructor(position, color = '#f00') {
        super(position);
        this.color = color;
    }
    draw(ctx, offset) {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.fillStyle = this.color;
        this.renderShape(ctx);
        ctx.restore();
    }
    containsPoint(point, offset) {
        const localX = point.x - offset.x;
        const localY = point.y - offset.y;
        return this.isPointInside(localX, localY);
    }
}
