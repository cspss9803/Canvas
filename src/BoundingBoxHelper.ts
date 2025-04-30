import { DrawableObject } from './DrawableObject/DrawableObject.js'
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
 * @param object 要選取的物件
 * @param selectionEdges 選取框的範圍
 * @param offset 畫布的偏移量
 * @param mode 框選的選取模式 完全包含才選取 or 只要有相交就選取
 * 
 * @returns 
 */
export function isObjectWouldBeSelected(
    object: DrawableObject,
    selectionEdges: BoundingEdges,
    offset: Vector2,
    mode: SelectionMode
): boolean {
    const bbox = object.getBoundingBox( offset );
    const { minX, minY, maxX, maxY } = getBoundingEdges(bbox);

    const realMinX = minX + offset.x;
    const realMaxX = maxX + offset.x;
    const realMinY = minY + offset.y;
    const realMaxY = maxY + offset.y;

    if (mode === SelectionMode.Inside) {
        return (
            realMinX >= selectionEdges.minX &&
            realMaxX <= selectionEdges.maxX &&
            realMinY >= selectionEdges.minY &&
            realMaxY <= selectionEdges.maxY
        );
    } else { // SelectionMode.Intersect
        return !(
            realMaxX < selectionEdges.minX || // 物件在選取框左邊
            realMinX > selectionEdges.maxX || // 物件在選取框右邊
            realMaxY < selectionEdges.minY || // 物件在選取框上方
            realMinY > selectionEdges.maxY    // 物件在選取框下方
        );
    }
}