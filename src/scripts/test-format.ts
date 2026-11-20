import { RLuwa } from "../classes/rluwa.js";

(async () => {
    const response = await RLuwa.format("for i = 1, 3 do print('a') end");
    console.log(response);
})();