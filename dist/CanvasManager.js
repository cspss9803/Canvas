import { InteractionMode, MouseButton } from './types.js';
import { ViewportManager } from './ViewportManager.js';
import { SelectionManager } from './SelectionManager.js';
import { TransformManager } from './TransformManager.js';
import { KeyboardManager } from './KeyboardManager.js';
import { DrawManager } from './DrawManager.js';
import { EventManager } from './EventManager.js';
import { InputAdapter } from './InputAdapter.js';
export class CanvasManager {
    constructor(canvas) {
        this.viewportPosition = { x: 0, y: 0 };
        this.pointerDownPosition = { x: 0, y: 0 };
        this.isClickOnObject = false;
        this.isDragging = false;
        this.dragOffsets = new Map();
        this.selectionStartPoint = null;
        this.selectionEndPoint = null;
        this.selectedUIObjects = [];
        this.uiObjects = [];
        this.currentInteractionMode = InteractionMode.Selecting;
        this.previousInteractionMode = null;
        this.canvas = canvas;
        this.canvas.style = 'cursor: url(./src/assets/select.svg) 0 0, auto; display: block;';
        this.ctx = canvas.getContext('2d');
        this.viewportManager = new ViewportManager(this);
        this.selectionManager = new SelectionManager(this);
        this.transformManager = new TransformManager(this);
        this.keyboardManager = new KeyboardManager(this);
        this.drawManager = new DrawManager(this);
        this.eventManager = new EventManager(this);
        this.inputAdapter = new InputAdapter(this);
        this.resizeWindow();
    }
    onMouseDown(event) {
        this.pointerDownPosition = this.inputAdapter.getWorldMousePosition(event);
        if (event.button === MouseButton.Left) {
            const screenMousePosition = this.inputAdapter.getScreenMousePosition(event);
            this.selectionManager.startSelect(screenMousePosition, event.shiftKey);
            this.drawManager.draw();
        }
        else if (event.button === MouseButton.Middle) {
            this.previousInteractionMode = this.currentInteractionMode;
            this.currentInteractionMode = InteractionMode.Moving;
        }
        this.isDragging = true;
        this.updateCursor();
    }
    onMouseMove(event) {
        if (!this.isDragging)
            return;
        const screenMousePosition = this.inputAdapter.getScreenMousePosition(event);
        this.selectionManager.updateSelectionArea(screenMousePosition);
        this.transformManager.moveSelectedObjects(screenMousePosition);
        this.viewportManager.moveViewport(screenMousePosition);
        this.drawManager.draw();
    }
    onMouseUp(event) {
        this.selectionManager.endSelect();
        this.resetInteractionState();
        if (event.button === MouseButton.Middle) {
            this.currentInteractionMode = this.previousInteractionMode;
            this.previousInteractionMode = null;
        }
        this.updateCursor();
        this.drawManager.draw();
    }
    resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawManager.draw();
    }
    updateCursor() {
        if (this.currentInteractionMode === InteractionMode.Selecting) {
            this.canvas.style.cursor = 'url(./src/assets/select.svg) 0 0, auto';
        }
        else if (this.currentInteractionMode === InteractionMode.Moving) {
            this.canvas.style.cursor = this.isDragging
                ? 'url(./src/assets/grabbing.svg) 16 16, grabbing'
                : 'url(./src/assets/hand.svg) 16 16, grab';
        }
    }
    resetInteractionState() {
        this.dragOffsets.clear();
        this.isDragging = false;
        this.isClickOnObject = false;
    }
}
