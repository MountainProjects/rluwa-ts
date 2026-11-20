import { Code } from "../classes/code.js";

(async () => {
    await new Code("print('callback stream test')").run({
        onOutput: content => { process.stdout.write(content); },
        onDone: event => console.log(`finished in ${event.runtime}s`),
        onError: event => console.error(`execution error: ${event.message}`)
    });

})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
