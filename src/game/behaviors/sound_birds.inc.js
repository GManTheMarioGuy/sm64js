import { oBehParams2ndByte } from "../../include/object_constants";
import { SOUND_GENERAL2_BIRD_CHIRP2, SOUND_OBJ2_BIRD_CHIRP1, SOUND_OBJ_BIRD_CHIRP3 } from "../../include/sounds";
import { CAMERA_MODE_BEHIND_MARIO, CameraInstance as Camera } from "../Camera"
import { cur_obj_play_sound_1 } from "../SpawnSound";

const bhv_birds_sound_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject;
    
    if (Camera.gCamera.mode == CAMERA_MODE_BEHIND_MARIO) return;

    switch (o.rawData[oBehParams2ndByte]) {
        case 0:
            cur_obj_play_sound_1(SOUND_OBJ2_BIRD_CHIRP1);
            break;

        case 1:
            cur_obj_play_sound_1(SOUND_GENERAL2_BIRD_CHIRP2);
            break;

        case 2:
            cur_obj_play_sound_1(SOUND_OBJ_BIRD_CHIRP3);
            break;
    }
}

gLinker.bhv_birds_sound_loop = bhv_birds_sound_loop;