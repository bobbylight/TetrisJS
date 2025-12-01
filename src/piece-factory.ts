import { Piece } from './piece.ts';

const createLeftHookPiece = (): Piece => {
    const piece = new Piece(Piece.LEFT_HOOK, 4);

    piece.setData(0, 0, 3, 0);
    piece.setData(0, 1, 3, 1);
    piece.setData(0, 2, 2, 1);
    piece.setData(0, 3, 1, 1);

    piece.setData(1, 0, 3, 2);
    piece.setData(1, 1, 2, 2);
    piece.setData(1, 2, 2, 1);
    piece.setData(1, 3, 2, 0);

    piece.setData(2, 0, 1, 2);
    piece.setData(2, 1, 1, 1);
    piece.setData(2, 2, 2, 1);
    piece.setData(2, 3, 3, 1);

    piece.setData(3, 0, 1, 0);
    piece.setData(3, 1, 2, 0);
    piece.setData(3, 2, 2, 1);
    piece.setData(3, 3, 2, 2);

    return piece;
};

const createLetterSPiece = (): Piece => {
    const piece = new Piece(Piece.LETTER_S, 4);

    piece.setData(0, 0, 0, 1);
    piece.setData(0, 1, 1, 1);
    piece.setData(0, 2, 1, 0);
    piece.setData(0, 3, 2, 0);

    piece.setData(1, 0, 1, 0);
    piece.setData(1, 1, 1, 1);
    piece.setData(1, 2, 2, 1);
    piece.setData(1, 3, 2, 2);

    piece.setData(2, 0, 0, 1);
    piece.setData(2, 1, 1, 1);
    piece.setData(2, 2, 1, 0);
    piece.setData(2, 3, 2, 0);

    piece.setData(3, 0, 1, 0);
    piece.setData(3, 1, 1, 1);
    piece.setData(3, 2, 2, 1);
    piece.setData(3, 3, 2, 2);

    return piece;
};

const createLetterTPiece = (): Piece => {
    const piece = new Piece(Piece.LETTER_T, 4);

    piece.setData(0, 0, 1, 0);
    piece.setData(0, 1, 0, 1);
    piece.setData(0, 2, 1, 1);
    piece.setData(0, 3, 2, 1);

    piece.setData(1, 0, 1, 0);
    piece.setData(1, 1, 1, 1);
    piece.setData(1, 2, 1, 2);
    piece.setData(1, 3, 2, 1);

    piece.setData(2, 0, 1, 2);
    piece.setData(2, 1, 0, 1);
    piece.setData(2, 2, 1, 1);
    piece.setData(2, 3, 2, 1);

    piece.setData(3, 0, 1, 0);
    piece.setData(3, 1, 1, 1);
    piece.setData(3, 2, 1, 2);
    piece.setData(3, 3, 0, 1);

    return piece;
};

const createLetterZPiece = (): Piece => {
    const piece = new Piece(Piece.LETTER_Z, 2);

    piece.setData(0, 0, 0, 0);
    piece.setData(0, 1, 1, 0);
    piece.setData(0, 2, 1, 1);
    piece.setData(0, 3, 2, 1);

    piece.setData(1, 0, 2, 0);
    piece.setData(1, 1, 1, 1);
    piece.setData(1, 2, 2, 1);
    piece.setData(1, 3, 1, 2);

    return piece;
};

const createLinePiece = (): Piece => {
    const piece = new Piece(Piece.LINE, 2);

    piece.setData(0, 0, 0, 1);
    piece.setData(0, 1, 1, 1);
    piece.setData(0, 2, 2, 1);
    piece.setData(0, 3, 3, 1);

    piece.setData(1, 0, 1, 0);
    piece.setData(1, 1, 1, 1);
    piece.setData(1, 2, 1, 2);
    piece.setData(1, 3, 1, 3);

    return piece;
};

const createPiece = (pieceType: number): Piece => {
    switch (pieceType) {
        case Piece.LEFT_HOOK:
            return createLeftHookPiece();
        case Piece.LETTER_S:
            return createLetterSPiece();
        case Piece.LETTER_T:
            return createLetterTPiece();
        case Piece.LETTER_Z:
            return createLetterZPiece();
        case Piece.LINE:
            return createLinePiece();
        case Piece.RIGHT_HOOK:
            return createRightHookPiece();
        default:
        case Piece.SQUARE:
            return createSquarePiece();
    }
};

const createRightHookPiece = (): Piece => {
    const piece = new Piece(Piece.RIGHT_HOOK, 4);

    piece.setData(0, 0, 0, 0);
    piece.setData(0, 1, 0, 1);
    piece.setData(0, 2, 1, 1);
    piece.setData(0, 3, 2, 1);

    piece.setData(1, 0, 1, 0);
    piece.setData(1, 1, 2, 0);
    piece.setData(1, 2, 1, 1);
    piece.setData(1, 3, 1, 2);

    piece.setData(2, 0, 0, 1);
    piece.setData(2, 1, 1, 1);
    piece.setData(2, 2, 2, 1);
    piece.setData(2, 3, 2, 2);

    piece.setData(3, 0, 1, 0);
    piece.setData(3, 1, 1, 1);
    piece.setData(3, 2, 1, 2);
    piece.setData(3, 3, 0, 2);

    return piece;
};

const createSquarePiece = (): Piece => {
    const piece = new Piece(Piece.SQUARE, 1);
    piece.setData(0, 0, 0, 0);
    piece.setData(0, 1, 1, 0);
    piece.setData(0, 2, 0, 1);
    piece.setData(0, 3, 1, 1);
    return piece;
};

export { createPiece, createSquarePiece, createLeftHookPiece, createLetterSPiece, createLetterTPiece, createLetterZPiece, createLinePiece, createRightHookPiece };
