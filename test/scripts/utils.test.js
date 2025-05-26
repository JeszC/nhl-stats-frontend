import {describe, expect, it} from "vitest";
import {compareNumeric, compareTextual} from "../../src/scripts/utils.js";

describe("compareNumeric", () => {
    describe("given two (not NaN) numbers", () => {
        it("should return the difference between the two arguments", () => {
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
            expect(compareNumeric([], {})).toBe(0);
            expect(compareNumeric([], [])).toBe(0);
            expect(compareNumeric("", [])).toBe(0);
        });
    });
    describe("given two arguments of which either (or both) is NaN", () => {
        it("should function with NaN", () => {
            expect(compareNumeric(NaN, null)).toBe(-1);
            expect(compareNumeric({}, NaN)).toBe(1);
            expect(compareNumeric(NaN, 5)).toBe(NaN);
            expect(compareNumeric(-3, NaN)).toBe(NaN);
            expect(compareNumeric(NaN, NaN)).toBe(NaN);
        });
    });
});

describe("compareTextual", () => {
    describe("given two strings", () => {
        it("should return the difference between the two arguments", () => {
            expect(compareTextual("test", "test")).toBe(0);
            expect(compareTextual("test", "test ")).toBeLessThan(0);
            expect(compareTextual("bca", "abc")).toBeGreaterThan(0);
            expect(compareTextual("", "  ")).toBeLessThan(0);
        });
    });
    describe("given two arguments of which either (or both) is not a string", () => {
        it("should return 0", () => {
            expect(compareTextual(null, null)).toBe(0);
            expect(compareTextual(null, undefined)).toBe(0);
            expect(compareTextual(undefined, undefined)).toBe(0);
            expect(compareTextual([], {})).toBe(0);
            expect(compareTextual([], [])).toBe(0);
            expect(compareTextual(234, [])).toBe(0);
        });
    });
});
