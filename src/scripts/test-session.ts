import { RLuwa } from "../classes/rluwa.js";

(async () => {
    const session = await RLuwa.run("local value = io.read(); print(value)", false);
    console.log(`session: ${session.token}`);

    await new Promise(resolve => setTimeout(resolve, 1200));
    await session.sendInput("session input test");

    for (let attempt = 0; attempt < 20; attempt += 1) {
        const result = await session.result();
        if (result.content.includes("session input test") || result.status !== "running") {
            console.dir(result, { depth: null, colors: true });
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    await session.stop();
    throw new Error("Session did not receive input within 10 seconds");
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
