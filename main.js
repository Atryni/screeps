var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {
    data: {
        'harvesterCount': 2,
        'harvesterSchemaV1': [WORK, WORK, CARRY, MOVE],
        'harvesterSchemaV2': [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        'harvesterSchemaV3': [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        'upgraderCount': 2,
        'upgraderSchemaV1': [WORK, WORK, CARRY, MOVE],
        'upgraderSchemaV2': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        'upgraderSchemaV3': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        'builderCount': 6,
        'builderSchemaV1': [WORK, WORK, CARRY, MOVE],
        'builderSchemaV2': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        'builderSchemaV3': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    getData: function () {
        return this.data;
    },
    loop: function () {
        data = this.getData();

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var energySchemaLevel = null;

        if (Game.spawns.Home.energy >= 550) {
            energySchemaLevel = 'V3';
        } else if (Game.spawns.Home.energy >= 450) {
            energySchemaLevel = 'V2';
        } else if (Game.spawns.Home.energy >= 300) {
            energySchemaLevel = 'V1';
        }

        if (energySchemaLevel !== null) {
            this.clearCreeps();
            if (harvesters.length < data.harvesterCount) {
                Game.spawns.Home.createCreep(data['harvesterSchema'+energySchemaLevel], null, {role: 'harvester'});
            }
            else if (upgraders.length < data.upgraderCount) {
                Game.spawns.Home.createCreep(data['upgraderSchema'+energySchemaLevel], null, {role: 'upgrader'});
            }
            else if (builders.length < data.builderCount) {
                Game.spawns.Home.createCreep(data['builderSchema'+ energySchemaLevel], null, {role: 'builder'});
            }
        }
        if (Game.spawns.Home.spawning) {
            var spawningCreep = Game.creeps[Game.spawns.Home.spawning.name];
            Game.spawns.Home.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns.Home.pos.x + 1,
                Game.spawns.Home.pos.y,
                {align: 'left', opacity: 0.8});
        }

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep, 1);
            }
            else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep, 0);
            }
            else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep, 1);
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
    }
}

