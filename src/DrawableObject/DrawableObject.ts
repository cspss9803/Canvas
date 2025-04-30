import type { Vector2, BoundingBox } from '../types'

interface Drawable {

    position: Vector2
    draw(ctx: CanvasRenderingContext2D, viewPostiion: Vector2): void
    getBoundingBox(viewPostiion: Vector2): BoundingBox
    isHit(point: Vector2, viewPostiion: Vector2): boolean

}

export abstract class DrawableObject implements Drawable {

    constructor(public position: Vector2) {}
    abstract draw(ctx: CanvasRenderingContext2D, viewPostiion: Vector2): void
    abstract getBoundingBox(viewPostiion: Vector2): BoundingBox;
    abstract isHit(point: Vector2, viewPostiion: Vector2): boolean

}
