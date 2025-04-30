import { DrawableObject } from './DrawableObject/DrawableObject.js'
import type { Vector2 } from './types.js'
import { InteractionMode, MouseButton } from './types.js'
import { ViewportManager } from './ViewportManager.js'
import { SelectionManager } from './SelectionManager.js'
import { TransformManager } from './TransformManager.js'
import { KeyboardManager } from './KeyboardManager.js'
import { DrawManager } from './DrawManager.js'

export class CanvasManager {

    /** 畫布 */
    canvas: HTMLCanvasElement;

    /** 畫布的繪圖環境 */
    ctx: CanvasRenderingContext2D;

    /** 視角位置 */
    viewPostiion: Vector2 = { x: 0, y: 0 };

    /** 點擊畫布的起始位置 */
    startPosition: Vector2 = { x: 0, y: 0 };

    /** 紀錄同一幀內是否已經繪製過了，避免在同一幀內重複繪製，造成效能負擔 */
    isDrawedInThisFrame: boolean = false;

    /** 按下的位置是否剛好在物件上 */
    isClickOnObject = false;

    /** 是否正在拖曳 */
    isDragging = false;

    /** 用來紀錄每個被拖曳物件的滑鼠相對偏移量 */
    dragOffsets: Map<DrawableObject, Vector2> = new Map();

    /** 選取框的開始位置 */
    selectionStart: Vector2 | null = null;

    /** 選取框的結束位置 */
    selectionEnd: Vector2 | null = null;

    /** 被選取的所有物件 */
    selectedObjects: DrawableObject[] = [];

    /** 所有需要繪製的物件 */
    canvasObjects: DrawableObject[] = [];

    /** 目前的互動模式( 檢視 | 移動 ) */
    interactionMode: InteractionMode = InteractionMode.Selecting;

    viewportManager: ViewportManager
    selectionManager: SelectionManager
    transformManager: TransformManager
    keyboardManager: KeyboardManager
    drawManager: DrawManager

    constructor(canvas: HTMLCanvasElement) {

        this.canvas = canvas
        this.canvas.style = 'cursor: url(./src/assets/select.svg) 0 0, auto; display: block;'

        const ctx = canvas.getContext('2d')
        if ( ctx !== null ) { this.ctx = ctx }
        else { throw new Error('無法取得畫布的繪圖環境(Context)') }
        
        this.viewportManager = new ViewportManager(this);
        this.selectionManager = new SelectionManager(this);
        this.transformManager = new TransformManager(this);
        this.keyboardManager = new KeyboardManager(this);
        this.drawManager = new DrawManager(this);

        window.addEventListener('contextmenu', event => event.preventDefault());
        window.addEventListener('mousedown', event => this.startMove(event));
        window.addEventListener('mousemove', event => this.moving(event));
        window.addEventListener('mouseup', event => this.cancelMove(event));
        window.addEventListener('resize', () => this.resizeWindow());
        window.addEventListener('keydown', event => {
            this.keyboardManager.handleKeyboardInput( event.code );
        });
        this.resizeWindow();
    }

    startMove(event: MouseEvent) {
        if ( event.button !== MouseButton.Left ) return;
        this.startPosition.x = event.clientX - this.viewPostiion.x;
        this.startPosition.y = event.clientY - this.viewPostiion.y;
        this.selectionManager.startSelect( event );
        this.isDragging = true;
        this.updateCursor();
        this.drawManager.draw();
    }

    moving( event: MouseEvent ) {
        if ( !this.isDragging ) return;
        this.selectionManager.updateSelectionArea(event.clientX, event.clientY);
        this.transformManager.moveSelectedObjects(event.clientX, event.clientY);
        this.viewportManager.moveViewport(event.clientX, event.clientY);
        if ( !this.isDrawedInThisFrame ) {
            this.isDrawedInThisFrame = true;
            requestAnimationFrame(() => {
                this.drawManager.draw();
                this.isDrawedInThisFrame = false;
            });
        }
    }

    cancelMove(event: MouseEvent) {
        this.selectionManager.selectObjects(
            this.selectionStart,
            this.selectionEnd,
            event.shiftKey
        )
        this.dragOffsets.clear()
        this.isDragging = false
        this.isClickOnObject = false
        this.selectionStart = null
        this.selectionEnd = null
        this.updateCursor()
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
        } 
        
        else if (this.interactionMode === InteractionMode.Moving) {
            this.canvas.style.cursor = this.isDragging 
                ? 'url(./src/assets/grabbing.svg) 16 16, grabbing'
                : 'url(./src/assets/hand.svg) 16 16, grab'
        }
    }

}