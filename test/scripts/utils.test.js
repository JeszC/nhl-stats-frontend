import {describe, expect, it} from "vitest";
import {compareNumeric} from "../../src/scripts/utils.js";

describe("compareNumeric", () => {
    describe("given two numbers", () => {
        it("it should return the difference between the two arguments", () => {
            expect(compareNumeric(5, 3)).toBe(2);
            expect(compareNumeric(-5, 3)).toBe(-8);
            expect(compareNumeric(5, -3)).toBe(8);
            expect(compareNumeric(-5, -3)).toBe(-2);
            expect(compareNumeric(5, 5)).toBe(0);
            expect(compareNumeric(-5, -5)).toBe(0);
            expect(compareNumeric(Math.PI, 1.33)).toBeCloseTo(1.81, 2);
        });
    });
    describe("given two arguments of which either (or both) is not a number", () => {
        it("should return 0", () => {
            expect(compareNumeric(null, null)).toBe(0);
            expect(compareNumeric(null, undefined)).toBe(0);
            expect(compareNumeric(undefined, null)).toBe(0);
            expect(compareNumeric(undefined, undefined)).toBe(0);
            expect(compareNumeric(NaN, null)).toBe(-1);
            expect(compareNumeric({}, NaN)).toBe(1);
            expect(compareNumeric([], {})).toBe(0);
            expect(compareNumeric([], [])).toBe(0);
            expect(compareNumeric("", [])).toBe(0);
        });
    });
});
