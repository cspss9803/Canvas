export function updateOffset(offset) {
    const element = document.getElementById('offset');
    element.innerHTML = `x: ${offset.x}px, y: ${offset.y}px`;
}
export function updateMousePosition(mousePosition) {
    const element = document.getElementById('mousePosition');
    element.innerHTML = `x: ${mousePosition.x}, y: ${mousePosition.y}`;
}
export function updatePointerDownPosition(pointerDownPosition) {
    const element = document.getElementById('pointerDownPosition');
    if (pointerDownPosition === null) {
        element.innerHTML = '(尚未按下)';
        return;
    }
    element.innerHTML = `x: ${pointerDownPosition.x}, y: ${pointerDownPosition.y}`;
}
export function updateZoom(zoom) {
    const element = document.getElementById('zoom');
    element.innerHTML = `${Math.round(zoom * 100)}% (${zoom})`;
}
export function updateWindowsSize(width, height) {
    const element = document.getElementById('windowsSize');
    element.innerHTML = `${width}px / ${height}px`;
}
