import { spawnSync } from "node:child_process";

const testName = process.argv[2];

const AvailableTests = [
    "ast",
    "bytecode",
    "format",
    "run",
    "sse",
    "session",
    "stream-session",
    "callbacks"
];

if (!testName) {
    console.error("Please specify a test name.");
    console.log(`Available tests: ${AvailableTests.join(", ")}`);
    process.exit(1);
}

if (!AvailableTests.includes(testName)) {
    console.error(`Unknown test: ${testName}`);
    console.log(`Available tests: ${AvailableTests.join(", ")}`);
    process.exit(1);
}

const result = spawnSync(
    process.execPath,
    [`dist/scripts/test-${testName}.js`],
    { stdio: "inherit" }
);

if (result.error) {
    console.error(result.error);
    process.exit(1);
}

process.exit(result.status ?? 1);
