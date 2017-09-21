var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
  var tower = Game.getObjectById('TOWER_ID');
  if(tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax
      });
      if(closestDamagedStructure) {
          tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
          tower.attack(closestHostile);
      }
  }

  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  //console.log('harvester: ' + harvesters.length);

  //spawn for first patch
  if(harvesters.length < 2) {
      var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
      //console.log('Spawning new harvester: ' + newName);
  }
  else if(upgraders.length < 2) {
      var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
      //console.log('Spawning new upgrader: ' + newName);
  }
  else if(builders.length < 5) {
      var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
      //console.log('Spawning new builder: ' + newName);
  }

  if(Game.spawns['Spawn1'].spawning) {
      var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
      Game.spawns['Spawn1'].room.visual.text(
          '🛠️' + spawningCreep.memory.role,
          Game.spawns['Spawn1'].pos.x + 1,
          Game.spawns['Spawn1'].pos.y,
          {align: 'left', opacity: 0.8});
  }

  var harvesterID = 1
  for(var name in Game.creeps) {
      var creep = Game.creeps[name];

      creep.memory.harvestsource = harvesterID % 3
      harvesterID++;
      //creep.say('🔄 har' + creep.memory.harvestsource);
      //console.log('harvesterID: ' + harvesterID % 2);

      if(creep.memory.role == 'harvester') {
          roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
      }
  }
}
