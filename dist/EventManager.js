export class EventManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        window.addEventListener('contextmenu', e => e.preventDefault());
        window.addEventListener('mousedown', e => this.handleMouseDown(e));
        window.addEventListener('mousemove', e => this.handleMouseMove(e));
        window.addEventListener('mouseup', e => this.handleMouseUp(e));
        window.addEventListener('wheel', e => this.handleMouseWheel(e), { passive: false });
        window.addEventListener('keydown', e => this.handleKeyDown(e));
        window.addEventListener('resize', () => this.canvasManager.resizeWindow());
    }
    handleMouseDown(event) {
        this.canvasManager.onMouseDown(event); // 交給 CanvasManager 處理
    }
    handleMouseMove(event) {
        this.canvasManager.onMouseMove(event);
    }
    handleMouseUp(event) {
        this.canvasManager.onMouseUp(event);
    }
    handleMouseWheel(event) {
        event.preventDefault();
        this.canvasManager.onMouseWheel(event);
    }
    handleKeyDown(event) {
        this.canvasManager.keyboardManager.handleKeyboardInput(event.code);
    }
}
