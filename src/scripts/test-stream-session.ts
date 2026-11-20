import { RLuwa } from "../classes/rluwa.js";

(async () => {
    const session = await RLuwa.run("print('typed stream test')", true);

    for await (const event of session) {
        console.dir(event, { depth: null, colors: true });
        if (event.event === "done" || event.event === "error") return;
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
