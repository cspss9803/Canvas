import { UIObject } from './UIObject/UIObject.js'
import type { BoundingEdges, BoundingBox, Vector2 } from './types.js'
import { SelectionMode } from './types.js'

/**
 * 一次取得四邊界
 */
export function getBoundingEdges(bbox: BoundingBox) {
    return {
        minX: bbox.x,
        minY: bbox.y,
        maxX: bbox.x + bbox.width,
        maxY: bbox.y + bbox.height,
    } as BoundingEdges;
}

/**
 * 判斷物件是否會被選取
 * @param object 要檢查是否會被選取的物件
 * @param selectionEdges 選取框的範圍
 * @param offset 畫布的偏移量
 * @param mode 框選的選取模式 完全包含才選取 or 只要有相交就選取
 * 
 * @returns 
 */
export function isObjectWouldBeSelected(
    object: UIObject,
    selectionEdges: BoundingEdges,
    mode: SelectionMode
): boolean {
    const bbox = object.getBoundingBox();
    const { minX, minY, maxX, maxY } = getBoundingEdges( bbox );
    
    if ( mode === SelectionMode.Inside ) {
        return (
            minX >= selectionEdges.minX &&
            maxX <= selectionEdges.maxX &&
            minY >= selectionEdges.minY &&
            maxY <= selectionEdges.maxY
        );
    }
    
    if ( mode === SelectionMode.Intersect ) {
        return !(
            maxX < selectionEdges.minX || // 物件在選取框左邊
            minX > selectionEdges.maxX || // 物件在選取框右邊
            maxY < selectionEdges.minY || // 物件在選取框上方
            minY > selectionEdges.maxY    // 物件在選取框下方
        );
    }

    return false;
}

export function isPointInsideTotalBoundingBox(
    selectedObjs: UIObject[], 
    point: Vector2
): boolean {

    if ( selectedObjs.length === 0 ) return false;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const obj of selectedObjs) {
        const box = obj.getBoundingBox();

        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
    }

    return (
        point.x >= minX &&
        point.x <= maxX &&
        point.y >= minY &&
        point.y <= maxY
    );
}

export function getTotalBoundingBox( objs: UIObject[] ): BoundingEdges | null {
    if ( objs.length === 0 ) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for ( const obj of objs ) {
        const box = obj.getBoundingBox();
        minX = Math.min( minX, box.x );
        minY = Math.min( minY, box.y );
        maxX = Math.max( maxX, box.x + box.width );
        maxY = Math.max( maxY, box.y + box.height );
    }

    return { minX, minY, maxX, maxY };
}

export function isPointInBoundingBox( point: Vector2, box: BoundingEdges ): boolean {
    return (
        point.x >= box.minX &&
        point.x <= box.maxX &&
        point.y >= box.minY &&
        point.y <= box.maxY
    );
}