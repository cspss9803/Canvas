import { DrawableObject } from '../DrawableObject.js';
export class StrokeShape extends DrawableObject {
    constructor(position, strokeColor = '#000', lineWidth = 2, lineDash = [] // 預設是實線，[] 代表無虛線
    ) {
        super(position);
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
        this.lineDash = lineDash;
    }
    draw(ctx, offset) {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash(this.lineDash);
        this.renderStroke(ctx);
        ctx.restore();
    }
    containsPoint(point, offset) {
        const localX = point.x - offset.x;
        const localY = point.y - offset.y;
        return this.isPointNearStroke(localX, localY);
    }
}
