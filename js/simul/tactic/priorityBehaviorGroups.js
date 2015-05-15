var TACTIC = (function(interf){
	interf.IN_PROGRESS = 1;
	interf.FINISHED = 2;
	interf.DELEGATE = 3;

	interf.PriorityBehaviorGroups = function( behaviorGroups){
		var that = {};

		that.behaviorGroups = behaviorGroups;
		that.getForce = function(boid, BWI){

			var force = $V([0,0]);

			behaviorGroups.some(function(behaviorGroup){

				behaviorGroup.forEach(function(bd){
					var steeringForce = bd.behavior.getSteeringForce(boid, BWI);
					force = force.add(steeringForce.x(bd.weight));
				});

				if(force.length()!=0)
					return true;
			});

			return force;
		}

		return that;
	}


	return interf;
})(TACTIC || {});
