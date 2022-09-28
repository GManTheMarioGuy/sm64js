/**
 * Behavior for WDW arrow lifts.
 * When a player stands on an arrow lift, it starts moving between
 * two positions 384 units apart.
 * Arrow lifts move either along the X axis or the Z axis.
 * Their facing angle is always perpendicular to the axis they move on.
 * The angle the arrow lifts move initially is 90º clockwise of the face angle.
 * This means an arrow lift at (0, 0, 0) with face angle 0 (positive Z) will
 * move between (0, 0, 0) and (-384, 0, 0).
 */

import {
    oFaceAngleYaw, oForwardVel, oArrowLiftDisplacement, oVelY, oMoveAngleYaw,
    oAction, oTimer,

    ARROW_LIFT_NOT_DONE_MOVING, ARROW_LIFT_DONE_MOVING, ARROW_LIFT_ACT_IDLE,
    ARROW_LIFT_ACT_MOVING_AWAY, ARROW_LIFT_ACT_MOVING_BACK
} from "../../include/object_constants"
import { obj_move_xyz_using_fvel_and_yaw } from "../ObjBehaviors"

/**
 * Move the arrow lift away from its original position.
 */
const arrow_lift_move_away = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    let status = ARROW_LIFT_NOT_DONE_MOVING
    o.rawdata[oMoveAngleYaw] = o.rawdata[oFaceAngleYaw] - 0x4000
    o.rawdata[oVelY] = 0
    o.rawdata[oForwardVel] = 12
    // Cumulative displacement is used to keep track of how far the platform
    // has travelled, so that it can stop.
    o.rawdata[oArrowLiftDisplacement] += o.rawdata[oForwardVel]

    // Stop the platform after moving 384 units.
    if (o.rawdata[oArrowLiftDisplacement] > 384) {
        o.rawdata[oForwardVel] = 0
        o.rawdata[oArrowLiftDisplacement] = 384
        status = ARROW_LIFT_DONE_MOVING
    }

    obj_move_xyz_using_fvel_and_yaw(o)
    return status
}

/**
 * Move the arrow lift back to its original position.
 */
const arrow_lift_move_back = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject

    let status = ARROW_LIFT_NOT_DONE_MOVING
    o.rawdata[oMoveAngleYaw] = o.rawdata[oFaceAngleYaw] + 0x4000

    o.rawdata[oVelY] = 0
    o.rawdata[oArrowLiftDisplacement] = 0
    
    // Stop the platform after returning back to its original position.
    if (o.rawdata[oArrowLiftDisplacement] < 0) {
        o.rawdata[oForwardVel] = 0
        o.rawdata[oArrowLiftDisplacement] = 0
        status = ARROW_LIFT_DONE_MOVING
    }

    obj_move_xyz_using_fvel_and_yaw(o)
    return status
}

/**
 * Arrow lift update function.
 */
export const bhv_arrow_lift_loop = () => {
    const o = gLinker.ObjectListProcessor.gCurrentObject
    const gMarioObject = gLinker.ObjectListProcessor.gMarioObject
    console.log("test")
    switch (o.oAction) {
        case ARROW_LIFT_ACT_IDLE:
            console.log("IDLE")
            // Wait 61 frames before moving.
            if (o.rawdata[oTimer] > 60) {
                if (gMarioObject.platform == o) {
                    o.oAction = ARROW_LIFT_ACT_MOVING_AWAY
                }
            }
            break

        case ARROW_LIFT_ACT_MOVING_AWAY:
            console.log("AWAY")
            if (arrow_lift_move_away() == ARROW_LIFT_DONE_MOVING) {
                o.oAction = o.rawdata[ARROW_LIFT_ACT_MOVING_BACK]
            }

            break
        
        case ARROW_LIFT_ACT_MOVING_BACK:
            console.log("BACK")
            // Wait 61 frames before moving (after stopping after moving forwards).
            if (o.rawdata[oTimer] > 60) {
                if (arrow_lift_move_back() == ARROW_LIFT_DONE_MOVING) {
                    o.oAction = ARROW_LIFT_ACT_IDLE
                }
            }

            break
    }
}

gLinker.bhv_arrow_lift_loop = bhv_arrow_lift_loop