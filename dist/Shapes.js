export class DrawableObject {
    constructor(position) {
        this.position = position;
    }
    draw(ctx, offset) {
    }
}
export class Shape {
    constructor(position, color = '#ff0000') {
        this.position = position;
        this.color = color;
    }
    draw(ctx, offset) {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.fillStyle = this.color;
        this.renderShape(ctx);
        ctx.restore();
    }
    highlight(ctx, offset) {
        const box = this.getBoundingBox();
        const lineWidth = 3;
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.strokeStyle = 'rgb(0, 106, 255)';
        ctx.lineWidth = lineWidth;
        const x = box.x - lineWidth / 2;
        const y = box.y - lineWidth / 2;
        const width = box.width + lineWidth;
        const height = box.height + lineWidth;
        const radius = 3;
        ctx.roundedStrokeRect(x, y, width, height, radius);
        ctx.restore();
    }
    containsPoint(globalX, globalY, offset) {
        const localX = globalX - offset.x;
        const localY = globalY - offset.y;
        return this.isPointInside(localX, localY);
    }
}
export class Box extends Shape {
    constructor(position, size, color = '#ff0000') {
        super(position, color);
        this.size = size;
    }
    renderShape(ctx) {
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
    isPointInside(x, y) {
        const { x: px, y: py } = this.position;
        const { width, height } = this.size;
        return x >= px && x <= px + width && y >= py && y <= py + height;
    }
    getBoundingBox() {
        return { x: this.position.x, y: this.position.y, width: this.size.width, height: this.size.height };
    }
}
export class Circle extends Shape {
    constructor(position, radius, color = '#ff0000') {
        super(position, color);
        this.radius = radius;
    }
    renderShape(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
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
