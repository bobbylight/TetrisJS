import { BlockRenderStrategy } from './block-render-strategy.ts';
import * as Constants from './constants.ts';

export class SolidBlockRenderStrategy implements BlockRenderStrategy {

    static readonly COLORS = [
        `#ff0000`,
        `#ff8000`,
        '#00e000',
        '#0000ff',
        '#4b0082', // indigo
        '#f472f4', // violet
    ];

    paint(g: CanvasRenderingContext2D, x: number, y: number, color: number) {
        g.fillStyle = SolidBlockRenderStrategy.COLORS[color];
        g.fillRect(x, y, Constants.BLOCK_SIZE, Constants.BLOCK_SIZE);
    }
}
