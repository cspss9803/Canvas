import { UIObjectBase } from '../UIObject.js';
export class Shape extends UIObjectBase {
    constructor(position, color = '#f00') {
        super(position);
        this.color = color;
    }
    draw(ctx, offset, zoom) {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(zoom, zoom);
        ctx.fillStyle = this.color;
        this.renderShape(ctx);
        ctx.restore();
    }
    isHit(point) {
        return this.isPointInside(point.x, point.y);
    }
}
