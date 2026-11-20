import { parseLocation } from "./parseLocation.js";

export function transformAst(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(transformAst);
    }

    if (value === null || typeof value !== "object") {
        return value;
    }

    const objectValue = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [key, property] of Object.entries(objectValue)) {
        if (key === "location" && typeof property === "string") {
            const { startsAt, endsAt } = parseLocation(property);

            result.startsAt = startsAt;
            result.endsAt = endsAt;
        } else if (key === "argLocation" && typeof property === "string") {
            const { startsAt, endsAt } = parseLocation(property);

            result.argsStartsAt = startsAt;
            result.argsEndsAt = endsAt;
        } else if (key === "commentLocations" && Array.isArray(property)) {
            result.commentLocations = property.map(comment =>
                typeof comment === "string" ? parseLocation(comment) : comment
            );
        } else {
            result[key] = transformAst(property);
        }
    }

    return result;
}