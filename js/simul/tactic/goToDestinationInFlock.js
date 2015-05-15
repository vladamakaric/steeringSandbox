var TACTIC = (function(interf){


	interf.GoToDestinationInFlock = function(path){

		var that = {};
		var pbGroups = TACTIC.PriorityBehaviorGroups([  
		[
			{behavior: BEHAVIOR.WallAvoid(20,40), weight:40}
		],
		[ 

			// {behavior: BEHAVIOR.PathFollowConstructor(boidPath, 20, 60), weight: 1},
			{behavior: BEHAVIOR.Wander(15, 70), weight: 0.5}
		]
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
