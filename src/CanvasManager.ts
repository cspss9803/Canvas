import type { UIObject } from './UIObject/UIObject'
import type { Vector2 } from './types'
import { InteractionMode, MouseButton } from './types.js'
import { ViewportManager } from './ViewportManager.js'
import { SelectionManager } from './SelectionManager.js'
import { TransformManager } from './TransformManager.js'
import { KeyboardManager } from './KeyboardManager.js'
import { DrawManager } from './DrawManager.js'
import { EventManager } from './EventManager.js'
import { CoordinateTransformer } from './CoordinateTransformer.js'
import { updateMousePosition, updatePointerDownPosition, updateOffset, updateZoom, updateWindowsSize } from './Debug.js'

export class CanvasManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    offset: Vector2 = { x: 200, y: 200 };
    pointerDownPosition: Vector2 = { x: 0, y: 0 };
    zoom: number = 1;
    isClickOnObject = false;
    isDragging = false;
    dragOffsets: Map<UIObject, Vector2> = new Map();
    selectionStartPoint: Vector2 | null = null;
    selectionEndPoint: Vector2 | null = null;
    selectedUIObjects: UIObject[] = [];
    uiObjects: UIObject[] = [];
    currentInteractionMode = InteractionMode.Selecting;
    previousInteractionMode: InteractionMode | null = null
    viewportManager: ViewportManager
    selectionManager: SelectionManager
    transformManager: TransformManager
    keyboardManager: KeyboardManager
    drawManager: DrawManager
    eventManager: EventManager
    coordinateTransformer: CoordinateTransformer
    
    constructor( canvas: HTMLCanvasElement ) {
        this.canvas = canvas;
        this.canvas.style = 'cursor: url(./src/assets/select.svg) 0 0, auto; display: block;';
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D ;
        this.viewportManager = new ViewportManager(this);
        this.selectionManager = new SelectionManager(this);
        this.transformManager = new TransformManager(this);
        this.keyboardManager = new KeyboardManager(this);
        this.drawManager = new DrawManager(this);
        this.eventManager = new EventManager(this);
        this.coordinateTransformer = new CoordinateTransformer(this);
        this.resizeWindow();
    }

    onMouseDown(event: MouseEvent) {

        const worldMousePosition = this.coordinateTransformer.screenToWorld({
            x: event.clientX,
            y: event.clientY
        });
        this.pointerDownPosition = worldMousePosition;
        updatePointerDownPosition( this.pointerDownPosition );

        if (event.button === MouseButton.Left) {
            this.selectionManager.startSelect( event.shiftKey );
            this.drawManager.draw();
        }

        else if (event.button === MouseButton.Middle) {
            this.previousInteractionMode = this.currentInteractionMode;
            this.currentInteractionMode = InteractionMode.Moving;
        }

        this.isDragging = true;
        this.updateCursor();
    }

    onMouseMove(event: MouseEvent) {
        const worldMousePosition = this.coordinateTransformer.screenToWorld({
            x: event.clientX,
            y: event.clientY
        });
        updateMousePosition(worldMousePosition);
        if (!this.isDragging) return;
        this.selectionManager.updateSelectionArea(worldMousePosition);
        this.transformManager.moveSelectedObjects(worldMousePosition);
        this.viewportManager.moveViewport(worldMousePosition);
        this.drawManager.draw();
    }

    onMouseUp(event: MouseEvent) {
        updatePointerDownPosition( null );
        this.selectionManager.endSelect()
        this.resetInteractionState();

        if (event.button === MouseButton.Middle) {
            this.currentInteractionMode = this.previousInteractionMode as InteractionMode;
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

    onMouseWheel(event: WheelEvent) {
        if (!event.ctrlKey) return;
        const ZOOM_PERCENT_STEP = 0.05; // 5%
        const isZoomingIn = event.deltaY < 0; // 上滾是放大，deltaY 為負
        let newZoom = this.zoom + ( isZoomingIn ? ZOOM_PERCENT_STEP : -ZOOM_PERCENT_STEP );
    
        // 限制範圍
        newZoom = Math.min(2, Math.max(0.5, newZoom));
    
        // 四捨五入保留小數第三位
        this.zoom = Math.round(newZoom * 1000) / 1000;

        updateZoom(this.zoom)
        updateOffset(this.offset)
        this.drawManager.draw();
    }

    updateCursor() {
        if (this.currentInteractionMode === InteractionMode.Selecting) {
            this.canvas.style.cursor = 'url(./src/assets/select.svg) 0 0, auto'
        } else if (this.currentInteractionMode === InteractionMode.Moving) {
            this.canvas.style.cursor = this.isDragging 
                ? 'url(./src/assets/grabbing.svg) 16 16, grabbing'
                : 'url(./src/assets/hand.svg) 16 16, grab'
        }
    }

    resetInteractionState() {
        this.dragOffsets.clear();
        this.isDragging = false;
        this.isClickOnObject = false;
    }

}