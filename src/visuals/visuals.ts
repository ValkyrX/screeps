// Room visuals collection

import {HUD} from "./visuals_HUD";

export var visuals = {
    drawSpawnInfo: function (room) {
        for (let spawn of room.spawns) {
            if (spawn.spawning) {
                new RoomVisual(room.name).text("🛠 " + spawn.statusMessage,
                                               spawn.pos.x + 1, spawn.pos.y, {font: '0.7', align: 'left'});
            }
        }
    },

    drawStorageInfo: function (room) {
        if (room.storage) {
            new RoomVisual(room.name).text(
                Math.floor(room.storage.store[RESOURCE_ENERGY] / 1000) + "K", room.storage.pos, {font: '0.7'});
        }
    },

    drawRoomVisuals: function (room) {
        this.drawSpawnInfo(room);
        this.drawStorageInfo(room);
        // this.drawCreepInfo(room);
    },

    drawGlobalVisuals: function () {
        HUD.draw();
    }
};

// const profiler = require('screeps-profiler');
import profiler = require('../lib/screeps-profiler'); profiler.registerObject(visuals, 'visuals');
