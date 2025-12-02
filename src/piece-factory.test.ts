import { describe, it, expect } from 'vitest';
import {
    createPiece,
    createSquarePiece,
    createLeftHookPiece,
    createLetterSPiece,
    createLetterTPiece,
    createLetterZPiece,
    createLinePiece,
    createRightHookPiece,
} from './piece-factory';
import { Piece } from './piece';
import * as Constants from "./constants.ts";

describe('PieceFactory', () => {
    describe('createLeftHookPiece', () => {
        it('should create a piece of type LEFT_HOOK', () => {
            const piece = createLeftHookPiece();
            expect(piece.getType()).toBe(Piece.LEFT_HOOK);

            expect(piece.getHeight()).toEqual(2 * Constants.BLOCK_SIZE);
            expect(piece.getLeftmostPieceColumn()).toEqual(1);
            expect(piece.getRightmostPieceColumn()).toEqual(3);

            expect(piece.getPieceRow(0)).toEqual(0);
            expect(piece.getPieceColumn(0)).toEqual(3);
            expect(piece.getPieceRow(1)).toEqual(1);
            expect(piece.getPieceColumn(1)).toEqual(3);
            expect(piece.getPieceRow(2)).toEqual(1);
            expect(piece.getPieceColumn(2)).toEqual(2);
            expect(piece.getPieceRow(3)).toEqual(1);
            expect(piece.getPieceColumn(3)).toEqual(1);
        });
    });

    describe('createLetterSPiece', () => {
        it('should create a piece of type LETTER_S with 4 rotations', () => {
            const piece = createLetterSPiece();
            expect(piece.getType()).toBe(Piece.LETTER_S);

            expect(piece.getHeight()).toEqual(2 * Constants.BLOCK_SIZE);
            expect(piece.getLeftmostPieceColumn()).toEqual(0);
            expect(piece.getRightmostPieceColumn()).toEqual(2);

            expect(piece.getPieceRow(0)).toEqual(1);
            expect(piece.getPieceColumn(0)).toEqual(0);
            expect(piece.getPieceRow(1)).toEqual(1);
            expect(piece.getPieceColumn(1)).toEqual(1);
            expect(piece.getPieceRow(2)).toEqual(0);
            expect(piece.getPieceColumn(2)).toEqual(1);
            expect(piece.getPieceRow(3)).toEqual(0);
            expect(piece.getPieceColumn(3)).toEqual(2);
        });
    });

    describe('createLetterTPiece', () => {
        it('should create a piece of type LETTER_T with 4 rotations', () => {
            const piece = createLetterTPiece();
            expect(piece.getType()).toBe(Piece.LETTER_T);

            expect(piece.getHeight()).toEqual(2 * Constants.BLOCK_SIZE);
            expect(piece.getLeftmostPieceColumn()).toEqual(0);
            expect(piece.getRightmostPieceColumn()).toEqual(2);

            expect(piece.getPieceRow(0)).toEqual(0);
            expect(piece.getPieceColumn(0)).toEqual(1);
            expect(piece.getPieceRow(1)).toEqual(1);
            expect(piece.getPieceColumn(1)).toEqual(0);
            expect(piece.getPieceRow(2)).toEqual(1);
            expect(piece.getPieceColumn(2)).toEqual(1);
            expect(piece.getPieceRow(3)).toEqual(1);
            expect(piece.getPieceColumn(3)).toEqual(2);
        });
    });

    describe('createLetterZPiece', () => {
        it('should create a piece of type LETTER_Z with 2 rotations', () => {
            const piece = createLetterZPiece();
            expect(piece.getType()).toBe(Piece.LETTER_Z);

            expect(piece.getHeight()).toEqual(2 * Constants.BLOCK_SIZE);
            expect(piece.getLeftmostPieceColumn()).toEqual(0);
            expect(piece.getRightmostPieceColumn()).toEqual(2);

            expect(piece.getPieceRow(0)).toEqual(0);
            expect(piece.getPieceColumn(0)).toEqual(0);
            expect(piece.getPieceRow(1)).toEqual(0);
            expect(piece.getPieceColumn(1)).toEqual(1);
            expect(piece.getPieceRow(2)).toEqual(1);
            expect(piece.getPieceColumn(2)).toEqual(1);
            expect(piece.getPieceRow(3)).toEqual(1);
            expect(piece.getPieceColumn(3)).toEqual(2);
        });
    });

    describe('createLinePiece', () => {
        it('should create a piece of type LINE with 2 rotations', () => {
            const piece = createLinePiece();
            expect(piece.getType()).toBe(Piece.LINE);

            expect(piece.getHeight()).toEqual(2 * Constants.BLOCK_SIZE);
            expect(piece.getLeftmostPieceColumn()).toEqual(0);
            expect(piece.getRightmostPieceColumn()).toEqual(3);

            expect(piece.getPieceRow(0)).toEqual(1);
            expect(piece.getPieceColumn(0)).toEqual(0);
            expect(piece.getPieceRow(1)).toEqual(1);
            expect(piece.getPieceColumn(1)).toEqual(1);
            expect(piece.getPieceRow(2)).toEqual(1);
            expect(piece.getPieceColumn(2)).toEqual(2);
            expect(piece.getPieceRow(3)).toEqual(1);
            expect(piece.getPieceColumn(3)).toEqual(3);
        });
    });

    describe('createPiece', () => {
        it('should return a Left Hook piece for LEFT_HOOK type', () => {
            const piece = createPiece(Piece.LEFT_HOOK);
            expect(piece.getType()).toBe(Piece.LEFT_HOOK);
        });

        it('should return a Letter S piece for LETTER_S type', () => {
            const piece = createPiece(Piece.LETTER_S);
            expect(piece.getType()).toBe(Piece.LETTER_S);
        });

        it('should return a Letter T piece for LETTER_T type', () => {
            const piece = createPiece(Piece.LETTER_T);
            expect(piece.getType()).toBe(Piece.LETTER_T);
        });

        it('should return a Letter Z piece for LETTER_Z type', () => {
            const piece = createPiece(Piece.LETTER_Z);
            expect(piece.getType()).toBe(Piece.LETTER_Z);
        });

        it('should return a Line piece for LINE type', () => {
            const piece = createPiece(Piece.LINE);
            expect(piece.getType()).toBe(Piece.LINE);
        });

        it('should return a Right Hook piece for RIGHT_HOOK type', () => {
            const piece = createPiece(Piece.RIGHT_HOOK);
            expect(piece.getType()).toBe(Piece.RIGHT_HOOK);
        });

        it('should return a Square piece for SQUARE type', () => {
            const piece = createPiece(Piece.SQUARE);
            expect(piece.getType()).toBe(Piece.SQUARE);
        });

        it('should return a Square piece for an unknown type', () => {
            const piece = createPiece(999);
            expect(piece.getType()).toBe(Piece.SQUARE);
        });
    });

    describe('createRightHookPiece', () => {
        it('should create a piece of type RIGHT_HOOK with 4 rotations', () => {
            const piece = createRightHookPiece();
            expect(piece.getType()).toBe(Piece.RIGHT_HOOK);

            expect(piece.getHeight()).toEqual(2 * Constants.BLOCK_SIZE);
            expect(piece.getLeftmostPieceColumn()).toEqual(0);
            expect(piece.getRightmostPieceColumn()).toEqual(2);

            expect(piece.getPieceRow(0)).toEqual(0);
            expect(piece.getPieceColumn(0)).toEqual(0);
            expect(piece.getPieceRow(1)).toEqual(1);
            expect(piece.getPieceColumn(1)).toEqual(0);
            expect(piece.getPieceRow(2)).toEqual(1);
            expect(piece.getPieceColumn(2)).toEqual(1);
            expect(piece.getPieceRow(3)).toEqual(1);
            expect(piece.getPieceColumn(3)).toEqual(2);
        });
    });

    describe('createSquarePiece', () => {
        it('should create a piece of type SQUARE', () => {
            const piece = createSquarePiece();
            expect(piece.getType()).toBe(Piece.SQUARE);

            expect(piece.getHeight()).toEqual(2 * Constants.BLOCK_SIZE);
            expect(piece.getLeftmostPieceColumn()).toEqual(0);
            expect(piece.getRightmostPieceColumn()).toEqual(1);

            expect(piece.getPieceRow(0)).toEqual(0);
            expect(piece.getPieceColumn(0)).toEqual(0);
            expect(piece.getPieceRow(1)).toEqual(0);
            expect(piece.getPieceColumn(1)).toEqual(1);
            expect(piece.getPieceRow(2)).toEqual(1);
            expect(piece.getPieceColumn(2)).toEqual(0);
            expect(piece.getPieceRow(3)).toEqual(1);
            expect(piece.getPieceColumn(3)).toEqual(1);
        });
    });
});
