import { InteractionMode, SelectionMode } from './types.js';
import { isObjectWouldBeSelected } from './BoundingBoxHelper.js';
export class SelectionManager {
    constructor(canvasManager) {
        this.selectionSnapshot = new Set();
        this.processedInDrag = new Set();
        this.canvasManager = canvasManager;
    }
    startSelect(usedShift) {
        if (this.canvasManager.currentInteractionMode !== InteractionMode.Selecting)
            return;
        const canvasManager = this.canvasManager;
        // 從頂到底開始尋找被點擊到的物件
        for (const object of [...canvasManager.uiObjects].reverse()) {
            // 真的有物件被點擊到的話
            if (object.isHit(canvasManager.pointerDownPosition, canvasManager.viewPortManager.offset)) {
                canvasManager.isClickOnObject = true;
                // 有按著 Shift 鍵時，點到這物件的話，如果它已被選取就取消選取，反之則進行選取
                if (usedShift) {
                    this.toggleSelection(object);
                }
                // 在沒按著 Shift 鍵時，點到這個物件的話
                else {
                    canvasManager.dragOffsets.clear();
                    if (!canvasManager.selectedUIObjects.includes(object)) {
                        canvasManager.selectedUIObjects.length = 0;
                        canvasManager.selectedUIObjects.push(object);
                        canvasManager.selectedUIObjects = [object];
                    }
                    // 初始化拖曳偏移量
                    for (const object of canvasManager.selectedUIObjects) {
                        canvasManager.dragOffsets.set(object, {
                            x: canvasManager.pointerDownPosition.x - object.position.x,
                            y: canvasManager.pointerDownPosition.y - object.position.y,
                        });
                    }
                }
                break;
            }
        }
        // 如果按下的位置剛好在空白處
        if (!canvasManager.isClickOnObject) {
            if (!usedShift) { // 沒按著 Shift 的話
                canvasManager.selectedUIObjects = []; // 才能清空選取的物件
                canvasManager.dragOffsets.clear(); // 同時也清空拖曳偏移量
            }
            this.selectionSnapshot = new Set(canvasManager.selectedUIObjects);
            this.processedInDrag.clear();
            // 並且開始選取範圍
            canvasManager.selectionStartPoint = canvasManager.pointerDownPosition;
            canvasManager.selectionEndPoint = canvasManager.pointerDownPosition;
        }
    }
    updateSelectionArea(worldMousePosition) {
        if (this.canvasManager.currentInteractionMode !== InteractionMode.Selecting ||
            this.canvasManager.selectionStartPoint === null)
            return;
        this.canvasManager.selectionEndPoint = worldMousePosition;
        const selectionEdges = {
            minX: Math.min(this.canvasManager.selectionStartPoint.x, this.canvasManager.selectionEndPoint.x),
            maxX: Math.max(this.canvasManager.selectionStartPoint.x, this.canvasManager.selectionEndPoint.x),
            minY: Math.min(this.canvasManager.selectionStartPoint.y, this.canvasManager.selectionEndPoint.y),
            maxY: Math.max(this.canvasManager.selectionStartPoint.y, this.canvasManager.selectionEndPoint.y),
        };
        const selectedSet = new Set(this.canvasManager.selectedUIObjects);
        for (const object of this.canvasManager.uiObjects) {
            const isInBox = isObjectWouldBeSelected(object, selectionEdges, SelectionMode.Intersect);
            const wasSelected = this.selectionSnapshot.has(object);
            const isCurrentlySelected = selectedSet.has(object);
            if (isInBox) {
                if (wasSelected && isCurrentlySelected) {
                    // 原本有選 + 現在有框到 = 要取消
                    this.canvasManager.selectedUIObjects.splice(this.canvasManager.selectedUIObjects.indexOf(object), 1);
                }
                else if (!wasSelected && !isCurrentlySelected) {
                    // 原本沒選 + 現在有框到 = 要選取
                    this.canvasManager.selectedUIObjects.push(object);
                }
            }
            else { // 選取框沒有碰到 = 恢復成原本狀態
                if (wasSelected && !isCurrentlySelected) {
                    // 原本有被選取 + 現在沒被框到 = 恢復成選取狀態
                    this.canvasManager.selectedUIObjects.push(object);
                }
                else if (!wasSelected && isCurrentlySelected) {
                    // 原本沒被選取 + 現在沒被框到 = 恢復成未選取狀態
                    this.canvasManager.selectedUIObjects.splice(this.canvasManager.selectedUIObjects.indexOf(object), 1);
                }
            }
        }
    }
    endSelect() {
        this.canvasManager.selectionStartPoint = null;
        this.canvasManager.selectionEndPoint = null;
        this.processedInDrag.clear();
        this.selectionSnapshot.clear();
    }
    toggleSelection(object) {
        const index = this.canvasManager.selectedUIObjects.indexOf(object);
        if (index !== -1) {
            this.canvasManager.selectedUIObjects.splice(index, 1);
        }
        else {
            this.canvasManager.selectedUIObjects.push(object);
        }
    }
}
