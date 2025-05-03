import { CanvasManager } from './CanvasManager.js'

export class EventManager {
    constructor(private canvasManager: CanvasManager) {
        window.addEventListener('contextmenu', e => e.preventDefault());
        window.addEventListener('mousedown', e => this.handleMouseDown(e));
        window.addEventListener('mousemove', e => this.handleMouseMove(e));
        window.addEventListener('mouseup', e => this.handleMouseUp(e));
        window.addEventListener('wheel', e => this.handleMouseWheel(e), { passive: false });
        window.addEventListener('keydown', e => this.handleKeyDown(e));
        window.addEventListener('resize', () => this.canvasManager.resizeWindow());
    }
  
    private handleMouseDown(event: MouseEvent) {
        this.canvasManager.onMouseDown(event); // 交給 CanvasManager 處理
    }
  
    private handleMouseMove(event: MouseEvent) {
        this.canvasManager.onMouseMove(event);
    }
  
    private handleMouseUp(event: MouseEvent) {
        this.canvasManager.onMouseUp(event);
    }

    private handleMouseWheel(event: WheelEvent) {
        event.preventDefault();
        this.canvasManager.onMouseWheel(event);
    }
      
    private handleKeyDown(event: KeyboardEvent) {
        this.canvasManager.keyboardManager.handleKeyboardInput(event.code);
    }
}  