import { RLuwa } from "./rluwa.js";
import type {
    ButtonRequest,
    ButtonResponse,
    ExecutionEvent,
    ExecutionEventStream,
    InputRequest,
    InputResponse,
    MessageResponse
} from "../types/endpoints.js";
import type { RunResult } from "../types/run.js";

/** An active Luau execution and its token-bound operations. */
export class Session implements AsyncIterable<ExecutionEvent> {
    constructor(public readonly token: string) {}

    async result(): Promise<RunResult> {
        return RLuwa.getResult(this.token);
    }

    async stream(): Promise<ExecutionEventStream> {
        return RLuwa.stream(this.token);
    }

    /** Parses the SSE stream into typed execution events. */
    async *events(): AsyncGenerator<ExecutionEvent> {
        const stream = await this.stream();
        let buffer = "";

        for await (const chunk of stream) {
            buffer += typeof chunk === "string" ? chunk : chunk.toString("utf8");

            let separator = findEventSeparator(buffer);
            while (separator !== -1) {
                const frame = buffer.slice(0, separator);
                buffer = buffer.slice(separator + (buffer.startsWith("\r\n\r\n", separator) ? 4 : 2));
                const event = parseEventFrame(frame);
                if (event) yield event;
                separator = findEventSeparator(buffer);
            }
        }

        const event = parseEventFrame(buffer);
        if (event) yield event;
    }

    [Symbol.asyncIterator](): AsyncGenerator<ExecutionEvent> {
        return this.events();
    }

    async input(body: InputRequest): Promise<InputResponse> {
        return RLuwa.input(this.token, body);
    }

    async sendInput(input: string): Promise<InputResponse> {
        return RLuwa.sendInput(this.token, input);
    }

    async sendFile(base64Content: string): Promise<InputResponse> {
        return RLuwa.sendFile(this.token, base64Content);
    }

    async button(buttonId: string): Promise<ButtonResponse> {
        return RLuwa.button(this.token, { buttonId });
    }

    async stop(): Promise<MessageResponse> {
        return RLuwa.stop(this.token);
    }
}

function findEventSeparator(value: string): number {
    const lf = value.indexOf("\n\n");
    const crlf = value.indexOf("\r\n\r\n");

    if (lf === -1) return crlf;
    if (crlf === -1) return lf;
    return Math.min(lf, crlf);
}

function parseEventFrame(frame: string): ExecutionEvent | undefined {
    let eventName = "message";
    const data: string[] = [];

    for (const line of frame.split(/\r?\n/)) {
        if (line.startsWith("event:")) eventName = line.slice(6).trim();
        if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
    }

    if (data.length === 0 || !isExecutionEventName(eventName)) return undefined;

    return {
        event: eventName,
        data: JSON.parse(data.join("\n"))
    } as ExecutionEvent;
}

function isExecutionEventName(value: string): value is ExecutionEvent["event"] {
    return value === "output" || value === "file" || value === "buttons" || value === "done" || value === "error";
}
