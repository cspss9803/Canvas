export function updateViewportPosition(viewportPosition) {
    const element = document.getElementById('viewportPosition');
    element.innerHTML = `x: ${viewportPosition.x}, y: ${viewportPosition.y}`;
}
export function updateMousePosition(mousePosition) {
    const element = document.getElementById('mousePosition');
    console.log(element);
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
