import { gGlobalSoundSource, play_sound } from "../../audio/external";
import { SOUND_AIR_CASTLE_OUTDOORS_AMBIENT } from "../../include/sounds";
import { CAMERA_MODE_BEHIND_MARIO, CameraInstance as Camera } from "../Camera"

const bhv_ambient_sounds_init = () => {
    if (Camera.gCamera.mode == CAMERA_MODE_BEHIND_MARIO) return;

    play_sound(SOUND_AIR_CASTLE_OUTDOORS_AMBIENT, gGlobalSoundSource);
}

gLinker.bhv_ambient_sounds_init = bhv_ambient_sounds_init;