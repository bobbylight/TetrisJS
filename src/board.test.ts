import { afterEach, it, describe, expect, vi, beforeEach, MockInstance } from 'vitest';
import { AudioSystem } from "gtp";
import { Board } from './board';
import * as Constants from './constants';
import { TetrisGame } from "./tetris-game.ts";
import { createLetterSPiece, createLetterTPiece, createSquarePiece } from "./piece-factory.ts";
import { Piece } from "./piece.ts";
import { SOUNDS } from "./Sounds.ts";

describe('Board', () => {
    let game: TetrisGame;
    let board: Board;

    beforeEach(() => {
        game = new TetrisGame();
        board = new Board(game);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('initially populates the board with empty blocks', () => {
            for (let row = 0; row < Constants.HEIGHT_IN_BLOCKS; row++) {
                for (let col = 0; col < Constants.WIDTH_IN_BLOCKS; col++) {
                    expect(board.getData(row, col)).toEqual(0);
                }
            }
        });
    });

    it('clear() works', () => {
        for (let row = 0; row < Constants.HEIGHT_IN_BLOCKS; row++) {
            for (let col = 0; col < Constants.WIDTH_IN_BLOCKS; col++) {
                board.setData(row, col, 1);
            }
        }

        board.clear();
        for (let row = 0; row < Constants.HEIGHT_IN_BLOCKS; row++) {
            for (let col = 0; col < Constants.WIDTH_IN_BLOCKS; col++) {
                expect(board.getData(row, col)).toEqual(0);
            }
        }
    });

    it('getBoardColumnCount() works', () => {
        expect(board.getBoardColumnCount()).toEqual(Constants.WIDTH_IN_BLOCKS);
    });

    it('getBoardRowCount() works', () => {
        expect(board.getBoardRowCount()).toEqual(Constants.HEIGHT_IN_BLOCKS);
    });

    describe('getShouldStillFall()', () => {
        it('returns true if the piece can keep falling', () => {
            const piece = createLetterSPiece();
            piece.setX(1);
            piece.setY(1);
            expect(board.getShouldStillFall(piece)).toEqual(true);
        });

        describe('when the piece cannot keep falling', () => {
            let piece: Piece;
            let playSoundSpy: MockInstance<AudioSystem['playSound']>;

            beforeEach(() => {
                playSoundSpy = vi.spyOn(game.audio, 'playSound').mockImplementation(() => 4);
                piece = createSquarePiece();
                piece.setX(1);
                piece.setY(1);
                // Just underneath the piece is filled
                board.setData(3, 1, 1);
            });

            it('returns false', () => {
                expect(board.getShouldStillFall(piece)).toEqual(false);
            });

            it('plays a sound effect', () => {
                board.getShouldStillFall(piece);
                expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith(SOUNDS.PIECE_LANDING);
            });
        });
    });

    describe('getTouchesData()', () => {
        let piece: Piece;

        it('returns false if not touching anything', () => {
            piece = createLetterTPiece();
            piece.setX(2);
            piece.setY(3);
            expect(board.getTouchesData(piece)).toEqual(false);
        });

        it('returns true if is touching something', () => {
            piece = createLetterTPiece();
            piece.setX(2);
            piece.setY(3);

            const row = piece.getBoardRow(0);
            const col = piece.getBoardColumn(0);
            board.setData(row, col, 1);
            expect(board.getTouchesData(piece)).toEqual(true);
        });
    });

    describe('isBlockAlreadyFilled()', () => {
        it('returns false if the block is empty', () => {
            expect(board.isBlockAlreadyFilled(2, 2)).toEqual(false);
        });

        it('returns true if the block is filled', () => {
            board.setData(2, 2, 7);
            expect(board.isBlockAlreadyFilled(2, 2)).toEqual(true);
        });
    });

    describe('clearing rows', () => {
        describe('when there are rows to clear', () => {
            beforeEach(() => {
                const lastRow = board.getBoardRowCount() - 1;

                // Fill 3 rows (non-contiguous) with blocks
                for (let col = 0; col < Constants.WIDTH_IN_BLOCKS; col++) {
                    board.setData(lastRow, col, 1);
                    board.setData(lastRow - 1, col, 1);
                    board.setData(lastRow - 3, col, 1);
                }

                // Add one block in the in-between row for validation that it falls
                board.setData(lastRow - 2, 5, 1);
            });

            it('startClearing() returns true', () => {
                expect(board.startClearing()).toEqual(true);
            });

            it('updateClearing() eventually returns false', () => {
                board.startClearing();
                for (let i = 0; i < board.getBoardColumnCount() / 2; i++) {
                    expect(board.updateClearing()).toEqual(true);
                }
                expect(board.updateClearing()).toEqual(false);
            });

            it('shifts all data down when clearing is complete', () => {
                board.startClearing();
                while (board.updateClearing()) {
                    // Comment for eslint
                }

                const lastRow = board.getBoardRowCount() - 1;
                for (let col = 0; col < Constants.WIDTH_IN_BLOCKS; col++) {
                    const expectedCol = col === 5 ? 1 : 0;
                    expect(board.getData(lastRow, col)).toEqual(expectedCol);
                }
            });
        });

    });
});
