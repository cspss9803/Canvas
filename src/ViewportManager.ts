import { CanvasManager } from './CanvasManager.js'
import type { Vector2 } from './types'
import { updateOffset, updateZoom } from './Debug.js'

export class ViewportManager {

    canvasManager: CanvasManager
    offset: Vector2 = { x: 0, y: 0 }
    zoom: number = 1
    lastScreenPos: Vector2 | null = null

    constructor( canvasManager:CanvasManager ) { 
        this.canvasManager = canvasManager 
    }

    screenToWorld(screen: Vector2): Vector2 {
        return {
            x: (screen.x - this.offset.x) / this.zoom,
            y: (screen.y - this.offset.y) / this.zoom
        }
    }

    worldToScreen(world: Vector2): Vector2 {
        return {
            x: world.x * this.zoom + this.offset.x,
            y: world.y * this.zoom + this.offset.y
        }
    }

    getMosueWorldPositionByEvent( event: MouseEvent ){
        return this.screenToWorld({
            x: event.clientX,
            y: event.clientY
        })
    }

    pan( event: MouseEvent ) {
        if( this.lastScreenPos !== null ) {
            this.offset.x += event.clientX - this.lastScreenPos.x;
            this.offset.y += event.clientY - this.lastScreenPos.y;
            this.lastScreenPos = { x: event.clientX, y: event.clientY };
            updateOffset(this.offset);
        }
    }

    setZoom( event: WheelEvent) {
        if (!event.ctrlKey) return;
        
        // 紀錄滑鼠的「螢幕座標」
        const screenMousePos = { x: event.clientX, y: event.clientY };

        // 紀錄滑鼠的「世界座標」
        const worldMousePosBefore = this.screenToWorld(screenMousePos);

        // 計算新縮放值
        const ZOOM_STEP = 0.05; // 5%
        const isZoomingIn = event.deltaY < 0; // 上滾是放大，deltaY 為負
        let newZoom = this.zoom + ( isZoomingIn ? ZOOM_STEP : -ZOOM_STEP );
        newZoom = Math.min(2, Math.max(0.5, newZoom));
        this.zoom = Math.round(newZoom * 1000) / 1000;
        updateZoom(this.zoom)

        // 計算出在新的 zoom 之下，滑鼠的世界座標，會在螢幕上的哪個位置?
        const newScreenPosOfWorldMousePos = {
            x: worldMousePosBefore.x * this.zoom,
            y: worldMousePosBefore.y * this.zoom
        };

        // 計算出「滑鼠在螢幕上原本的位置」到「現在滑鼠在螢幕上現在的位置」之間差了多少
        const newOffset = {
            x: screenMousePos.x - newScreenPosOfWorldMousePos.x,
            y: screenMousePos.y - newScreenPosOfWorldMousePos.y
        }

        // 把這個差距補上，讓這個世界座標仍位於滑鼠下方
        this.offset = newOffset

        updateOffset(this.offset);
    }
}