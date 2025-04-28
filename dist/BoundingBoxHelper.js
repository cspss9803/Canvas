import { SelectionMode } from './types.js';
export function getMinX(bbox) {
    return bbox.x;
}
export function getMaxX(bbox) {
    return bbox.x + bbox.width;
}
export function getMinY(bbox) {
    return bbox.y;
}
export function getMaxY(bbox) {
    return bbox.y + bbox.height;
}
/**
 * 一次取得四邊界
 */
export function getBoundingEdges(bbox) {
    return {
        minX: bbox.x,
        minY: bbox.y,
        maxX: bbox.x + bbox.width,
        maxY: bbox.y + bbox.height,
    };
}
/**
 * 判斷 BoundingBox 是否完全包含在選取範圍內
 */
export function isBoundingBoxInsideSelection(bbox, selectionEdges, offset) {
    const { minX, minY, maxX, maxY } = getBoundingEdges(bbox);
    const realMinX = minX + offset.x;
    const realMaxX = maxX + offset.x;
    const realMinY = minY + offset.y;
    const realMaxY = maxY + offset.y;
    return (realMinX >= selectionEdges.minX &&
        realMaxX <= selectionEdges.maxX &&
        realMinY >= selectionEdges.minY &&
        realMaxY <= selectionEdges.maxY);
}
export function isBoundingBoxIntersectSelection(bbox, selectionEdges, offset) {
    const objectEdges = getBoundingEdges(bbox);
    const realMinX = objectEdges.minX + offset.x;
    const realMaxX = objectEdges.maxX + offset.x;
    const realMinY = objectEdges.minY + offset.y;
    const realMaxY = objectEdges.maxY + offset.y;
    return !(realMaxX < selectionEdges.minX || // 物件在選取框左邊
        realMinX > selectionEdges.maxX || // 物件在選取框右邊
        realMaxY < selectionEdges.minY || // 物件在選取框上方
        realMinY > selectionEdges.maxY // 物件在選取框下方
    );
}
export function isObjectWouldBeSelected(object, selectionEdges, offset, mode) {
    const bbox = object.getBoundingBox(offset);
    const { minX, minY, maxX, maxY } = getBoundingEdges(bbox);
    const realMinX = minX + offset.x;
    const realMaxX = maxX + offset.x;
    const realMinY = minY + offset.y;
    const realMaxY = maxY + offset.y;
    if (mode === SelectionMode.Inside) {
        return (realMinX >= selectionEdges.minX &&
            realMaxX <= selectionEdges.maxX &&
            realMinY >= selectionEdges.minY &&
            realMaxY <= selectionEdges.maxY);
    }
    else { // SelectionMode.Intersect
        return !(realMaxX < selectionEdges.minX || // 物件在選取框左邊
            realMinX > selectionEdges.maxX || // 物件在選取框右邊
            realMaxY < selectionEdges.minY || // 物件在選取框上方
            realMinY > selectionEdges.maxY // 物件在選取框下方
        );
    }
}
