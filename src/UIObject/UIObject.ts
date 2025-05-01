import type { Vector2, BoundingBox } from '../types';

export interface UIObject {
    position: Vector2;

    draw(ctx: CanvasRenderingContext2D, viewPosition: Vector2): void;
    getBoundingBox(viewPosition: Vector2): BoundingBox;
    isHit(point: Vector2, viewPosition: Vector2): boolean;

    onClick?(e: MouseEvent): void;
    onDoubleClick?(e: MouseEvent): void;
    onDrag?(delta: Vector2): void;
    onResize?(delta: Vector2): void;
    onTextInput?(text: string): void;
}

export abstract class UIObjectBase implements UIObject {
    constructor(public position: Vector2) {}

    abstract draw(ctx: CanvasRenderingContext2D, viewPosition: Vector2): void;
    abstract getBoundingBox(viewPosition: Vector2): BoundingBox;
    abstract isHit(point: Vector2, viewPosition: Vector2): boolean;

    // 以下是互動函式，可由子類 override
    onClick?(e: MouseEvent): void;
    onDoubleClick?(e: MouseEvent): void;
    onDrag?(delta: Vector2): void;
    onResize?(delta: Vector2): void;
    onTextInput?(text: string): void;
}