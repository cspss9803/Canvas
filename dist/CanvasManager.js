import { SelectionMode } from './types.js';
import { InteractionMode, MouseButton } from './types.js';
import { draw } from './DrawManager.js';
import { isObjectWouldBeSelected } from "./BoundingBoxHelper.js";
export class CanvasManager {
    constructor(canvas) {
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
        this.objects = [];
        /** 目前的互動模式( 檢視 | 移動 ) */
        this.interactionMode = InteractionMode.Selecting;
        this.canvas = canvas;
        this.canvas.style = 'cursor: url(./src/assets/select.svg) 0 0, auto; display: block;';
        const ctx = canvas.getContext('2d');
        if (ctx !== null) {
            this.ctx = ctx;
        }
        else {
            throw new Error('Canvas is not supported');
        }
        this.offset = { x: 0, y: 0 };
        this.start = { x: 0, y: 0 };
        this.isDrawedInThisFrame = false;
        window.addEventListener('contextmenu', event => event.preventDefault());
        window.addEventListener('mousedown', event => this.startMove(event));
        window.addEventListener('mousemove', event => this.moving(event));
        window.addEventListener('mouseup', event => this.cancelMove(event));
        window.addEventListener('keydown', event => this.keyboardHandle(event));
        window.addEventListener('resize', () => this.resizeWindow());
        this.resizeWindow();
    }
    startMove(event) {
        if (event.button !== MouseButton.Left)
            return;
        const clientX = event.clientX;
        const clientY = event.clientY;
        this.start.x = clientX - this.offset.x;
        this.start.y = clientY - this.offset.y;
        const mouseX = this.start.x;
        const mouseY = this.start.y;
        // 如果正在選取模式中
        if (this.interactionMode === InteractionMode.Selecting) {
            // 從最頂層的物件開始遍歷
            for (const object of [...this.objects].reverse()) {
                const point = { x: clientX, y: clientY };
                // 按下的點在剛好在物件上
                if (object.containsPoint(point, this.offset)) {
                    this.isClickOnObject = true;
                    this.dragOffsets.clear();
                    if (!this.selectedObjects.includes(object))
                        this.selectedObjects = [object];
                    for (const object of this.selectedObjects) {
                        this.dragOffsets.set(object, {
                            x: mouseX - object.position.x,
                            y: mouseY - object.position.y
                        });
                    }
                    break;
                }
            }
            // 如果按下的位置是否剛好在空白處
            if (!this.isClickOnObject) {
                // 代表沒有選取到任何物件，所以要清除選取的物件
                // this.selectedObject = null
                this.selectedObjects = [];
                // 並且開始選取範圍
                this.selectionStart = { x: clientX, y: clientY };
                this.selectionEnd = { x: clientX, y: clientY };
            }
        }
        // 如果正在移動模式中
        if (this.interactionMode === InteractionMode.Moving) {
            this.selectedObjects = [];
        }
        this.isDragging = true;
        this.updateCursor();
        draw(this);
    }
    moving(event) {
        if (!this.isDragging)
            return;
        const clientX = event.clientX;
        const clientY = event.clientY;
        // 如果正在選取模式中
        if (this.interactionMode === InteractionMode.Selecting) {
            const mouseX = clientX - this.offset.x;
            const mouseY = clientY - this.offset.y;
            // 如果正在進行框選的話
            if (this.selectionStart) {
                // 那就持續更新結束點的位置
                this.selectionEnd = { x: clientX, y: clientY };
            }
            // 如果沒有在進行框選的話
            else {
                // 移動所有被選取的物件
                for (const object of this.selectedObjects) {
                    const offsetForShape = this.dragOffsets.get(object);
                    if (offsetForShape) {
                        object.position.x = mouseX - offsetForShape.x;
                        object.position.y = mouseY - offsetForShape.y;
                    }
                }
            }
        }
        // 如果正在移動模式中
        if (this.interactionMode === InteractionMode.Moving) {
            this.offset.x = clientX - this.start.x;
            this.offset.y = clientY - this.start.y;
        }
        // 如果這一幀還沒有被繪製過，才能進行繪製
        if (!this.isDrawedInThisFrame) {
            this.isDrawedInThisFrame = true;
            requestAnimationFrame(() => {
                draw(this);
                this.isDrawedInThisFrame = false;
            });
        }
    }
    cancelMove(event) {
        // 如果正在框選的話
        if (this.isDragging && this.selectionStart && this.selectionEnd) {
            this.selectedObjects = [];
            const selectionEdges = {
                minX: Math.min(this.selectionStart.x, this.selectionEnd.x),
                maxX: Math.max(this.selectionStart.x, this.selectionEnd.x),
                minY: Math.min(this.selectionStart.y, this.selectionEnd.y),
                maxY: Math.max(this.selectionStart.y, this.selectionEnd.y)
            };
            for (const object of this.objects) {
                if (isObjectWouldBeSelected(object, selectionEdges, this.offset, SelectionMode.Intersect))
                    this.selectedObjects.push(object);
            }
        }
        this.isDragging = false;
        this.isClickOnObject = false;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.updateCursor();
        draw(this);
    }
    keyboardHandle(event) {
        if (event.code === 'KeyV') {
            this.interactionMode = InteractionMode.Selecting;
            this.updateCursor();
        }
        if (event.code === 'KeyH') {
            this.interactionMode = InteractionMode.Moving;
            this.updateCursor();
        }
        if (event.code === 'Delete') {
            if (this.selectedObjects.length > 0) {
                for (const object of this.selectedObjects) {
                    const index = this.objects.indexOf(object);
                    if (index !== -1) {
                        this.objects.splice(index, 1);
                    }
                }
                this.selectedObjects = [];
            }
            draw(this);
        }
    }
    resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        draw(this);
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
    draw() { draw(this); }
}
