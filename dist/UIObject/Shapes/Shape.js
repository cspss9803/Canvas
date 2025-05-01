import { UIObjectBase } from '../UIObject.js';
export class Shape extends UIObjectBase {
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
    isHit(point, offset) {
        const localX = point.x - offset.x;
        const localY = point.y - offset.y;
        return this.isPointInside(localX, localY);
    }
}
