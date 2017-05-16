// Mineral supplier - supplied minerals to labs for boosting and processing

import {taskWithdraw} from "../tasks/task_withdraw";
import {taskTransfer} from "../tasks/task_transfer";
import {AbstractCreep, AbstractSetup} from "./Abstract";

export class MineralSupplierSetup extends AbstractSetup {
    constructor() {
        super('mineralSupplier');
        // Role-specific settings
        this.settings.bodyPattern = [CARRY, CARRY, MOVE];
        this.settings.consoleQuiet = true;
        this.settings.sayQuiet = true;
        this.roleRequirements = (creep: Creep) => creep.getActiveBodyparts(MOVE) > 1 &&
                                                  creep.getActiveBodyparts(CARRY) > 1
    }
}

export class MineralSupplierCreep extends AbstractCreep {

    constructor(creep: Creep) {
        super(creep);
    }

    collectForLab(lab: Lab) {
        let term = this.colony.terminal;
        if (term && term.store[lab.assignedMineralType] > 0) {
            var withdrawThis = new taskWithdraw(term);
            withdrawThis.data.resourceType = lab.assignedMineralType;
            return this.assign(withdrawThis);
        } else {
            return "";
        }
    }

    depositForLab(lab: Lab) {
        var transfer = new taskTransfer(lab);
        transfer.data.resourceType = lab.assignedMineralType;
        return this.assign(transfer);
    }

    newTask() {
        this.task = null;
        let loadLabs = _.filter(this.room.labs,
                                (lab: StructureLab) => lab.IO == 'in' &&
                                                       lab.mineralAmount < lab.maxAmount - this.carryCapacity);
        if (loadLabs.length > 0) {
            let lab = loadLabs[0];
            if (_.sum(this.carry) == 0) {
                this.collectForLab(lab);
            } else {
                this.depositForLab(lab);
            }
        }
    }

    onRun() {
        if (this.ticksToLive < 100 && _.sum(this.carry) == 0) {
            this.suicide();
        }
    }
}

