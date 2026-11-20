import { RLuwa } from "../classes/rluwa.js";

(async () => {
    const response = await RLuwa.parseAst("for i = 1, 3 do print('a') end");
    
    console.dir(response, {
        depth: null,
        colors: true
    });
})();