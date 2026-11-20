import type { Readable } from "node:stream";

export type BytecodeOutputFormat =
    | "vm"
    | "constants"
    | "remarks"
    | "binary"
    | "asm-x64"
    | "asm-a64"
    | "native-x64"
    | "native-a64";

export interface BytecodeOptions {
    optimizeLevel?: number;
    debugLevel?: number;
    typeLevel?: number;
    output?: BytecodeOutputFormat;
}

export interface BytecodeRequest {
    code: string;
    options?: BytecodeOptions;
}

export interface BytecodeResponseOptions {
    architecture: "x64" | "a64" | string;
    native: boolean;
    asm: boolean;
    ir: boolean;
    binary: boolean;
    remarks: boolean;
    constants: boolean;
    optimizeLevel: number;
    debugLevel: number;
    typeLevel: number;
}

export interface BytecodeResponse {
    bytecode: string;
    options: BytecodeResponseOptions;
}

export interface MessageResponse {
    message: string;
}

export interface InputRequest {
    input: string;
    isFile?: boolean;
    isFileChunk?: boolean;
    uploadId?: string;
    index?: number;
    total?: number;
}

export interface InputResponse extends MessageResponse {
    complete?: boolean;
    received?: number;
    total?: number;
}

export interface ButtonRequest {
    buttonId: string;
}

export interface ButtonResponse extends MessageResponse {
    message: "Clicked";
}

export type RunResultStatus = "running" | "done" | "error" | "closed";

export interface RunFile {
    name: string;
    type: string;
    content: string;
}

export interface RunButton {
    id: string;
    label: string;
    style: "Primary" | "Secondary" | "Success" | "Danger";
    disabled: boolean;
}

export interface SseOutputEvent {
    content: string;
    isLast: boolean;
    runtime: number;
    serverNum: number | null;
}

export interface SseFileEvent extends RunFile {}

export interface SseButtonsEvent {
    buttons: RunButton[];
}

export interface SseErrorEvent {
    message: string;
}

export interface SseDoneEvent {
    runtime: number;
}

export type ExecutionEvent =
    | { event: "output"; data: SseOutputEvent }
    | { event: "file"; data: SseFileEvent }
    | { event: "buttons"; data: SseButtonsEvent }
    | { event: "done"; data: SseDoneEvent }
    | { event: "error"; data: SseErrorEvent };

/** Raw stream for callers that need to parse SSE framing themselves. */
export type ExecutionEventStream = Readable;
