import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ImageBlockRenderStrategy, IMAGE_COLORS } from './image-block-render-strategy';
import { TetrisGame } from './tetris-game';

const mockImage = {
    draw: vi.fn(),
};

describe('ImageBlockRenderStrategy', () => {
    let strategy: ImageBlockRenderStrategy;
    let game: TetrisGame;

    beforeEach(() => {
        game = new TetrisGame();
        vi.spyOn(game.assets, 'get').mockImplementation(() => mockImage);
        strategy = new ImageBlockRenderStrategy(game);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('IMAGE_COLORS', () => {
        it('should define an array of color names', () => {
            expect(IMAGE_COLORS.length).toEqual(7);
            IMAGE_COLORS.forEach((color) => {
                expect(color).toMatch(/^\w+$/);
            });
        });
    });

    describe('constructor', () => {
        it('should load an image for each color in IMAGE_COLORS', () => {
            const getSpy = vi.spyOn(game.assets, 'get');
            expect(getSpy).toHaveBeenCalledTimes(IMAGE_COLORS.length);
            IMAGE_COLORS.forEach((color) => {
                expect(getSpy).toHaveBeenCalledWith(color);
            });
        });
    });

    describe('paint', () => {
        it('should call the draw method of the correct image for a given color index', () => {
            const x = 10;
            const y = 20;
            const colorIndex = 0; // 'red'

            const ctx = game.getRenderingContext();
            strategy.paint(ctx, x, y, colorIndex);

            expect(mockImage.draw).toHaveBeenCalledExactlyOnceWith(ctx, x, y);
        });

        it('should not throw an error and simply not draw if color index is out of bounds', () => {
            const x = 50;
            const y = 60;
            expect(() => {
                strategy.paint(game.getRenderingContext(), x, y, 9999);
            }).toThrowError(TypeError);
        });
    });
});
