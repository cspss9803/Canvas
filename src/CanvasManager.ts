import { DrawableObject } from './DrawableObject/DrawableObject.js'
import type { Vector2 } from './types'
import { InteractionMode, MouseButton } from './types.js'
import { ViewportManager } from './ViewportManager.js'
import { SelectionManager } from './SelectionManager.js'
import { TransformManager } from './TransformManager.js'
import { KeyboardManager } from './KeyboardManager.js'
import { DrawManager } from './DrawManager.js'
import { EventManager } from './EventManager.js'
import { InputAdapter } from './InputAdapter.js'

export class CanvasManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    viewPosition: Vector2 = { x: 0, y: 0 };
    startPosition: Vector2 = { x: 0, y: 0 };
    isClickOnObject = false;
    isDragging = false;
    dragOffsets: Map<DrawableObject, Vector2> = new Map();
    selectionStart: Vector2 | null = null;
    selectionEnd: Vector2 | null = null;
    selectedObjects: DrawableObject[] = [];
    canvasObjects: DrawableObject[] = [];
    interactionMode = InteractionMode.Selecting;
    viewportManager: ViewportManager
    selectionManager: SelectionManager
    transformManager: TransformManager
    keyboardManager: KeyboardManager
    drawManager: DrawManager
    eventManager: EventManager
    inputAdapter: InputAdapter
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.style = 'cursor: url(./src/assets/select.svg) 0 0, auto; display: block;';
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D ;
        this.viewportManager = new ViewportManager(this);
        this.selectionManager = new SelectionManager(this);
        this.transformManager = new TransformManager(this);
        this.keyboardManager = new KeyboardManager(this);
        this.drawManager = new DrawManager(this);
        this.eventManager = new EventManager(this);
        this.inputAdapter = new InputAdapter(this);
        this.resizeWindow();
    }

    onMouseDown(event: MouseEvent) {
        if (event.button !== MouseButton.Left) return;
        const screenMousePosition = this.inputAdapter.getScreenMousePosition(event);
        this.startPosition = this.inputAdapter.getWorldMousePosition(event);
        this.selectionManager.startSelect(screenMousePosition, event.shiftKey);
        this.isDragging = true;
        this.updateCursor();
        this.drawManager.draw();
    }

    onMouseMove(event: MouseEvent) {
        if (!this.isDragging) return;
        const screenMousePosition = this.inputAdapter.getScreenMousePosition(event);
        this.selectionManager.updateSelectionArea(screenMousePosition);
        this.transformManager.moveSelectedObjects(screenMousePosition);
        this.viewportManager.moveViewport(screenMousePosition);
        this.drawManager.draw();
    }

    onMouseUp(event: MouseEvent) {
        this.selectionManager.selectObjects(this.selectionStart, this.selectionEnd, event.shiftKey);
        this.resetInteractionState();
        this.updateCursor();
        this.drawManager.draw();
    }

    resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawManager.draw();
    }

    updateCursor() {
        if (this.interactionMode === InteractionMode.Selecting) {
            this.canvas.style.cursor = 'url(./src/assets/select.svg) 0 0, auto'
        } else if (this.interactionMode === InteractionMode.Moving) {
            this.canvas.style.cursor = this.isDragging 
                ? 'url(./src/assets/grabbing.svg) 16 16, grabbing'
                : 'url(./src/assets/hand.svg) 16 16, grab'
        }
    }

    resetInteractionState() {
        this.dragOffsets.clear();
        this.isDragging = false;
        this.isClickOnObject = false;
        this.selectionStart = null;
        this.selectionEnd = null;
    }

}