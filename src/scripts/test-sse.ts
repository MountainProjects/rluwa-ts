import { RLuwa } from "../classes/rluwa.js";

(async () => {
    const session = await RLuwa.run("print('sse test')", true);
    const stream = await session.stream();

    for await (const chunk of stream) {
        process.stdout.write(String(chunk));
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
