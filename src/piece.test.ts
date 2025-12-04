import { afterEach, it, describe, expect, vi, beforeEach } from 'vitest';
import { Piece } from './piece';
import { Board } from './board';
import * as Constants from './constants';
import { TetrisGame } from "./tetris-game.ts";

describe('Piece', () => {
    let game: TetrisGame;
    let piece: Piece;
    let mockBoard: Board;

    beforeEach(() => {
        game = new TetrisGame();
        piece = new Piece(Piece.SQUARE, 1);
        mockBoard = new Board(game);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should initialize a piece with correct default values', () => {
            expect(piece.getType()).toBe(Piece.SQUARE);
            expect(piece.getX()).toBe(3);
            expect(piece.getY()).toBe(0);
            expect(piece.getRotateAmount()).toBe(0);
        });
    });

    describe('data and getters', () => {
        beforeEach(() => {
            // Set up a square piece for consistent testing
            piece.setData(0, 0, 0, 0);
            piece.setData(0, 1, 1, 0);
            piece.setData(0, 2, 0, 1);
            piece.setData(0, 3, 1, 1);
        });

        it('should get correct piece-relative coordinates', () => {
            expect(piece.getPieceColumn(1)).toBe(1);
            expect(piece.getPieceRow(1)).toBe(0);
            expect(piece.getPieceColumn(2)).toBe(0);
            expect(piece.getPieceRow(2)).toBe(1);
        });

        it('should get correct board-relative coordinates', () => {
            piece.setX(4);
            piece.setY(5);
            expect(piece.getBoardColumn(1)).toBe(4 + 1); // piece.x + piece col
            expect(piece.getBoardRow(1)).toBe(5 + 0); // piece.y + piece row
            expect(piece.getBoardColumn(2)).toBe(4 + 0);
            expect(piece.getBoardRow(2)).toBe(5 + 1);
        });

        it('should calculate leftmost and rightmost piece-relative columns', () => {
            expect(piece.getLeftmostPieceColumn()).toBe(0);
            expect(piece.getRightmostPieceColumn()).toBe(1);
        });

        it('should calculate leftmost and rightmost board-relative columns', () => {
            piece.setX(4);
            expect(piece.getLeftmostBoardColumn()).toBe(4 + 0);
            expect(piece.getRightmostBoardColumn()).toBe(4 + 1);
        });

        it('should calculate height correctly', () => {
            // For the test square, piece rows are 0 and 1. Max row is 1.
            const expectedHeight = (1 + 1) * Constants.BLOCK_SIZE;
            expect(piece.getHeight()).toBe(expectedHeight);
        });
    });

    describe('fall()', () => {
        it('should increment y and return true if piece can fall', () => {
            vi.spyOn(mockBoard, 'isBlockAlreadyFilled').mockReturnValue(true);
            const getShouldStillFallSpy = vi.spyOn(mockBoard, 'getShouldStillFall').mockReturnValue(true);
            const initialY = piece.getY();

            const result = piece.fall(mockBoard);

            expect(result).toBe(true);
            expect(piece.getY()).toBe(initialY + 1);
            expect(getShouldStillFallSpy).toHaveBeenCalledWith(piece);
        });

        it('should not change y and return false if piece cannot fall', () => {
            const getShouldStillFallSpy = vi.spyOn(mockBoard, 'getShouldStillFall').mockReturnValue(false);
            const initialY = piece.getY();

            const result = piece.fall(mockBoard);

            expect(result).toBe(false);
            expect(piece.getY()).toBe(initialY);
            expect(getShouldStillFallSpy).toHaveBeenCalledWith(piece);
        });
    });

    describe('moveLeft()', () => {
        beforeEach(() => {
            piece.setData(0, 0, 0, 0); // Leftmost piece column is 0
        });

        it('should decrement x and return true when move is valid', () => {
            const isBlockAlreadyFilledSpy = vi.spyOn(mockBoard, 'isBlockAlreadyFilled').mockReturnValue(false);
            const initialX = piece.getX();

            const result = piece.moveLeft(mockBoard);

            expect(result).toBe(true);
            expect(piece.getX()).toBe(initialX - 1);
            expect(isBlockAlreadyFilledSpy).toHaveBeenCalled();
        });

        it('should not change x and return false when at the left edge', () => {
            const isBlockAlreadyFilledSpy = vi.spyOn(mockBoard, 'isBlockAlreadyFilled');
            piece.setX(0);

            const result = piece.moveLeft(mockBoard);

            expect(result).toBe(false);
            expect(piece.getX()).toBe(0);
            expect(isBlockAlreadyFilledSpy).not.toHaveBeenCalled();
        });

        it('should not change x and return false when blocked by another piece', () => {
            vi.spyOn(mockBoard, 'isBlockAlreadyFilled').mockReturnValue(true);
            const initialX = piece.getX();

            const result = piece.moveLeft(mockBoard);

            expect(result).toBe(false);
            expect(piece.getX()).toBe(initialX);
        });
    });

    describe('moveRight()', () => {
        beforeEach(() => {
            piece.setData(0, 0, 1, 0); // Rightmost piece column is 1
        });

        it('should increment x and return true when move is valid', () => {
            const isBlockAlreadyFilledSpy = vi.spyOn(mockBoard, 'isBlockAlreadyFilled').mockReturnValue(false);
            const initialX = piece.getX();

            const result = piece.moveRight(mockBoard);

            expect(result).toBe(true);
            expect(piece.getX()).toBe(initialX + 1);
            expect(isBlockAlreadyFilledSpy).toHaveBeenCalled();
        });

        it('should not change x and return false when at the right edge', () => {
            const isBlockAlreadyFilledSpy = vi.spyOn(mockBoard, 'isBlockAlreadyFilled');
            // Piece's rightmost piece column is 1. Board edge is WIDTH_IN_BLOCKS - 1
            piece.setX(Constants.WIDTH_IN_BLOCKS - 2);
            const initialX = piece.getX();

            const result = piece.moveRight(mockBoard);

            expect(result).toBe(false);
            expect(piece.getX()).toBe(initialX);
            expect(isBlockAlreadyFilledSpy).not.toHaveBeenCalled();
        });

        it('should not change x and return false when blocked by another piece', () => {
            vi.spyOn(mockBoard, 'isBlockAlreadyFilled').mockReturnValue(true);
            const initialX = piece.getX();

            const result = piece.moveRight(mockBoard);

            expect(result).toBe(false);
            expect(piece.getX()).toBe(initialX);
        });
    });

    describe('rotate()', () => {
        let linePiece: Piece;

        beforeEach(() => {
            linePiece = new Piece(Piece.LINE, 2);
            // Rotation 0 (horizontal)
            linePiece.setData(0, 0, 0, 1);
            linePiece.setData(0, 1, 1, 1);
            linePiece.setData(0, 2, 2, 1);
            linePiece.setData(0, 3, 3, 1);
            // Rotation 1 (vertical)
            linePiece.setData(1, 0, 1, 0);
            linePiece.setData(1, 1, 1, 1);
            linePiece.setData(1, 2, 1, 2);
            linePiece.setData(1, 3, 1, 3);
            vi.spyOn(mockBoard, 'isBlockAlreadyFilled').mockReturnValue(false);
        });

        it('should rotate forward and return true if valid', () => {
            const initialRot = linePiece.getRotateAmount();
            const result = linePiece.rotate(1, mockBoard);
            expect(result).toBe(true);
            expect(linePiece.getRotateAmount()).toBe((initialRot + 1) % 2);
        });

        it('should handle negative rotation and return true if valid', () => {
            linePiece.setRotateAmount(1);
            const result = linePiece.rotate(-1, mockBoard);
            expect(result).toBe(true);
            expect(linePiece.getRotateAmount()).toBe(0);
        });

        it('should wrap rotation amount correctly for positive values', () => {
            const result = linePiece.rotate(3, mockBoard); // (0 + 3) % 2 = 1
            expect(result).toBe(true);
            expect(linePiece.getRotateAmount()).toBe(1);
        });

        it('should wrap rotation amount correctly for negative values', () => {
            const result = linePiece.rotate(-1, mockBoard); // (0 - 1 + 2) % 2 = 1
            expect(result).toBe(true);
            expect(linePiece.getRotateAmount()).toBe(1);
        });

        it('should not rotate and return false if blocked by another piece', () => {
            vi.spyOn(mockBoard, 'isBlockAlreadyFilled').mockReturnValue(true);
            const initialRot = linePiece.getRotateAmount();
            const result = linePiece.rotate(1, mockBoard);
            expect(result).toBe(false);
            expect(linePiece.getRotateAmount()).toBe(initialRot);
        });

        it('should not rotate and return false if it goes out of bounds', () => {
            // Create a special 1x1 piece that is initially at (0, 0), but when rotated that single block
            // (somehow!) goes out of bounds
            const testPiece = new Piece(Piece.SQUARE, 2);
            testPiece.setData(0, 0, 0, 0);
            testPiece.setData(1, 0, Constants.WIDTH_IN_BLOCKS, 0);

            testPiece.setX(0);
            const initialRot = testPiece.getRotateAmount(); // Should be 0

            const result = testPiece.rotate(1, mockBoard);

            expect(result).toBe(false);
            expect(testPiece.getRotateAmount()).toBe(initialRot);
        });
    });
});
