var TACTIC = (function(interf){


	interf.GoToDestinationInFlock = function(path, groupBehavior){

		var that = {};
		var bgrps = [
		[
			 {behavior: BEHAVIOR.WallAvoid(20,80), weight:20}
		],
		[
			{behavior: BEHAVIOR.CollisionAvoidance(15, 70), weight: 0.5}
		],
		[ 
			{behavior: BEHAVIOR.PathFollow(path, 20, 60), weight: 10},
			{behavior: BEHAVIOR.Separation(), weight: 0.1},
		 	 {behavior: BEHAVIOR.Align(), weight:5}
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

				if(collision.time < 3 || collision.dist){
					boid.pushTacticOnStack(TACTIC.CollisionBackOff2(boid, collision.boid.state.position, collision.boid));
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
