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
        this.viewPostiion = { x: 0, y: 0 };
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
        this.start.x = clientX - this.viewPostiion.x;
        this.start.y = clientY - this.viewPostiion.y;
        const mouseX = this.start.x;
        const mouseY = this.start.y;
        // 如果正在選取模式中
        if (this.interactionMode === InteractionMode.Selecting) {
            // 開始尋找被點擊到的物件
            for (const object of [...this.objects].reverse()) {
                const point = { x: clientX, y: clientY };
                // 真的有物件被點擊到的話
                if (object.containsPoint(point, this.viewPostiion)) {
                    this.isClickOnObject = true;
                    // 在長按著 Shift 鍵時，點到這個物件的話
                    if (event.shiftKey) {
                        const index = this.selectedObjects.indexOf(object);
                        const isObjectSelected = index !== -1;
                        if (isObjectSelected) {
                            // 如果物件已經被選取，則取消選取
                            this.selectedObjects.splice(index, 1);
                        }
                        else {
                            // 如果物件還沒被選取，那就新增到選取清單
                            this.selectedObjects.push(object);
                        }
                    }
                    // 在沒按著 Shift 鍵時，點到這個物件的話
                    else {
                        // 清除其他選取並選取該物件
                        this.dragOffsets.clear();
                        if (!this.selectedObjects.includes(object)) {
                            this.selectedObjects = [object];
                        }
                        // 初始化拖曳偏移量
                        for (const object of this.selectedObjects) {
                            this.dragOffsets.set(object, {
                                x: mouseX - object.position.x,
                                y: mouseY - object.position.y,
                            });
                        }
                    }
                    break;
                }
            }
            // 如果按下的位置剛好在空白處
            if (!this.isClickOnObject) {
                // 同時又沒按著 Shift
                if (!event.shiftKey) {
                    this.selectedObjects = []; // 才能清空選取的物件
                    this.dragOffsets.clear(); // 同時也清空拖曳偏移量
                }
                // 並且開始選取範圍
                this.selectionStart = { x: clientX, y: clientY };
                this.selectionEnd = { x: clientX, y: clientY };
            }
        }
        // 如果正在移動模式中
        else if (this.interactionMode === InteractionMode.Moving) {
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
            const mouseX = clientX - this.viewPostiion.x;
            const mouseY = clientY - this.viewPostiion.y;
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
            this.viewPostiion.x = clientX - this.start.x;
            this.viewPostiion.y = clientY - this.start.y;
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
        // 如果滑鼠放開前，正在進行框選的話
        if (this.isDragging && this.selectionStart && this.selectionEnd) {
            // 取得框選範圍
            const selectionEdges = {
                minX: Math.min(this.selectionStart.x, this.selectionEnd.x),
                maxX: Math.max(this.selectionStart.x, this.selectionEnd.x),
                minY: Math.min(this.selectionStart.y, this.selectionEnd.y),
                maxY: Math.max(this.selectionStart.y, this.selectionEnd.y),
            };
            // 如果沒按著 Shift 鍵，就得清空選取清單
            if (!event.shiftKey)
                this.selectedObjects = [];
            // 尋找所有 (完全在選取範圍內|有碰觸到選取範圍) 的物件
            for (const object of this.objects) {
                if (isObjectWouldBeSelected(object, selectionEdges, this.viewPostiion, SelectionMode.Intersect)) {
                    // 如果這個物件尚未在選取清單中，才新增進選取清單
                    if (!this.selectedObjects.includes(object)) {
                        this.selectedObjects.push(object);
                    }
                }
            }
        }
        // 清除本次位移的偏移，避免影響到下一次
        this.dragOffsets.clear();
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
