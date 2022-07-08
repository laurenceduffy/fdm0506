import { validateSymbol, validateCompany } from "./validation";

describe("validateSymbol", () => {
    it("should return the given symbol when symbol is 2 characters", () => {
        const symbol = "AB";

        const result = validateSymbol(symbol);
        expect(result).toBe(symbol);
    });

    it("should return the given symbol when symbol is 3 characters", () => {
        const symbol = "ABC";

        const result = validateSymbol(symbol);
        expect(result).toBe(symbol);
    });

    it("should return the given symbol when symbol is 4 characters", () => {
        const symbol = "ABCD";

        const result = validateSymbol(symbol);
        expect(result).toBe(symbol);
    });

    it("should return a trimmed version of the given symbol when whitespace is included", () => {
        const symbol = "  ABC ";
        const expectedSymbol = "ABC"

        const result = validateSymbol(symbol);
        expect(result).toBe(expectedSymbol);
    });

    it("should evaluate as false symbol when symbol is too long", () => {
        const symbol = "ABCDEFGHIJ";

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when symbol is alphanumeric", () => {
        const symbol = "A1B3";

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when symbol is numeric", () => {
        const symbol = "123";

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when symbol contains special characters", () => {
        const symbol = "AB!?";

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when symbol contains special characters only", () => {
        const symbol = "%$!?";

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when symbol is empty string", () => {
        const symbol = "";

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when symbol is whitespace string", () => {
        const symbol = "   ";

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when symbol is undefined", () => {
        const symbol = null;

        const result = validateSymbol(symbol);
        expect(result).toBeFalsy();
    });
});

describe("validateCompany", () => {
    it("should return the given company when company is 2 characters", () => {
        const company = "AB";

        const result = validateCompany(company);
        expect(result).toBe(company);
    });

    it("should return the given company when company is 16 characters", () => {
        const company = "Company ABCDEFGG";

        const result = validateCompany(company);
        expect(result).toBe(company);
    });

    it("should return a trimmed version of the given company when whitespace is included", () => {
        const company = "  Company A ";
        const expectedSymbol = "Company A"

        const result = validateCompany(company);
        expect(result).toBe(expectedSymbol);
    });

    it("should evaluate as false company when company is too long", () => {
        const company = "Company name is way too long based on the given requirements for character count";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company is too short", () => {
        const company = "A";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company is alphanumeric", () => {
        const company = "C0mp4ny N4m3";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company is numeric", () => {
        const company = "9876543210";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company contains special characters", () => {
        const company = "Company A!?";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company contains special characters only", () => {
        const company = "%$!?";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company is empty string", () => {
        const company = "";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company is whitespace string", () => {
        const company = "   ";

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });

    it("should evaluate as false when company is undefined", () => {
        const company = null;

        const result = validateCompany(company);
        expect(result).toBeFalsy();
    });
});