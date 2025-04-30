var Direction;
(function (Direction) {
    Direction[Direction["Vertical"] = 0] = "Vertical";
    Direction[Direction["Horizontal"] = 1] = "Horizontal";
})(Direction || (Direction = {}));
function drawGrid(context, viewPostiion, gridSettings = {
    gridSize: 25,
    thinLineColor: '#ddd',
    thinLineWidth: 0.5,
    thickLineColor: '#ccc',
    thickLineWidth: 1,
    thickLineInterval: 5
}) {
    const ctx = context;
    const { canvas } = context;
    const { gridSize, thinLineColor, thinLineWidth, thickLineColor, thickLineWidth, thickLineInterval } = gridSettings;
    function drawLines(direction) {
        const isVertical = direction === Direction.Vertical;
        // 代表畫布的寬度或高度，取決於當前繪製的方向
        const max = isVertical ? canvas.width : canvas.height;
        // 計算偏移值，根據當前繪製的方向選擇 x 或 y 偏移值
        const offsetValue = isVertical ? viewPostiion.x : viewPostiion.y;
        for (let pos = offsetValue % gridSize; pos < max; pos += gridSize) {
            const absPos = pos - offsetValue;
            // 判斷是否為粗線
            const isThickLine = Math.floor(absPos / gridSize) % thickLineInterval === 0;
            // 設定線條樣式
            ctx.strokeStyle = isThickLine ? thickLineColor : thinLineColor;
            ctx.lineWidth = isThickLine ? thickLineWidth : thinLineWidth;
            // 開始繪製線條
            ctx.beginPath();
            // 如果是垂直線，則繪製垂直線
            if (isVertical) {
                ctx.moveTo(pos, 0);
                ctx.lineTo(pos, canvas.height);
            }
            // 如果是水平線，則繪製水平線
            else {
                ctx.moveTo(0, pos);
                ctx.lineTo(canvas.width, pos);
            }
            // 繪製線條
            ctx.stroke();
        }
    }
    // 繪製垂直線
    drawLines(Direction.Vertical);
    // 繪製水平線
    drawLines(Direction.Horizontal);
}
export default drawGrid;
