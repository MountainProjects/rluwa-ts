import axios from "axios"
import { APIError } from "./apiError.js";
import { Session } from "./session.js";
import type { ParsedSyntaxTree } from "../types/ast.js";
import { transformAst } from "../utils/transformAst.js";
import type { RunResult } from "../types/run.js";
import type {
    BytecodeOptions,
    BytecodeResponse,
    ButtonRequest,
    ButtonResponse,
    ExecutionEventStream,
    InputRequest,
    InputResponse,
    MessageResponse,
    RunOptions,
} from "../types/endpoints.js";

export abstract class RLuwa {
    private static URL: string = "https://api.rluwa.com"

    private static throwIfApiError(data: unknown, endpoint: string, status: number, response: unknown): void {
        if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
            throw new APIError(data.error, endpoint, status, response);
        }
    }

    /**
        Starts parsing provided code and returns token.

        @param code Code to parse
        @returns RunResponse
        @at https://api.rluwa.com/run
    */
    static async run(code: string, streamOrOptions: boolean | RunOptions = true): Promise<Session> {
        const stream = typeof streamOrOptions === "object" ? true : streamOrOptions;
        const response = await axios.post<{ token: string }>(`${this.URL}/run`, { code, stream });
        this.throwIfApiError(response.data, "POST /run", response.status, response);
        const session = new Session(response.data.token);
        if (typeof streamOrOptions === "object") session.startStreaming(streamOrOptions);
        return session;
    }

    /**
        Returns the result

        @param code Code to parse
        @returns RunResponse
        @at https://api.rluwa.com/result/:token
    */
    static async getResult(token: string): Promise<RunResult> {
        const response = await axios.get<RunResult>(`${this.URL}/result/${encodeURIComponent(token)}`);
        this.throwIfApiError(response.data, "GET /result/:token", response.status, response);

        return response.data;
    }

    /**
        Parses code into syntax tree

        @param code Code to parse
        @returns Syntax tree
        @at https://api.rluwa.com/ast
    */
    static async parseAst(code: string): Promise<ParsedSyntaxTree> {
        const response = await axios.post<{ ast: string }>(`${this.URL}/ast`, { code });
        this.throwIfApiError(response.data, "POST /ast", response.status, response);

        const json = JSON.parse(response.data.ast);

        return transformAst(json) as ParsedSyntaxTree;
    }

    /**
        Formats code.

        @param code Code to format
        @returns Formatted code
        @at https://api.rluwa.com/format
    */
    static async format(code: string): Promise<string> {
        const response = await axios.post<{ formatted?: string }>(`${this.URL}/format`, { code });
        this.throwIfApiError(response.data, "POST /format", response.status, response);

        return response.data.formatted ?? code;
    }

    /**
     * Compiles code and returns the API's compiled output.
     *
     * @param code Code to compile
     * @param options Compiler options
     * @at https://api.rluwa.com/bytecode
     */
    static async bytecode(code: string, options?: BytecodeOptions): Promise<BytecodeResponse> {
        const response = await axios.post<BytecodeResponse>(`${this.URL}/bytecode`, { code, options });
        this.throwIfApiError(response.data, "POST /bytecode", response.status, response);

        return response.data;
    }

    /**
     * Compiles code and returns the result as plain text.
     *
     * `parameters` supports undocumented API query encoding variations and is
     * sent unchanged alongside the documented code value.
     *
     * @param code Code to compile
     * @param options Compiler options
     * @at https://api.rluwa.com/bytecode
     */
    static async getBytecode(code: string): Promise<string> {
        const response = await axios.get<unknown>(`${this.URL}/bytecode`, {
            params: { code }
        });

        this.throwIfApiError(response.data, "GET /bytecode", response.status, response);

        if (typeof response.data !== "string") {
            throw new APIError("Expected plain-text bytecode response", "GET /bytecode", response.status, response);
        }
        
        return response.data;
    }

    /**
     * Returns the AST as plain text.
     *
     * @param code Code to parse
     * @at https://api.rluwa.com/ast
     */
    static async getAst(code: string): Promise<string> {
        const response = await axios.get<unknown>(`${this.URL}/ast`, { params: { code } });
        this.throwIfApiError(response.data, "GET /ast", response.status, response);

        if (typeof response.data !== "string") {
            throw new APIError("Expected plain-text AST response", "GET /ast", response.status, response);
        }
        return response.data;
    }

    /**
     * Opens an SSE stream for an active execution.
     *
     * The API does not document event names or payloads, so the raw readable
     * stream is returned to let callers parse the wire format themselves.
     *
     * @param token Execution token
     * @at https://api.rluwa.com/stream/:token
     */
    static async stream(token: string): Promise<ExecutionEventStream> {
        const response = await axios.get<ExecutionEventStream>(`${this.URL}/stream/${encodeURIComponent(token)}`, {
            responseType: "stream",
            headers: { Accept: "text/event-stream" }
        });

        return response.data;
    }

    /** Sends text input or base64 file data to an active execution. */
    static async input(token: string, body: InputRequest): Promise<InputResponse> {
        const response = await axios.post<InputResponse>(`${this.URL}/input/${encodeURIComponent(token)}`, body);
        this.throwIfApiError(response.data, "POST /input/:token", response.status, response);
        return response.data;
    }

    /** Sends text input. */
    static async sendInput(token: string, input: string): Promise<InputResponse> {
        return this.input(token, { input });
    }

    /** Sends a complete file as base64-encoded content. */
    static async sendFile(token: string, content: string): Promise<InputResponse> {
        return this.input(token, { input: content, isFile: true });
    }

    /** Stops an active execution. */
    static async stop(token: string): Promise<MessageResponse> {
        const response = await axios.post<MessageResponse>(`${this.URL}/stop/${encodeURIComponent(token)}`);
        this.throwIfApiError(response.data, "POST /stop/:token", response.status, response);
        return response.data;
    }

    /** Presses a script button by its buttonId. */
    static async button(token: string, body: ButtonRequest): Promise<ButtonResponse> {
        const response = await axios.post<ButtonResponse>(`${this.URL}/button/${encodeURIComponent(token)}`, body);
        this.throwIfApiError(response.data, "POST /button/:token", response.status, response);
        return response.data;
    }
}
