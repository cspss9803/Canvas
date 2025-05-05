import type { Color, Vector2, BoundingBox } from '../../types';
import { Shape } from './Shape.js';

export class Circle extends Shape {
    constructor(
        position: Vector2,
        public radius: number,
        color?: Color
    ) {
        super( position, color );
    }

    protected renderShape( ctx: CanvasRenderingContext2D ): void {

        const { x, y } = this.position;
        const { radius } = this;
        const startAngle = 0;
        const endAngle = Math.PI * 2;

        ctx.beginPath();
        ctx.arc( x, y, radius, startAngle, endAngle );
        ctx.fill()

    }

    protected isPointInside( x: number, y: number ): boolean {
        const dx = x - this.position.x;
        const dy = y - this.position.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }

    getBoundingBox(): BoundingBox {
        return {
            x: this.position.x - this.radius,
            y: this.position.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}