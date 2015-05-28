var TACTIC = (function(interf){


	interf.GoToDestinationInFlock = function(path, groupBehavior){

		var that = {};
		var bgrps = [
		[
			{behavior: BEHAVIOR.CollisionAvoidance(15, 70), weight: 0.5},
		],
		[
			 {behavior: BEHAVIOR.WallAvoid(20,40), weight:40}
			// {behavior: BEHAVIOR.PathFollow(path, 20, 60), weight: 1}
		],
		[ 
			 {behavior: BEHAVIOR.Wander(15, 70), weight: 0.5}
		]
		];

		// if(groupBehavior)
		// {
		// 	bgrps.splice(1, 0, [
		// 			{behavior: BEHAVIOR.Cohesion(), weight:0.5},
		// 			{behavior: BEHAVIOR.Align(), weight:0.4},
		// 			{behavior: BEHAVIOR.Separation(), weight: 0.03}
		// 			]);
		// }

		var pbGroups = TACTIC.PriorityBehaviorGroups(bgrps);

		that.changePath = function(newPath){
			pbGroups.behaviorGroups[2][0].behavior = BEHAVIOR.PathFollow(newPath, 20, 60);

		}

		that.getNextStep = function(boid, BWI){

			if(boid.isObstacleCollisionImminent(BWI)){
				boid.pushTacticOnStack(TACTIC.CollisionBackOff(boid, BWI));
				return {status: TACTIC.DELEGATE};
			}
			var collision;

			if(collision = BWI.getFirstCollisionInFOV(Math.PI*2)){
				if(collision.time < 2){
					boid.pushTacticOnStack(TACTIC.CollisionBackOff2(boid, collision.boid.state.position));
					return {status: TACTIC.DELEGATE};
				}
			}
			var force = pbGroups.getForce(boid, BWI);

			return {status: TACTIC.IN_PROGRESS, force: force};
		}


		return that;
	}


	return interf;
})(TACTIC || {});
