import { BlockRenderStrategy } from './block-render-strategy.ts';
import TetrisGame from './tetris-game.ts';
import { Image } from 'gtp';

export const IMAGE_COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
];

export default class ImageBlockRenderStrategy implements BlockRenderStrategy {
    private readonly images: Image[];

    constructor(game: TetrisGame) {
        this.images = IMAGE_COLORS.map(color => game.assets.get(color));
    }

    paint(ctx: CanvasRenderingContext2D, x: number, y: number, color: number) {
        this.images[color].draw(ctx, x, y);
    }
}
