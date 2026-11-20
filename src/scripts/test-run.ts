import { RLuwa } from "../classes/rluwa.js";

(async () => {
    const session = await RLuwa.run("print('session test')", false);
    console.log(`token: ${session.token}`);

    for (let attempt = 0; attempt < 20; attempt += 1) {
        const result = await session.result();
        console.dir(result, { depth: null, colors: true });

        if (result.status !== "running") return;
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    await session.stop();
    throw new Error("Execution did not finish within 10 seconds");
    
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
