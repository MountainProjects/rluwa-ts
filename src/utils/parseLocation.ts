import type { AstPosition } from "../types/ast.js";

export interface ParsedLocation {
    startsAt: AstPosition;
    endsAt: AstPosition;
}

export function parseLocation(location: string): ParsedLocation {
    const match = location.match(/^(\d+),(\d+)\s*-\s*(\d+),(\d+)$/);

    if (!match) {
        throw new Error(`Invalid AST location: ${location}`);
    }

    return {
        startsAt: {
            line: Number(match[1]),
            column: Number(match[2])
        },
        endsAt: {
            line: Number(match[3]),
            column: Number(match[4])
        }
    };
}