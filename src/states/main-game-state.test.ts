import { afterEach, it, describe, expect, vi, beforeEach, MockInstance } from 'vitest';
import { Keys } from "gtp";
import { TetrisGame } from "../tetris-game.ts";
import { createLetterTPiece } from "../piece-factory.ts";
import { Piece } from "../piece.ts";
import { SOUNDS } from "../Sounds.ts";
import { MainGameState } from "./main-game-state.ts";

describe('MainGameState', () => {
    let game: TetrisGame;
    let mainGameState: MainGameState;

    beforeEach(() => {
        game = new TetrisGame();
        mainGameState = new MainGameState(game);
        mainGameState.enter();
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('render()', () => {
        it('does not throw an error when there is no falling piece', () => {
            vi.spyOn(game, 'getFallingPiece').mockReturnValue(null);
            const ctx = game.getRenderingContext();
            expect(() => {
                mainGameState.render(ctx);
            }).toThrowError();
        });

        it('does not throw an error when there is a falling piece', () => {
            const piece = createLetterTPiece();
            vi.spyOn(game, 'getFallingPiece').mockReturnValue(piece);
            const ctx = game.getRenderingContext();
            expect(() => {
                mainGameState.render(ctx);
            }).toThrowError();
        });

        it('does not throw an error when the game is paused', () => {
            game.paused = true;
            const ctx = game.getRenderingContext();
            expect(() => {
                mainGameState.render(ctx);
            }).toThrowError();
        });
    });

    describe('update()', () => {
        it('does not error if the game is paused', () => {
            game.paused = true;
            expect(() => {
                mainGameState.update();
            }).not.toThrowError();
        });

        // TODO: More tests
    });

    describe('handleInput', () => {
        describe('when paused', () => {
            beforeEach(() => {
                game.paused = true;
            });

            it('pressing Enter unpauses the game', () => {
                vi.spyOn(game.inputManager, 'enter')
                    .mockImplementation(() => {
                        return true;
                    });
                mainGameState.handleInput();
                expect(game.paused).toEqual(false);
            });
        });

        describe('when a piece is falling', () => {
            let fallingPiece: Piece;
            let moveLeftSpy: MockInstance<Piece['moveLeft']>;
            let moveRightSpy: MockInstance<Piece['moveRight']>;

            beforeEach(() => {
                mainGameState.update();
                const piece = game.getFallingPiece();
                if (!piece) {
                    throw new Error('No falling piece');
                }
                fallingPiece = piece;
                moveLeftSpy = vi.spyOn(fallingPiece, 'moveLeft');
                moveRightSpy = vi.spyOn(fallingPiece, 'moveRight');
            });

            it('pressing left moves the piece left', () => {
                vi.spyOn(game.inputManager, 'left')
                    .mockImplementation(() => {
                        return true;
                    });
                mainGameState.handleInput();
                expect(moveLeftSpy).toHaveBeenCalledExactlyOnceWith(game.getBoard());
                expect(moveRightSpy).not.toHaveBeenCalled();
            });

            it('pressing right moves the piece right', () => {
                vi.spyOn(game.inputManager, 'right')
                    .mockImplementation(() => {
                        return true;
                    });
                mainGameState.handleInput();
                expect(moveLeftSpy).not.toHaveBeenCalled();
                expect(moveRightSpy).toHaveBeenCalledExactlyOnceWith(game.getBoard());
            });

            it('pressing down moves the piece down', () => {
                const downSpy = vi.spyOn(game, 'dropFallingPiece');
                vi.spyOn(game.inputManager, 'down')
                    .mockImplementation(() => {
                        return true;
                    });
                mainGameState.handleInput();
                expect(downSpy).toHaveBeenCalledExactlyOnceWith();
            });

            it('pressing "N" toggles whether the next piece is shown', () => {
                const showNextPieceSpy = vi.spyOn(game, 'setShowNextPiece');
                vi.spyOn(game.inputManager, 'isKeyDown')
                    .mockImplementation((key: Keys, clear = false) => {
                        return key === Keys.KEY_N && clear;
                    });
                mainGameState.handleInput();
                expect(showNextPieceSpy).toHaveBeenCalledExactlyOnceWith(false);
            });

            it('pressing Enter pauses the game', () => {
                vi.spyOn(game.inputManager, 'enter')
                    .mockImplementation(() => {
                        return true;
                    });
                mainGameState.handleInput();
                expect(game.paused).toEqual(true);
            });

            it('pressing Z rotates the piece counter-clockwise', () => {
                const rotateSpy = vi.spyOn(fallingPiece, 'rotate');
                vi.spyOn(game.inputManager, 'isKeyDown')
                    .mockImplementation((key: Keys, clear = false) => {
                        return key === Keys.KEY_Z && clear;
                    });
                const playSoundSpy = vi.spyOn(game.audio, 'playSound');
                mainGameState.handleInput();
                expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith(SOUNDS.PIECE_ROTATING, false);
                expect(rotateSpy).toHaveBeenCalledExactlyOnceWith(-1, game.getBoard());
            });

            it('pressing X rotates the piece clockwise', () => {
                const rotateSpy = vi.spyOn(fallingPiece, 'rotate');
                vi.spyOn(game.inputManager, 'isKeyDown')
                    .mockImplementation((key: Keys, clear = false) => {
                        return key === Keys.KEY_X && clear;
                    });
                const playSoundSpy = vi.spyOn(game.audio, 'playSound');
                mainGameState.handleInput();
                expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith(SOUNDS.PIECE_ROTATING, false);
                expect(rotateSpy).toHaveBeenCalledExactlyOnceWith(1, game.getBoard());
            });
        });
    });
});
