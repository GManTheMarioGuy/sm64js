import * as _Linker from "../../game/Linker"
import { ObjectListProcessorInstance as ObjectListProc } from "../ObjectListProcessor"
import { cur_obj_nearest_object_with_behavior, obj_set_hitbox } from "../ObjectHelpers"
import { INTERACT_COIN, INT_STATUS_INTERACTED } from "../Interaction"
import { oHiddenStarTriggerCounter, oInteractStatus, oPosX, oPosY, oPosZ } from "../../include/object_constants"
import { coin_collected } from "./moving_coin.inc"
import { SurfaceCollisionInstance as SurfaceCollision } from "../../engine/SurfaceCollision"
import { spawn_orange_number } from "../ObjBehaviors"
import { SOUND_MENU_COLLECT_RED_COIN } from "../../include/sounds"
import { play_sound } from "../../audio/external"

import { GameInstance as Game } from "../Game"

const sRedCoinHitbox = {
    interactType: INTERACT_COIN,
    downOffset: 0,
    damageOrCoinValue: 2,
    health: 0,
    numLootCoins: 0,
    radius: 100,
    height: 64,
    hurtboxRadius: 0,
    hurtboxHeight: 0
}


export const bhv_red_coin_init = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;
    
    let floorHeight = SurfaceCollision.find_floor(o.rawData[oPosX], o.rawData[oPosY], o.rawData[oPosZ], {});

    let hiddenRedCoinStar = cur_obj_nearest_object_with_behavior(o, gLinker.behaviors.bhvHiddenRedCoinStar);
    let bowserCourseRedCoinsStar = cur_obj_nearest_object_with_behavior(o, gLinker.behaviors.bhvBowserCourseRedCoinStar);

    if (hiddenRedCoinStar != null) {
        o.parentObj = hiddenRedCoinStar;
    } else if (bowserCourseRedCoinsStar != null) {
        o.parentObj = bowserCourseRedCoinsStar;
    } else {
        o.parentObj = o;
    }

    obj_set_hitbox(o, sRedCoinHitbox)

}

export const bhv_red_coin_loop = () => {
    const o = ObjectListProc.gCurrentObject

    // If Mario interacted with the object...
    if (o.rawData[oInteractStatus] & INT_STATUS_INTERACTED) {
        // ...and there is a red coin star in the level...
        if (o.parentObj != null) {
            // ...increment the star's counter.
            o.parentObj.rawData[oHiddenStarTriggerCounter]++;

            // Spawn the orange number counter, as long as it isn't the last coin.
            if (o.parentObj.rawData[oHiddenStarTriggerCounter] != 8) {
                spawn_orange_number(o.parentObj.rawData[oHiddenStarTriggerCounter], 0, 0, 0)
            }

            play_sound(SOUND_MENU_COLLECT_RED_COIN + (o.parentObj.oHiddenStarTriggerCounter - 1) << 16, Game.gGlobalSoundSource)
        }
        
        coin_collected(o);

        o.rawData[oInteractStatus] = 0;
    }
}

gLinker.bhv_red_coin_init = bhv_red_coin_init
gLinker.bhv_red_coin_loop = bhv_red_coin_loop
