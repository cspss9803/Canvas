export type RGB = `rgb(${number}, ${number}, ${number})`
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
export type HEX = `#${string}`
export type Color = RGB | RGBA | HEX

export type Vector2 = { x: number; y: number; }

export enum InteractionMode { Selecting, Moving }

export enum MouseButton { Left = 0, Middle = 1, Right = 2, Back = 3, Forward = 4 }

export interface BoundingBox {
    x: number
    y: number
    width: number
    height: number
}

export interface BoundingBoxStyle {
    thickness: number
    radius: number
    color: Color
}

export interface BoundingEdges {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

/** 
 * 框選物件時
 * Inside: 需要完全包含進選取框裡面才選取
 * Intersect: 只要有重疊到選框就選取 
 * */
export enum SelectionMode {

    /** 需要完全包含進選取框裡面才選取 */
    Inside,

    /** 只要有重疊到選框就選取 */
    Intersect
}

export type BoxSize = { width: number; height: number; }