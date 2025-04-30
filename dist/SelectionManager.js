import { InteractionMode, SelectionMode } from './types.js';
import { isObjectWouldBeSelected } from './BoundingBoxHelper.js';
export class SelectionManager {
    constructor(canvasManager) { this.canvasManager = canvasManager; }
    startSelect(screenMousePosition, usedShift) {
        if (this.canvasManager.interactionMode !== InteractionMode.Selecting)
            return;
        const canvasManager = this.canvasManager;
        // 從頂到底開始尋找被點擊到的物件
        for (const object of [...canvasManager.canvasObjects].reverse()) {
            // 真的有物件被點擊到的話
            if (object.isHit(screenMousePosition, canvasManager.viewPosition)) {
                canvasManager.isClickOnObject = true;
                if (usedShift) {
                    const index = canvasManager.selectedObjects.indexOf(object);
                    if (index !== -1) {
                        canvasManager.selectedObjects.splice(index, 1);
                    }
                    else {
                        canvasManager.selectedObjects.push(object);
                    }
                }
                // 在沒按著 Shift 鍵時，點到這個物件的話
                else {
                    canvasManager.dragOffsets.clear();
                    if (!canvasManager.selectedObjects.includes(object)) {
                        canvasManager.selectedObjects = [object];
                    }
                    // 初始化拖曳偏移量
                    for (const object of canvasManager.selectedObjects) {
                        canvasManager.dragOffsets.set(object, {
                            x: canvasManager.startPosition.x - object.position.x,
                            y: canvasManager.startPosition.y - object.position.y,
                        });
                    }
                }
                break;
            }
        }
        // 如果按下的位置剛好在空白處
        if (!canvasManager.isClickOnObject) {
            if (usedShift) {
                canvasManager.selectedObjects = []; // 才能清空選取的物件
                canvasManager.dragOffsets.clear(); // 同時也清空拖曳偏移量
            }
            // 並且開始選取範圍
            canvasManager.selectionStart = screenMousePosition;
            canvasManager.selectionEnd = screenMousePosition;
        }
    }
    updateSelectionArea(screenMousePosition) {
        if (this.canvasManager.interactionMode !== InteractionMode.Selecting ||
            this.canvasManager.selectionStart === null)
            return;
        this.canvasManager.selectionEnd = screenMousePosition;
    }
    selectObjects(start, end, usedShift) {
        if (this.canvasManager.isDragging && start && end) {
            // 如果沒按著 Shift 鍵，就得清空選取清單
            if (!usedShift)
                this.canvasManager.selectedObjects = [];
            // 取得框選範圍
            const selectionEdges = {
                minX: Math.min(start.x, end.x),
                maxX: Math.max(start.x, end.x),
                minY: Math.min(start.y, end.y),
                maxY: Math.max(start.y, end.y),
            };
            // 尋找所有 (完全在選取範圍內|有碰觸到選取範圍) 的物件
            for (const object of this.canvasManager.canvasObjects) {
                if (isObjectWouldBeSelected(object, selectionEdges, this.canvasManager.viewPosition, SelectionMode.Intersect)) {
                    // 如果這個物件尚未在選取清單中，才新增進選取清單
                    if (!this.canvasManager.selectedObjects.includes(object)) {
                        this.canvasManager.selectedObjects.push(object);
                    }
                }
            }
        }
    }
}
