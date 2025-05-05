import type { Color, Vector2, BoundingBox, BoxSize } from '../../types';
import { Shape } from './Shape.js';

export class Box extends Shape {
    constructor( 
        position: Vector2, 
        public size: BoxSize, 
        color?: Color 
    ) { 
        super( position, color );
    }

    protected renderShape(ctx: CanvasRenderingContext2D): void {
        const { x, y } = this.position;
        const { width, height } = this.size;
        ctx.fillRect(x, y, width, height);
    }

    protected isPointInside(x: number, y: number): boolean {
        const { x: px, y: py } = this.position;
        const { width, height } = this.size;
        return x >= px && x <= px + width && y >= py && y <= py + height;
    }

    getBoundingBox(): BoundingBox {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.size.width,
            height: this.size.height
        };
    }
}