export interface BlockRenderStrategy {
    paint(ctx: CanvasRenderingContext2D, x: number, y: number, c: number): void;
}
