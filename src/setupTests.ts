// A minimal mock for DOMMatrix to make tests pass in a JSDOM environment.
// You may need to add mock implementations for any methods your code actually uses.
import {vi} from "vitest";

class DOMMatrixMock {
    is2D = true;
    isIdentity = true;
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    m11 = 1; m12 = 0; m13 = 0; m14 = 0;
    m21 = 0; m22 = 1; m23 = 0; m24 = 0;
    m31 = 0; m32 = 0; m33 = 1; m34 = 0;
    m41 = 0; m42 = 0; m43 = 0; m44 = 1;

    scale() {
        return this;
    }
}

window.DOMMatrix = DOMMatrixMock as unknown as typeof DOMMatrix;

class MockFontFace {
    status: string;

    constructor(public family: string, public source: string, public descriptors: string) {
        this.status = 'unloaded'; // Simulate initial status
    }

    load() {
        this.status = 'loaded'; // Simulate loading
        return Promise.resolve(this);
    }
}

window.FontFace = MockFontFace as unknown as typeof FontFace;

const mockFontFaceSet = {
    add: vi.fn(),
    ready: Promise.resolve(),
    // You might also want to mock other methods like delete(), clear(), etc.
};

Object.defineProperty(document, 'fonts', {
    writable: true,
    value: mockFontFaceSet,
});
