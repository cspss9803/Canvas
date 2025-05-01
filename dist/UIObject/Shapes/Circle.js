import { Shape } from './Shape.js';
export class Circle extends Shape {
    constructor(position, radius, color) {
        super(position, color);
        this.radius = radius;
    }
    renderShape(ctx) {
        const { x, y } = this.position;
        const { radius } = this;
        const startAngle = 0;
        const endAngle = Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx.fill();
    }
    isPointInside(x, y) {
        const dx = x - this.position.x;
        const dy = y - this.position.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
    getBoundingBox() {
        return {
            x: this.position.x - this.radius,
            y: this.position.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}
