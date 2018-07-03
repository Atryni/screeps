var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, source) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('Harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('Upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#f44259'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[source], {visualizePathStyle: {stroke: '#53bbdb'}});
            }
        }
    }
};

module.exports = roleUpgrader;