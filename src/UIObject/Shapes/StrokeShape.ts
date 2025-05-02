import type { Color, Vector2, BoundingBox } from '../../types';
import { UIObjectBase } from '../UIObject.js';

export abstract class StrokeShape extends UIObjectBase {
    constructor(
        position: Vector2,
        public strokeColor: Color = '#000',
        public lineWidth: number = 2,
        public lineDash: number[] = [] // 預設是實線，[] 代表無虛線
    ) {
        super( position );
    }

    draw(ctx: CanvasRenderingContext2D, offset: Vector2): void {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash(this.lineDash);
        this.renderStroke(ctx);
        ctx.restore();
    }

    isHit(point: Vector2, offset: Vector2): boolean {
        return this.isPointNearStroke(point.x, point.y);
    }

    protected abstract renderStroke(ctx: CanvasRenderingContext2D): void;
    protected abstract isPointNearStroke(x: number, y: number): boolean;
    abstract getBoundingBox(): BoundingBox;
}