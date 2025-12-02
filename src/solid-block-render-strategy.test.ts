import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SolidBlockRenderStrategy } from './solid-block-render-strategy';
import * as Constants from './constants';

describe('SolidBlockRenderStrategy', () => {
    let strategy: SolidBlockRenderStrategy;
    let mockCanvasContext: Partial<CanvasRenderingContext2D>;

    beforeEach(() => {
        strategy = new SolidBlockRenderStrategy();
        mockCanvasContext = {
            fillStyle: '',
            fillRect: vi.fn(),
        };
        // Reset the mock before each test
        vi.clearAllMocks();
    });

    describe('COLORS', () => {
        it('should define an array of colors', () => {
            expect(SolidBlockRenderStrategy.COLORS.length).toEqual(6);
            SolidBlockRenderStrategy.COLORS.forEach((color) => {
                expect(color).toMatch(/^#[0-9a-f]{6}$/);
            });
        });
    });

    describe('paint', () => {
        it('should set fillStyle and call fillRect with correct argumentsa valid index', () => {
            const x = 10;
            const y = 20;
            const colorIndex = 0;
            const expectedColor = SolidBlockRenderStrategy.COLORS[colorIndex];

            strategy.paint(mockCanvasContext as CanvasRenderingContext2D, x, y, colorIndex);

            expect(mockCanvasContext.fillStyle).toBe(expectedColor);
            expect(mockCanvasContext.fillRect).toHaveBeenCalledExactlyOnceWith(
                x, y, Constants.BLOCK_SIZE, Constants.BLOCK_SIZE);
        });

        it('should handle an out-of-bounds color index gracefully', () => {
            const x = 50;
            const y = 60;
            strategy.paint(mockCanvasContext as CanvasRenderingContext2D, x, y, 99999);

            expect(mockCanvasContext.fillStyle).toBeUndefined();
            expect(mockCanvasContext.fillRect).toHaveBeenCalledExactlyOnceWith(
                x, y, Constants.BLOCK_SIZE, Constants.BLOCK_SIZE);
        });
    });
});
