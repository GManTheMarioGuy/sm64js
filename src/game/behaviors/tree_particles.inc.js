import { MODEL_LEAVES, MODEL_WHITE_PARTICLE_DL } from "../../include/model_ids";
import { ACTIVE_PARTICLE_LEAF, oActiveParticleFlags, oAngleVelPitch, oAngleVelRoll, oFaceAnglePitch, oFaceAngleRoll, oFaceAngleYaw, oFloorHeight, oForwardVel, oMoveAngleYaw, oPosX, oPosY, oPosZ, oTimer, oTreeSnowOrLeafUnkF4, oTreeSnowOrLeafUnkF8, oTreeSnowOrLeafUnkFC, oVelY } from "../../include/object_constants";
import { FLOOR_LOWER_LIMIT } from "../../include/surface_terrains";
import { LEVEL_CCM, LEVEL_SL } from "../../levels/level_defines_constants";
import { coss, random_float, random_u16, sins } from "../../utils";
import { AreaInstance as Area } from "../Area";
import { cur_obj_update_floor_height, obj_mark_for_deletion, obj_scale_xyz, spawn_object } from "../ObjectHelpers"

const bhv_tree_snow_or_leaf_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;
    
    cur_obj_update_floor_height();

    if (o.rawData[oTimer] == 0) {
        o.rawData[oAngleVelPitch] = (random_float() - 0.5) * 0x1000;
        o.rawData[oAngleVelRoll] = (random_float() - 0.5) * 0x1000;
        o.rawData[oTreeSnowOrLeafUnkF8] = 4;
        o.rawData[oTreeSnowOrLeafUnkFC] = random_float() * 0x400 + 0x400;
    }

    if (o.rawData[oPosY] < o.rawData[oFloorHeight]) obj_mark_for_deletion(o);
    if (o.rawData[oFloorHeight] < FLOOR_LOWER_LIMIT) obj_mark_for_deletion(o);
    if (o.rawData[oTimer] > 100) obj_mark_for_deletion(o);

    o.rawData[oFaceAnglePitch] += o.rawData[oAngleVelPitch];
    o.rawData[oFaceAngleRoll] += o.rawData[oAngleVelRoll];
    o.rawData[oVelY] += -3.0

    if (o.rawData[oVelY < -8.0]) o.rawData[oVelY] = -8.0;

    if (o.rawData[oForwardVel] > 0) o.rawData[oForwardVel] -= 0.3;
    else o.rawData[oForwardVel] = 0;

    o.rawData[oPosX] += sins(o.rawData[oMoveAngleYaw]) * sins(o.rawData[oTreeSnowOrLeafUnkF4]) * o.rawData[oTreeSnowOrLeafUnkF8];
    o.rawData[oPosZ] += coss(o.rawData[oMoveAngleYaw]) * sins(o.rawData[oTreeSnowOrLeafUnkF4]) * o.rawData[oTreeSnowOrLeafUnkF8];
    o.rawData[oTreeSnowOrLeafUnkF4] += o.rawData[oTreeSnowOrLeafUnkFC];
    o.rawData[oPosY] += o.rawData[oVelY];
}

const bhv_snow_leaf_particle_spawn_init = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;
    const gMarioObject = gLinker.ObjectListProcessor.gMarioObject;

    let isSnow;

    gMarioObject.rawData[oActiveParticleFlags] &= ~ACTIVE_PARTICLE_LEAF;

    if (Area.gCurrLevelNum == LEVEL_CCM || Area.gCurrLevelNum == LEVEL_SL)
         isSnow = true;
    else isSnow = false;

    if (isSnow) {
        if (random_float() < 0.5) {
            let obj = spawn_object(o, MODEL_WHITE_PARTICLE_DL, gLinker.behaviors.bhvTreeSnow);
            obj_scale_xyz(obj, random_float(), random_float(), random_float());
            obj.rawData[oMoveAngleYaw] = random_u16();
            obj.rawData[oForwardVel] = random_float() * 5.0;
            obj.rawData[oVelY] = random_float() * 15.0;
        }
    } else {
        if (random_float() < 0.3) {
            let obj = spawn_object(o, MODEL_LEAVES, gLinker.behaviors.bhvTreeLeaf);
            let scale = random_float() * 3.0;
            obj_scale_xyz(obj, scale, scale, scale)
            obj.rawData[oMoveAngleYaw] = random_u16();
            obj.rawData[oForwardVel] = random_float() * 5.0 + 5.0;
            obj.rawData[oVelY] = random_float() * 15.0;
            obj.rawData[oFaceAnglePitch] = random_u16();
            obj.rawData[oFaceAngleRoll] = random_u16();
            obj.rawData[oFaceAngleYaw] = random_u16();
        }
    }
}

gLinker.bhv_tree_snow_or_leaf_loop = bhv_tree_snow_or_leaf_loop;
gLinker.bhv_snow_leaf_particle_spawn_init = bhv_snow_leaf_particle_spawn_init;