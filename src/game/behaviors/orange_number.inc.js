import { MODEL_SPARKLES } from "../../include/model_ids";
import { ACTIVE_FLAG_DEACTIVATED, oAnimState, oBehParams2ndByte, oPosY, oTimer, oVelY } from "../../include/object_constants";
import { spawn_object } from "../ObjectHelpers";

const bhv_orange_number_init = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;

    o.rawData[oAnimState] = o.rawData[oBehParams2ndByte];
    o.rawData[oVelY] = 26.0;
}

const bhv_orange_number_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;

    o.rawData[oPosY] += o.rawData[oVelY];
    o.rawData[oVelY] -= 2.0;

    if (o.rawData[oVelY] < -21.0) {
        o.rawData[oVelY] = 14.0;
    }

    if (o.rawData[oTimer] == 35) {
        let sparkle = spawn_object(o, MODEL_SPARKLES, gLinker.behaviors.bhvGoldenCoinSparkles)
        sparkle.rawData[oPosY] -= 30.0;
        o.activeFlags = ACTIVE_FLAG_DEACTIVATED;
    }
}

gLinker.bhv_orange_number_init = bhv_orange_number_init;
gLinker.bhv_orange_number_loop = bhv_orange_number_loop;