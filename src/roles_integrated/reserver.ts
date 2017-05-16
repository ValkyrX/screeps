// Reserver: reserves rooms targeted with a purple/grey flag or claims a room with purple/purple flag

import {taskGoToRoom} from "../tasks/task_goToRoom";
import {taskSignController} from "../tasks/task_signController";
import {taskReserve} from "../tasks/task_reserve";
import {AbstractCreep, AbstractSetup} from "./Abstract";

export class ReserverSetup extends AbstractSetup {
    constructor() {
        super('reserver');
        // Role-specific settings
        this.settings.bodyPattern = [CLAIM, MOVE];
        this.roleRequirements = (creep: Creep) => creep.getActiveBodyparts(CLAIM) > 1 &&
                                                  creep.getActiveBodyparts(MOVE) > 1
    }
}

export class ReserverCreep extends AbstractCreep {
    assignment: Flag;

    constructor(creep: Creep) {
        super(creep);
    }

    newTask() {
        // If no vision of the room, go to it
        if (!this.assignment.room) {
            return this.assign(new taskGoToRoom(this.assignment));
        }
        // If there is vision of the room, sign and/or reserve the controller
        let controller = this.assignment.room.controller;
        if (!controller.signedByMe) { // Sign the controller if applicable
            return this.assign(new taskSignController(controller));
        } else { // Reserve the controller
            return this.assign(new taskReserve(controller));
        }
    }
}

