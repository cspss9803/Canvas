import { CanvasManager } from './CanvasManager.js'
import { InteractionMode, Vector2, SelectionMode } from './types.js'
import type { BoundingEdges } from './types.js'
import { isObjectWouldBeSelected } from './BoundingBoxHelper.js'

export class SelectionManager {

    canvasManager: CanvasManager

    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager 
    }

    startSelect( event: MouseEvent ){

        // 互動模式必須是在 "選取模式" 下
        if ( this.canvasManager.interactionMode !== InteractionMode.Selecting ) return

        const canvasManager = this.canvasManager;;

        // 開始尋找被點擊到的物件
        for ( const object of [...canvasManager.canvasObjects].reverse() ) {
            const point = { x: event.clientX, y: event.clientY };
            // 真的有物件被點擊到的話
            if ( object.isHit(point, canvasManager.viewPostiion) ) {
                canvasManager.isClickOnObject = true;

                // 在長按著 Shift 鍵時，點到這個物件的話
                if ( event.shiftKey ) {
                    
                    const index = canvasManager.selectedObjects.indexOf(object);
                    if ( index !== -1 ) {
                        // 如果物件已經被選取，則取消選取
                        canvasManager.selectedObjects.splice(index, 1);
                    } 
                    
                    else {
                        // 如果物件還沒被選取，那就新增到選取清單
                        canvasManager.selectedObjects.push(object);
                    }

                } 
                
                // 在沒按著 Shift 鍵時，點到這個物件的話
                else {

                    // 清除其他選取並選取該物件
                    canvasManager.dragOffsets.clear();
                    if ( !canvasManager.selectedObjects.includes(object) ) {
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
        if ( !canvasManager.isClickOnObject ) {

            // 同時又沒按著 Shift
            if ( !event.shiftKey ) {
                canvasManager.selectedObjects = []; // 才能清空選取的物件
                canvasManager.dragOffsets.clear();  // 同時也清空拖曳偏移量
            }

            // 並且開始選取範圍
            canvasManager.selectionStart = { x: event.clientX, y: event.clientY };
            canvasManager.selectionEnd = { x: event.clientX, y: event.clientY };
        }
    }

    updateSelectionArea( clientX: number, clientY: number ) {
        if(this.canvasManager.interactionMode !== InteractionMode.Selecting) return
        if(this.canvasManager.selectionStart) {
            this.canvasManager.selectionEnd = {
                x: clientX, 
                y: clientY
            }
        };
    }

    selectObjects(start: Vector2 | null, end: Vector2 | null, usedShift: boolean) {
        if ( this.canvasManager.isDragging && start && end ) {

            // 如果沒按著 Shift 鍵，就得清空選取清單
            if ( !usedShift ) this.canvasManager.selectedObjects = []

            // 取得框選範圍
            const selectionEdges: BoundingEdges = {
                minX: Math.min(start.x, end.x),
                maxX: Math.max(start.x, end.x),
                minY: Math.min(start.y, end.y),
                maxY: Math.max(start.y, end.y),
            }
    
            // 尋找所有 (完全在選取範圍內|有碰觸到選取範圍) 的物件
            for (const object of this.canvasManager.canvasObjects) {
                if (
                    isObjectWouldBeSelected(
                        object,
                        selectionEdges,
                        this.canvasManager.viewPostiion,
                        SelectionMode.Intersect
                    )
                ) {
                    // 如果這個物件尚未在選取清單中，才新增進選取清單
                    if (!this.canvasManager.selectedObjects.includes(object)) {
                        this.canvasManager.selectedObjects.push(object);
                    }
                }
            }

        }
    }
}