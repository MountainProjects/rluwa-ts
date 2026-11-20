
export interface RunResponse {
    token: string;
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

export interface RunResult {
    /**
     * Current execution status.
     */
    status: RunResultStatus;

    /**
     * Captured console output.
     */
    content: string;

    /**
     * Execution runtime.
     */
    runtime: number;

    /**
     * Server number that executed the code.
     */
    serverNum: number | null;

    /**
     * Whether the execution happened in Roblox Studio.
     */
    studio?: boolean;

    /**
     * Uploaded output file information.
     */
    file: RunFile | null;

    /**
     * Execution error, if any.
     */
    error: string | null;

    /**
     * Discord buttons attached to the execution response.
     */
    buttons: RunButton[];

    /**
     * Last update timestamp in milliseconds since Unix epoch.
     */
    updatedAt: number;
}
