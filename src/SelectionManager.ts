import { UIObject } from './UIObject/UIObject.js';
import { CanvasManager } from './CanvasManager.js';
import { SelectionMode } from './types.js';
import type { BoundingEdges, Vector2 } from './types';
import { isObjectWouldBeSelected, getTotalBoundingBox, isPointInBoundingBox } from './BoundingBoxHelper.js';

export class SelectionManager {

    canvasManager: CanvasManager;
    private selectionSnapshot: Set<UIObject> = new Set();
    private processedInDrag: Set<UIObject> = new Set();
    private isClickOnObject: boolean = false;

    constructor ( canvasManager: CanvasManager ) { 
        this.canvasManager = canvasManager; 
    }

    startSelect( usedShift: boolean ){
        if ( !this.canvasManager.isSelectMode() ) return;
        const canvasManager = this.canvasManager;
        const objects = canvasManager.uiObjects;
        const selectedObjs = canvasManager.selectedUIObjects;
        const mouseDownPoint = canvasManager.pointerDownPosition;
        const offset = canvasManager.viewPortManager.offset;
        const dragOffsets = canvasManager.dragOffsets;
        this.isClickOnObject = false;

        // 從頂到底開始尋找被點擊到的物件
        for ( const object of [ ...objects ].reverse() ) {

            // 真的有物件被點擊到的話
            if ( object.isHit( mouseDownPoint, offset ) ) {
                this.isClickOnObject = true;

                // 有按著 Shift 鍵時，點到這物件的話，如果它已被選取就取消選取，反之則進行選取
                if ( usedShift ) { this.toggleSelection( object ); }
                
                // 在沒按著 Shift 鍵時，點到這個物件的話
                else {
                    // 單選某個物件
                    if ( !selectedObjs.includes( object ) ) {
                        selectedObjs.length = 0;
                        selectedObjs.push( object );
                    }

                    // 初始化拖曳偏移量
                    this.initDragOffsets( mouseDownPoint );
                }
                break;
            }
        }

        const totalBoundingBox = getTotalBoundingBox( selectedObjs );
        if( 
            totalBoundingBox !== null &&
            isPointInBoundingBox( mouseDownPoint, totalBoundingBox ) 
        ) {
            this.isClickOnObject = true;
            this.initDragOffsets( mouseDownPoint );
        }

        // 如果按下的位置剛好在空白處
        if ( !this.isClickOnObject ) {
            if ( !usedShift ) {
                selectedObjs.length = 0; // 才能清空選取的物件
                dragOffsets.clear();  // 同時也清空拖曳偏移量
            }

            this.selectionSnapshot = new Set( selectedObjs );
            this.processedInDrag.clear();

            // 並且開始選取範圍
            canvasManager.selectionStartPoint = mouseDownPoint;
            canvasManager.selectionEndPoint = mouseDownPoint;
        }
    }

    updateSelectionArea( worldMousePosition: Vector2 ) {
        const canvasManager = this.canvasManager;

        if(
            !canvasManager.isSelectMode() ||
            !canvasManager.selectionStartPoint
        ) return;

        canvasManager.selectionEndPoint = worldMousePosition;
        const start = canvasManager.selectionStartPoint;
        const end = canvasManager.selectionEndPoint;
        const selectedObjs = canvasManager.selectedUIObjects;
        const objects = canvasManager.uiObjects;
        
        const selectionEdges: BoundingEdges = {
            minX: Math.min( start.x, end.x ),
            maxX: Math.max( start.x, end.x ),
            minY: Math.min( start.y, end.y ),
            maxY: Math.max( start.y, end.y ),
        };

        const selectedSet = new Set( selectedObjs );

        for ( const object of objects ) {
            const isInBox = isObjectWouldBeSelected(
                object,
                selectionEdges,
                SelectionMode.Intersect
            );

            const wasSelected = this.selectionSnapshot.has( object );
            const isSelectedNow = selectedSet.has( object );

            if ( isInBox ) {
                if ( wasSelected && isSelectedNow ) {
                    // 原本有選 + 現在有框到 = 要取消
                    selectedObjs.splice( selectedObjs.indexOf( object ), 1 );
                } else if ( !wasSelected && !isSelectedNow ) {
                    // 原本沒選 + 現在有框到 = 要選取
                    selectedObjs.push( object );
                }
            } else { // 選取框沒有碰到 = 恢復成原本狀態
                
                if ( wasSelected && !isSelectedNow ) {
                    // 原本有被選取 + 現在沒被框到 = 恢復成選取狀態
                    selectedObjs.push( object );
                } else if ( !wasSelected && isSelectedNow ) {
                    // 原本沒被選取 + 現在沒被框到 = 恢復成未選取狀態
                    selectedObjs.splice( selectedObjs.indexOf( object ), 1 );
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

    private toggleSelection( object: UIObject ) {
        const selectedUIObjects = this.canvasManager.selectedUIObjects;
        const index = selectedUIObjects.indexOf( object );
        if ( index !== -1 ) { selectedUIObjects.splice( index, 1 ); } 
        else { selectedUIObjects.push( object ); }
    }

    private initDragOffsets( mouseDownPoint: Vector2 ) {
        const dragOffsets = this.canvasManager.dragOffsets;
        dragOffsets.clear();
        for ( const object of this.canvasManager.selectedUIObjects ) {
            dragOffsets.set(object, {
                x: mouseDownPoint.x - object.position.x,
                y: mouseDownPoint.y - object.position.y,
            });
        }
    }
}