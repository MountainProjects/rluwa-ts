import { RLuwa } from "./rluwa.js";
import type { ParsedSyntaxTree } from "../types/ast.js";
import type { BytecodeOptions, BytecodeResponse, RunOptions } from "../types/endpoints.js";
import type { Session } from "./session.js";

export class Code {
    public source: string

    constructor(source: string) {
        this.source = source;
    }

    /**
        Parses code into syntax tree

        @returns Syntax tree
        @at https://api.rluwa.com/ast
    */
    async parseAst(): Promise<ParsedSyntaxTree> {
        const response = await RLuwa.parseAst(this.source);
        return response;
    }

    /**
        Formats code.

        @returns Formatted code
        @at https://api.rluwa.com/format
    */
    async format(): Promise<string> {
        const response = await RLuwa.format(this.source);
        this.source = response;

        return response;
    }

    /** Compiles this Luau source with the API compiler. */
    async bytecode(options?: BytecodeOptions): Promise<BytecodeResponse> {
        return RLuwa.bytecode(this.source, options);
    }

    /** Starts executing this Luau source. */
    async run(streamOrOptions: boolean | RunOptions = true): Promise<Session> {
        return RLuwa.run(this.source, streamOrOptions);
    }
}
