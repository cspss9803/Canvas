import type { Color, Vector2, BoundingBox } from '../../types'
import { DrawableObject } from '../DrawableObject.js'

export abstract class Shape extends DrawableObject {
    constructor( position: Vector2, public color: Color = '#f00' ) { super(position) }

    draw( ctx: CanvasRenderingContext2D, offset: Vector2 ): void {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.fillStyle = this.color;
        this.renderShape(ctx);
        ctx.restore();
    }

    isHit(point: Vector2, offset: Vector2): boolean {
        const localX = point.x - offset.x;
        const localY = point.y - offset.y;
        return this.isPointInside(localX, localY);
    }

    protected abstract renderShape(ctx: CanvasRenderingContext2D): void;
    protected abstract isPointInside(x: number, y: number): boolean;
    abstract getBoundingBox(): BoundingBox;
}