import { CanvasManager } from './CanvasManager.js'
import { Box, Circle, Line } from './UIObject/Shapes/index.js'

const canvasManager = new CanvasManager( document.getElementById('canvas') as HTMLCanvasElement )

canvasManager.uiObjects.push( new Box({x:50, y:150}, { width: 50, height: 50}, '#ccc') )
canvasManager.uiObjects.push( new Box({x:0, y:0}, { width: 100, height: 100}, "rgba(255, 0, 0, 0.5)") )
canvasManager.uiObjects.push( new Circle({x: 400, y: 200}, 60, '#fa0') )
canvasManager.uiObjects.push( new Box({x:400, y:300}, { width: 150, height: 150}, 'rgba(0, 255, 0, 0.7)') )
canvasManager.uiObjects.push( new Box({x:600, y:100}, { width: 50, height: 200}) )
canvasManager.uiObjects.push( new Line({x: 600, y: 400}, [{x: 50, y: 70}, {x: 15, y: -50}], '#000', 5) )

canvasManager.drawManager.draw()