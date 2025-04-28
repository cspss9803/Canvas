import type { Vector2, BoundingBox } from '../types'

interface Drawable {

    position: Vector2
    draw(ctx: CanvasRenderingContext2D, offset: Vector2): void
    getBoundingBox(offset: Vector2): BoundingBox
    containsPoint(point: Vector2, offset: Vector2): boolean

}

export abstract class DrawableObject implements Drawable {

    constructor(public position: Vector2) {}
    abstract draw(ctx: CanvasRenderingContext2D, offset: Vector2): void
    abstract getBoundingBox(offset: Vector2): BoundingBox;
    abstract containsPoint(point: Vector2, offset: Vector2): boolean

}
