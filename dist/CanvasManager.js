import { InteractionMode, MouseButton } from './types.js';
import { SelectionManager } from './SelectionManager.js';
import { TransformManager } from './TransformManager.js';
import { KeyboardManager } from './KeyboardManager.js';
import { DrawManager } from './DrawManager.js';
import { EventManager } from './EventManager.js';
import { ViewportManager } from './ViewportManager.js';
import { updateMousePosition, updatePointerDownPosition, updateWindowsSize } from './Debug.js';
export class CanvasManager {
    constructor(canvas) {
        this.pointerDownPosition = { x: 0, y: 0 };
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
        this.selectionManager = new SelectionManager(this);
        this.transformManager = new TransformManager(this);
        this.keyboardManager = new KeyboardManager(this);
        this.drawManager = new DrawManager(this);
        this.eventManager = new EventManager(this);
        this.viewPortManager = new ViewportManager(this);
        this.resizeWindow();
    }
    onMouseDown(event) {
        const worldMousePosition = this.viewPortManager.getMouseWorldPositionByEvent(event);
        this.pointerDownPosition = worldMousePosition;
        updatePointerDownPosition(worldMousePosition);
        this.viewPortManager.startTraceMousePosition(event);
        if (event.button === MouseButton.Left) {
            this.selectionManager.startSelect(event.shiftKey);
            this.drawManager.draw();
        }
        if (event.button === MouseButton.Middle) {
            this.previousInteractionMode = this.currentInteractionMode;
            this.currentInteractionMode = InteractionMode.Moving;
        }
        this.isDragging = true;
        this.updateCursor();
    }
    onMouseMove(event) {
        const worldMousePosition = this.viewPortManager.getMouseWorldPositionByEvent(event);
        updateMousePosition(worldMousePosition);
        if (!this.isDragging)
            return;
        if (this.isMoveMode()) {
            this.viewPortManager.pan(event);
        }
        if (this.isSelectMode()) {
            this.selectionManager.updateSelectionArea(worldMousePosition);
            this.transformManager.moveSelectedObjects(worldMousePosition);
        }
        this.drawManager.draw();
    }
    onMouseUp(event) {
        updatePointerDownPosition(null);
        this.selectionManager.endSelect();
        this.viewPortManager.endTraceMousePosition();
        this.dragOffsets.clear();
        this.isDragging = false;
        if (event.button === MouseButton.Middle &&
            this.previousInteractionMode !== null) {
            this.currentInteractionMode = this.previousInteractionMode;
            this.previousInteractionMode = null;
        }
        this.updateCursor();
        this.drawManager.draw();
    }
    resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        updateWindowsSize(this.canvas.width, this.canvas.height);
        this.drawManager.draw();
    }
    onMouseWheel(event) {
        if (!event.ctrlKey)
            return;
        this.viewPortManager.setZoom(event);
        this.drawManager.draw();
    }
    updateCursor() {
        if (this.isSelectMode()) {
            this.canvas.style.cursor = 'url(./src/assets/select.svg) 0 0, auto';
        }
        if (this.isMoveMode()) {
            this.canvas.style.cursor = this.isDragging
                ? 'url(./src/assets/grabbing.svg) 16 16, grabbing'
                : 'url(./src/assets/hand.svg) 16 16, grab';
        }
    }
    isMoveMode() {
        return this.currentInteractionMode === InteractionMode.Moving;
    }
    isSelectMode() {
        return this.currentInteractionMode === InteractionMode.Selecting;
    }
}
