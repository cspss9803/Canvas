import { InteractionMode, MouseButton } from './types.js';
import { ViewportManager } from './ViewportManager.js';
import { SelectionManager } from './SelectionManager.js';
import { TransformManager } from './TransformManager.js';
import { KeyboardManager } from './KeyboardManager.js';
import { DrawManager } from './DrawManager.js';
export class CanvasManager {
    constructor(canvas) {
        /** 視角位置 */
        this.viewPostiion = { x: 0, y: 0 };
        /** 點擊畫布的起始位置 */
        this.startPosition = { x: 0, y: 0 };
        /** 紀錄同一幀內是否已經繪製過了，避免在同一幀內重複繪製，造成效能負擔 */
        this.isDrawedInThisFrame = false;
        /** 按下的位置是否剛好在物件上 */
        this.isClickOnObject = false;
        /** 是否正在拖曳 */
        this.isDragging = false;
        /** 用來紀錄每個被拖曳物件的滑鼠相對偏移量 */
        this.dragOffsets = new Map();
        /** 選取框的開始位置 */
        this.selectionStart = null;
        /** 選取框的結束位置 */
        this.selectionEnd = null;
        /** 被選取的所有物件 */
        this.selectedObjects = [];
        /** 所有需要繪製的物件 */
        this.canvasObjects = [];
        /** 目前的互動模式( 檢視 | 移動 ) */
        this.interactionMode = InteractionMode.Selecting;
        this.canvas = canvas;
        this.canvas.style = 'cursor: url(./src/assets/select.svg) 0 0, auto; display: block;';
        const ctx = canvas.getContext('2d');
        if (ctx !== null) {
            this.ctx = ctx;
        }
        else {
            throw new Error('無法取得畫布的繪圖環境(Context)');
        }
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
            this.keyboardManager.handleKeyboardInput(event.code);
        });
        this.resizeWindow();
    }
    startMove(event) {
        if (event.button !== MouseButton.Left)
            return;
        this.startPosition.x = event.clientX - this.viewPostiion.x;
        this.startPosition.y = event.clientY - this.viewPostiion.y;
        this.selectionManager.startSelect(event);
        this.isDragging = true;
        this.updateCursor();
        this.drawManager.draw();
    }
    moving(event) {
        if (!this.isDragging)
            return;
        this.selectionManager.updateSelectionArea(event.clientX, event.clientY);
        this.transformManager.moveSelectedObjects(event.clientX, event.clientY);
        this.viewportManager.moveViewport(event.clientX, event.clientY);
        if (!this.isDrawedInThisFrame) {
            this.isDrawedInThisFrame = true;
            requestAnimationFrame(() => {
                this.drawManager.draw();
                this.isDrawedInThisFrame = false;
            });
        }
    }
    cancelMove(event) {
        this.selectionManager.selectObjects(this.selectionStart, this.selectionEnd, event.shiftKey);
        this.dragOffsets.clear();
        this.isDragging = false;
        this.isClickOnObject = false;
        this.selectionStart = null;
        this.selectionEnd = null;
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
            this.canvas.style.cursor = 'url(./src/assets/select.svg) 0 0, auto';
        }
        else if (this.interactionMode === InteractionMode.Moving) {
            this.canvas.style.cursor = this.isDragging
                ? 'url(./src/assets/grabbing.svg) 16 16, grabbing'
                : 'url(./src/assets/hand.svg) 16 16, grab';
        }
    }
}
