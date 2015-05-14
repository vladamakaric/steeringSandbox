var TACTIC = (function(interf){


	interf.GoToDestinationInFlock = function(){

		var that = {};
		var pbGroups = TACTIC.PriorityBehaviorGroups([  
		[ {behavior: BEHAVIOR.Wander(50, 60), weight: 1} ]	
		]);

		that.getNextStep = function(boid, BWI){

			if(boid.isObstacleCollisionImminent(BWI)){
				boid.pushTacticOnStack(TACTIC.CollisionBackOff(boid, BWI));
				return {status: TACTIC.DELEGATE};
			}

			var force = pbGroups.getForce(boid, BWI);

			return {status: TACTIC.IN_PROGRESS, force: force};
		}


		return that;
	}


	return interf;
})(TACTIC || {});
