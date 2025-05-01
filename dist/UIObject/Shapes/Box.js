import { Shape } from './Shape.js';
export class Box extends Shape {
    constructor(position, size, color) {
        super(position, color);
        this.size = size;
    }
    renderShape(ctx) {
        const { x, y } = this.position;
        const { width, height } = this.size;
        ctx.fillRect(x, y, width, height);
    }
    isPointInside(x, y) {
        const { x: px, y: py } = this.position;
        const { width, height } = this.size;
        return x >= px && x <= px + width && y >= py && y <= py + height;
    }
    getBoundingBox() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.size.width,
            height: this.size.height
        };
    }
}
