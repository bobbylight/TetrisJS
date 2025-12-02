import { describe, it, expect, beforeEach } from 'vitest';
import { Score } from './score';

describe('Score', () => {
    let scoreInstance: Score;
    const testName = 'PlayerOne';
    const testScore = 12345;
    const testLevel = 5;
    const testDate = new Date('2025-12-01T10:00:00Z');

    beforeEach(() => {
        scoreInstance = new Score(testName, testScore, testLevel, testDate);
    });

    describe('constructor', () => {
        it('should initialize the Score object with correct values', () => {
            expect(scoreInstance.getName()).toBe(testName);
            expect(scoreInstance.getScore()).toBe(testScore.toString());
            expect(scoreInstance.getLevel()).toBe(testLevel.toString());
            expect(scoreInstance.getDate()).toBe(testDate);
        });

        it('should store score and level as strings', () => {
            expect(typeof scoreInstance.getScore()).toBe('string');
            expect(typeof scoreInstance.getLevel()).toBe('string');
        });
    });

    describe('getName', () => {
        it('should return the correct name', () => {
            expect(scoreInstance.getName()).toBe(testName);
        });
    });

    describe('getScore', () => {
        it('should return the correct score as a string', () => {
            expect(scoreInstance.getScore()).toBe(testScore.toString());
        });
    });

    describe('getLevel', () => {
        it('should return the correct level as a string', () => {
            expect(scoreInstance.getLevel()).toBe(testLevel.toString());
        });
    });

    describe('getDate', () => {
        it('should return the correct date object', () => {
            expect(scoreInstance.getDate()).toBe(testDate);
        });
    });
});
