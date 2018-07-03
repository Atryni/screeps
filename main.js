var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {
    data: {
        'sourcesSpace': [2,6],
        'harvesterCount': 2,
        'harvesterSchemaV1': [WORK, WORK, CARRY, MOVE],
        'harvesterSchemaV2': [WORK, WORK, WORK, CARRY, MOVE, MOVE],
        'harvesterSchemaV3': [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        'upgraderCount': 2,
        'upgraderSchemaV1': [WORK, WORK, CARRY, MOVE],
        'upgraderSchemaV2': [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        'upgraderSchemaV3': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        'builderCount': 6,
        'builderSchemaV1': [WORK, WORK, CARRY, MOVE],
        'builderSchemaV2': [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        'builderSchemaV3': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    getData: function () {
        return this.data;
    },
    loop: function () {
        data = this.getData();
        creepCounter = 0;
        sourcesSpaceIndex = 0;

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        energySchemaLevel = this.schemaLevel(harvesters.length);

        if (energySchemaLevel !== null) {
            this.clearCreeps();
            if (harvesters.length < data.harvesterCount) {
                Game.spawns.Home.createCreep(data['harvesterSchema' + energySchemaLevel], 'Harvester_' + Game.time, {role: 'harvester'});
            }
            else if (upgraders.length < data.upgraderCount) {
                Game.spawns.Home.createCreep(data['upgraderSchema' + energySchemaLevel], 'Upgrader_' + Game.time, {role: 'upgrader'});
            }
            else if (builders.length < data.builderCount) {
                Game.spawns.Home.createCreep(data['builderSchema' + energySchemaLevel], 'Builder_' + Game.time, {role: 'builder'});
            }
        }
        if (Game.spawns.Home.spawning) {
            var spawningCreep = Game.creeps[Game.spawns.Home.spawning.name];
            Game.spawns.Home.room.visual.text(
                spawningCreep.memory.role,
                Game.spawns.Home.pos.x + 1,
                Game.spawns.Home.pos.y,
                {align: 'left', opacity: 0.8});
        }

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep, sourcesSpaceIndex);
            }
            else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep, sourcesSpaceIndex);
            }
            else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep, sourcesSpaceIndex);
            }

            creepCounter++;
            if (creepCounter >= data.sourcesSpace[sourcesSpaceIndex]) {
                creepCounter = 0;
                sourcesSpaceIndex = (sourcesSpaceIndex + 1) % data.sourcesSpace.length;
            }
        }
    },
    clearCreeps: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    schemaLevel: function (harvesterLength = 0) {
        if (Game.spawns.Home.room.energyCapacityAvailable >= 550) {
            if (Game.spawns.Home.room.energyAvailable >= 550)
                return 'V3';
        } else if (Game.spawns.Home.room.energyCapacityAvailable >= 450) {
            if (Game.spawns.Home.room.energyAvailable >= 450)
                return 'V2';
        } else if (Game.spawns.Home.room.energyAvailable >= 300) {
            return 'V1';
        }
        if (harvesterLength == 0 && Game.spawns.Home.room.energyAvailable >= 300)
            return 'V1';
        return null;
    }
}