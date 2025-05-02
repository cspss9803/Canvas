import type { Color, Vector2, BoundingBox } from '../../types'
import { UIObjectBase } from '../UIObject.js'

export abstract class Shape extends UIObjectBase {
    constructor( position: Vector2, public color: Color = '#f00' ) { super(position) }

    draw( ctx: CanvasRenderingContext2D, viewportPosition: Vector2, zoom: number ): void {
        ctx.save();
        ctx.translate(viewportPosition.x, viewportPosition.y);
        ctx.scale(zoom, zoom);
        ctx.fillStyle = this.color;
        this.renderShape(ctx);
        ctx.restore();
    }

    isHit(point: Vector2): boolean {
        return this.isPointInside(point.x, point.y);
    }

    protected abstract renderShape(ctx: CanvasRenderingContext2D): void;
    protected abstract isPointInside(x: number, y: number): boolean;
    abstract getBoundingBox(): BoundingBox;
}