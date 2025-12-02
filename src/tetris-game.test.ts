import {afterEach, beforeEach, describe, expect, it, MockInstance, vi} from "vitest";
import {TetrisGame} from "./tetris-game.ts";
import {Board} from "./board.ts";
import {Piece} from "./piece.ts";
import {MainGameState} from "./states/main-game-state.ts";
import {createLetterTPiece} from "./piece-factory.ts";

const mockImage = {
    draw: vi.fn(),
};

describe('TetrisGame', () => {
    let game: TetrisGame;

    beforeEach(() => {
        game = new TetrisGame();
        vi.spyOn(game.assets, 'get').mockImplementation(() => mockImage);
        game.setState(new MainGameState(game));
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('startNewGame', () => {
        it('works', () => {
            game.setLinesCleared(7);
            const spy = vi.spyOn(game.getBoard(), 'clear');
            game.startNewGame();
            expect(game.getLinesCleared()).toEqual(0);
            expect(spy).toHaveBeenCalledOnce();
        });
    });

    it('createNewFallingPiece() creates a new piece', () => {
        expect(game.getFallingPiece()).toBeNull();
        const piece = game.createNewFallingPiece();
        expect(game.getFallingPiece()).toEqual(piece);
    });

    it('get/setPaintFancyBoard() works', () => {
        expect(game.getPaintFancyBoard()).toEqual(true);
        game.setPaintFancyBoard(false);
        expect(game.getPaintFancyBoard()).toEqual(false);
    });

    it('getBigMessageFont() is not null', () => {
        expect(game.getBigMessageFont()).not.toBeNull();
    });

    it('getColorForPiece() works', () => {
        expect(game.getColorForPiece(4)).equals(3);
    });

    describe('dropFallingPiece()', () => {
        let startClearingSpy: MockInstance<Board['startClearing']>;

        beforeEach(() => {
            startClearingSpy = vi.spyOn(game.getBoard(), 'startClearing');
        });

        it('does nothing when fallingPiece is null', () => {
            expect(startClearingSpy).not.toHaveBeenCalled();
        });

        describe('when fallingPiece is not null', () => {
            let fallingPiece: Piece;

            beforeEach(() => {
                fallingPiece = game.createNewFallingPiece();
            });

            describe('when the piece can fall', () => {
                it('does not clear the falling piece', () => {
                    game.dropFallingPiece();
                    expect(game.getFallingPiece()).toBe(fallingPiece); // Not null
                });

                it('does not start clearing the board', () => {
                    game.dropFallingPiece();
                    expect(startClearingSpy).not.toHaveBeenCalled();
                });
            });

            describe('when the piece cannot fall', () => {
                beforeEach(() => {
                    vi.spyOn(fallingPiece, 'fall').mockReturnValue(false);
                });

                it('clears the falling piece', () => {
                    game.dropFallingPiece();
                    expect(game.getFallingPiece()).toBeNull();
                });

                it('starts clearing the board', () => {
                    game.dropFallingPiece();
                    expect(startClearingSpy).toHaveBeenCalledOnce();
                });

                describe('when the board cannot be cleared', () => {
                    beforeEach(() => {
                        startClearingSpy.mockReturnValue(false);
                    });

                    it('does not update the game state\'s substate', () => {
                        const state = game.state;
                        if (!(state instanceof MainGameState)) {
                            throw new Error('Expected game state to be MainGameState');
                        }
                        const setSubstateSpy = vi.spyOn(state, 'setSubstate');

                        game.dropFallingPiece();
                        expect(setSubstateSpy).not.toHaveBeenCalled();
                    });
                });

                describe('when the board can be cleared', () => {
                    beforeEach(() => {
                        startClearingSpy.mockReturnValue(true);
                    });

                    it('updates the game state\'s substate', () => {
                        const state = game.state;
                        if (!(state instanceof MainGameState)) {
                            throw new Error('Expected game state to be MainGameState');
                        }
                        const setSubstateSpy = vi.spyOn(state, 'setSubstate');

                        game.dropFallingPiece();
                        expect(setSubstateSpy).toHaveBeenCalledExactlyOnceWith(MainGameState.SUBSTATE_LINES_CLEARING);
                    });
                });
            });
        });
    });

    it('getFallTimeDelta() works', () => {
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < 20; i++) {
            vi.spyOn(game, 'getLevel').mockReturnValue(i);
            const fallTimeDelta = game.getFallTimeDelta();
            expect(fallTimeDelta).toBeLessThan(min);
            min = fallTimeDelta;
        }
    });

    it('get/setLinesCleared() works', () => {
        expect(game.getLinesCleared()).toEqual(0);
        game.setLinesCleared(42);
        expect(game.getLinesCleared()).toEqual(42);
    });

    it('getNextPiece() works', () => {
        const nextPiece = game.getNextPiece();
        expect(nextPiece).not.toBeNull();
        game.createNewFallingPiece();
        expect(game.getFallingPiece()).toEqual(nextPiece);
        expect(game.getNextPiece()).not.toBe(nextPiece); // Check reference
    });

    it('paintBlockInDropArea() works', () => {
        const ctx = game.getRenderingContext();
        expect(() => {
            game.paintBlockInDropArea(ctx, 0, 0, 1);
        }).not.toThrowError();
    });

    it('paintBlockInDropArea() works', () => {
        const ctx = game.getRenderingContext();
        expect(() => {
            game.paintPieceInDropArea(ctx, createLetterTPiece());
        }).not.toThrowError();
    });

    it('toggleBlockRenderStrategy() does not throw errors', () => {
        expect(() => {
            game.toggleBlockRenderStrategy();
            game.toggleBlockRenderStrategy(); // Switch back
        }).not.toThrowError();
    });
});
