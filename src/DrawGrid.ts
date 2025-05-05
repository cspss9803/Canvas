import type { Color, Vector2 } from './types';

export interface GridSettings {

    /** 網格大小 */
    gridSize: number;

    /** 細線顏色 */
    thinLineColor: Color;

    /** 細線寬度 */
    thinLineWidth: number;

    /** 粗線顏色 */
    thickLineColor: Color;

    /** 粗線寬度 */
    thickLineWidth: number;

    /** 每多少格繪制一條粗線 */
    thickLineInterval: number;
}

enum Direction { Vertical, Horizontal };

export function drawGrid( 
    context: CanvasRenderingContext2D, 
    offset: Vector2, 
    zoom: number,
    gridSettings: GridSettings = {
        gridSize: 25,
        thinLineColor: '#ddd',
        thinLineWidth: 0.5,
        thickLineColor: '#ccc',
        thickLineWidth: 1,
        thickLineInterval: 5
    } 
) {
    
    const ctx = context;
    const { canvas } = context;
    const { 
        thinLineColor, 
        thinLineWidth, 
        thickLineColor, 
        thickLineWidth, 
        thickLineInterval 
    } = gridSettings;
    const gridSize = Math.round( gridSettings.gridSize * zoom * 100 ) / 100;

    function drawLines( direction: Direction ) {
        const isVertical = direction === Direction.Vertical;

        // 代表畫布的寬度或高度，取決於當前繪製的方向
        const max = isVertical ? canvas.width : canvas.height;

        // 計算偏移值，根據當前繪製的方向選擇 x 或 y 偏移值
        const offsetValue = isVertical ? offset.x : offset.y;

        let gridIndex = Math.floor( ( offsetValue % gridSize - offsetValue ) / gridSize );
        for (
            let pos = offsetValue % gridSize; 
            pos < max; 
            pos += gridSize
        ) {

            // 判斷是否為粗線
            const isThickLine = gridIndex % thickLineInterval === 0;
            gridIndex++;

            // 設定線條樣式
            ctx.strokeStyle = isThickLine ? thickLineColor : thinLineColor;
            ctx.lineWidth = isThickLine ? thickLineWidth : thinLineWidth;

            // 開始繪製線條
            ctx.beginPath();

            // 如果是垂直線，則繪製垂直線
            if ( isVertical ) {
                ctx.moveTo( pos, 0 );
                ctx.lineTo( pos, canvas.height );
            } 
            
            // 如果是水平線，則繪製水平線
            else {
                ctx.moveTo( 0, pos );
                ctx.lineTo( canvas.width, pos );
            }

            // 繪製線條
            ctx.stroke();
        }
    }

    // 繪製垂直線
    drawLines( Direction.Vertical );

    // 繪製水平線
    drawLines( Direction.Horizontal );

}