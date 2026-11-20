import { RLuwa } from "../classes/rluwa.js";

(async () => {
    const response = await RLuwa.bytecode("print('bytecode test')", {
        optimizeLevel: 1,
        debugLevel: 1,
        output: "vm"
    });

    console.dir(response, { depth: null, colors: true });
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
